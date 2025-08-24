// app/api/posts/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import { uploadImage } from "@/lib/cloudinary";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// GET - Get all posts (feed)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const userId = searchParams.get("userId"); // For specific user's posts
    const type = searchParams.get("type"); // post, reel, story

    await connectDB();

    let query = { isArchived: false };

    if (userId) {
      query.author = userId;
    }

    if (type) {
      query.type = type;
    }

    // For stories, only show non-expired ones
    if (type === "story") {
      query.$or = [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }];
    }

    const posts = await Post.find(query)
      .populate("author", "name profileImage firstName lastName")
      .populate("mentions", "name firstName lastName")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Add user interaction info if logged in
    const session = await getServerSession(authOptions);
    if (session) {
      posts.forEach((post) => {
        post.userInteraction = {
          isLiked:
            post.likes?.some(
              (like) => like.user.toString() === session.user.id
            ) || false,
          isOwner: post.author._id.toString() === session.user.id,
        };
      });
    }

    const total = await Post.countDocuments(query);

    return NextResponse.json({
      success: true,
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasMore: page < Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Posts fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new post with media upload and AI suggestions
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Check if user can create posts (50% profile completion)
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const profileCompleteness = calculateProfileCompleteness(user);
    if (profileCompleteness < 50) {
      return NextResponse.json(
        {
          error: "Please complete at least 50% of your profile to create posts",
          profileCompleteness,
        },
        { status: 403 }
      );
    }

    const formData = await request.formData();

    // Extract form data
    const caption = formData.get("caption") || "";
    const location = formData.get("location") || "";
    const type = formData.get("type") || "post";
    const hashtags = formData.get("hashtags")
      ? JSON.parse(formData.get("hashtags"))
      : [];
    const mentions = formData.get("mentions")
      ? JSON.parse(formData.get("mentions"))
      : [];
    const generateSuggestions = formData.get("generateSuggestions") === "true";

    // Handle media uploads
    const mediaFiles = formData.getAll("media");
    const uploadedMedia = [];

    if (mediaFiles.length === 0) {
      return NextResponse.json(
        { error: "At least one media file is required" },
        { status: 400 }
      );
    }

    // Upload media files to Cloudinary
    for (const file of mediaFiles) {
      if (file instanceof File && file.size > 0) {
        try {
          // Convert file to base64 for Cloudinary upload
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const base64 = `data:${file.type};base64,${buffer.toString(
            "base64"
          )}`;

          // Determine media type and folder
          const isVideo = file.type.startsWith("video/");
          const folder = isVideo ? "posts/videos" : "posts/images";

          const uploadResult = await uploadImage(base64, folder);

          uploadedMedia.push({
            type: isVideo ? "video" : "image",
            url: uploadResult.url,
            publicId: uploadResult.publicId,
            width: uploadResult.width,
            height: uploadResult.height,
            mimeType: file.type,
            size: file.size,
          });
        } catch (uploadError) {
          console.error("Media upload error:", uploadError);
          return NextResponse.json(
            { error: "Failed to upload media files" },
            { status: 500 }
          );
        }
      }
    }

    // Generate AI suggestions if requested
    let aiSuggestions = null;
    if (generateSuggestions && uploadedMedia.length > 0) {
      try {
        aiSuggestions = await generateContentSuggestions(
          uploadedMedia,
          caption
        );
      } catch (aiError) {
        console.error("AI suggestion error:", aiError);
        // Don't fail the post creation if AI suggestions fail
        aiSuggestions = {
          suggestedCaptions: [],
          suggestedHashtags: [],
          error: "AI suggestions unavailable",
        };
      }
    }

    // Extract hashtags from caption
    const extractedHashtags = caption
      ? caption
          .match(/#[a-zA-Z0-9_]+/g)
          ?.map((tag) => tag.slice(1).toLowerCase()) || []
      : [];

    const allHashtags = [
      ...new Set([
        ...(hashtags || []),
        ...extractedHashtags,
        ...(aiSuggestions?.suggestedHashtags || []),
      ]),
    ];

    // Set expiry for stories (24 hours)
    let expiresAt = null;
    if (type === "story") {
      expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    }

    const post = new Post({
      author: session.user.id,
      caption: caption || aiSuggestions?.suggestedCaptions?.[0] || "",
      media: uploadedMedia,
      hashtags: allHashtags,
      mentions: mentions || [],
      location,
      type,
      expiresAt,
      aiMetadata: aiSuggestions
        ? {
            suggestedCaptions: aiSuggestions.suggestedCaptions,
            suggestedHashtags: aiSuggestions.suggestedHashtags,
            contentAnalysis: aiSuggestions.contentAnalysis,
            generatedAt: new Date(),
          }
        : null,
    });

    await post.save();

    // Populate author details
    await post.populate("author", "name profileImage firstName lastName");
    await post.populate("mentions", "name firstName lastName");

    return NextResponse.json({
      success: true,
      message: "Post created successfully",
      post: post.toObject(),
      aiSuggestions: aiSuggestions,
    });
  } catch (error) {
    console.error("Post creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Generate content suggestions using Gemini AI
async function generateContentSuggestions(mediaFiles, existingCaption = "") {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Analyze the first media file (image or video thumbnail)
    const firstMedia = mediaFiles[0];

    let prompt = `Analyze this ${firstMedia.type} and provide content suggestions for a social media post. 

Please provide:
1. 3 engaging caption options (keep them under 150 characters each)
2. 5-8 relevant hashtags (without the # symbol)
3. Brief content analysis describing what you see

Current caption context: "${existingCaption}"

Format your response as JSON:
{
  "suggestedCaptions": ["caption1", "caption2", "caption3"],
  "suggestedHashtags": ["hashtag1", "hashtag2", "hashtag3"],
  "contentAnalysis": "Brief description of the content"
}`;

    let result;

    if (firstMedia.type === "image") {
      // For images, we can analyze the visual content
      const imageResponse = await fetch(firstMedia.url);
      const imageBuffer = await imageResponse.arrayBuffer();

      result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: Buffer.from(imageBuffer).toString("base64"),
            mimeType: firstMedia.mimeType,
          },
        },
      ]);
    } else {
      // For videos, provide suggestions based on context
      prompt += `\n\nNote: This is a video file. Please provide general engaging social media captions and hashtags suitable for video content.`;

      result = await model.generateContent(prompt);
    }

    const response = result.response.text();

    // Try to parse JSON response
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
    }

    // Fallback: extract suggestions manually
    return {
      suggestedCaptions: [
        "Share your moment ✨",
        "Capturing life's beautiful details",
        "Every picture tells a story",
      ],
      suggestedHashtags: [
        "lifestyle",
        "moment",
        "photography",
        "share",
        "life",
      ],
      contentAnalysis: "AI analysis temporarily unavailable",
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to generate AI suggestions");
  }
}

function calculateProfileCompleteness(user) {
  let completeness = 0;
  const fields = [
    "name",
    "firstName",
    "lastName",
    "phone",
    "dateOfBirth",
    "gender",
    "address.city",
    "profileImage",
    "preferences.categories",
  ];

  fields.forEach((field) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      if (
        user[parent] &&
        user[parent][child] &&
        (Array.isArray(user[parent][child])
          ? user[parent][child].length > 0
          : true)
      ) {
        completeness += 100 / fields.length;
      }
    } else {
      if (user[field]) completeness += 100 / fields.length;
    }
  });

  return Math.round(completeness);
}
