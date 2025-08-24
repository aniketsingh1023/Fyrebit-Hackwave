// app/api/posts/suggestions/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { uploadImage } from "@/lib/cloudinary";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST - Generate AI content suggestions
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const mediaFile = formData.get("media");
    const context = formData.get("context") || "";
    const postType = formData.get("postType") || "post";

    if (!mediaFile || !(mediaFile instanceof File)) {
      return NextResponse.json(
        { error: "Media file is required" },
        { status: 400 }
      );
    }

    // Upload media temporarily for analysis
    const bytes = await mediaFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${mediaFile.type};base64,${buffer.toString("base64")}`;

    let uploadedMedia;
    try {
      uploadedMedia = await uploadImage(base64, "temp/analysis");
    } catch (uploadError) {
      console.error("Temp upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to process media file" },
        { status: 500 }
      );
    }

    // Generate AI suggestions
    const suggestions = await generateContentSuggestions(
      uploadedMedia,
      mediaFile.type,
      context,
      postType
    );

    // Optionally delete the temporary upload
    // await deleteImage(uploadedMedia.publicId);

    return NextResponse.json({
      success: true,
      suggestions,
      mediaInfo: {
        type: mediaFile.type.startsWith("video/") ? "video" : "image",
        size: mediaFile.size,
        name: mediaFile.name,
      },
    });
  } catch (error) {
    console.error("AI suggestions error:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}

async function generateContentSuggestions(
  uploadedMedia,
  mimeType,
  context,
  postType
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const isVideo = mimeType.startsWith("video/");
    const mediaType = isVideo ? "video" : "image";

    let prompt = `Analyze this ${mediaType} and provide social media content suggestions.

Context: "${context}"
Post Type: ${postType}

Please provide:
1. 5 engaging caption options (vary the length: 2 short under 50 chars, 2 medium under 100 chars, 1 longer under 200 chars)
2. 8-10 relevant hashtags (without # symbol, mix of popular and niche tags)
3. 3 call-to-action suggestions
4. Brief content analysis
5. Mood/tone suggestions
6. Best posting time recommendations

${
  postType === "story"
    ? "Note: This is for a story post, make captions more casual and immediate."
    : ""
}
${
  postType === "reel"
    ? "Note: This is for a reel, make captions more engaging and trending."
    : ""
}

Format as JSON:
{
  "captions": {
    "short": ["caption1", "caption2"],
    "medium": ["caption1", "caption2"], 
    "long": ["caption1"]
  },
  "hashtags": ["tag1", "tag2", ...],
  "callToActions": ["CTA1", "CTA2", "CTA3"],
  "analysis": "Detailed content description",
  "mood": "suggested mood/tone",
  "bestTimes": ["time1", "time2"],
  "colors": ["dominant color1", "color2"],
  "subjects": ["subject1", "subject2"]
}`;

    let result;

    if (!isVideo) {
      // For images, analyze visual content directly
      const imageResponse = await fetch(uploadedMedia.url);
      const imageBuffer = await imageResponse.arrayBuffer();

      result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: Buffer.from(imageBuffer).toString("base64"),
            mimeType: mimeType,
          },
        },
      ]);
    } else {
      // For videos, provide contextual suggestions
      prompt += `\n\nNote: This is a video file. Provide engaging suggestions suitable for video content based on the context and type.`;
      result = await model.generateContent(prompt);
    }

    const response = result.response.text();

    // Parse JSON response
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);

        // Validate and format response
        return {
          captions: parsed.captions || {
            short: ["✨ Perfect moment", "Simply beautiful"],
            medium: [
              "Capturing life's beautiful details ✨",
              "Every moment tells a story 📸",
            ],
            long: [
              "Sometimes the best moments are the ones we never planned. Here's to spontaneous adventures and unexpected joy! 🌟",
            ],
          },
          hashtags: parsed.hashtags || [
            "lifestyle",
            "moment",
            "photography",
            "beautiful",
            "life",
            "inspiration",
            "daily",
            "capture",
          ],
          callToActions: parsed.callToActions || [
            "What do you think?",
            "Share your thoughts below!",
            "Tag someone who needs to see this",
          ],
          analysis:
            parsed.analysis ||
            "Beautiful content with great composition and lighting",
          mood: parsed.mood || "Positive and inspiring",
          bestTimes: parsed.bestTimes || ["9-10 AM", "7-8 PM"],
          colors: parsed.colors || ["Natural tones"],
          subjects: parsed.subjects || ["Lifestyle content"],
          confidence: 0.85,
        };
      }
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
    }

    // Fallback suggestions
    return {
      captions: {
        short: ["✨ Mood", "Perfect vibes"],
        medium: [
          "Living for moments like these ✨",
          "When life gives you good lighting 📸",
        ],
        long: [
          "There's something magical about capturing the perfect moment. It's not just about the image, it's about the story it tells. 🌟",
        ],
      },
      hashtags: [
        "lifestyle",
        "mood",
        "vibes",
        "photography",
        "moment",
        "life",
        "beautiful",
        "inspire",
      ],
      callToActions: [
        "What's your favorite part?",
        "Double tap if you agree!",
        "Share your story below",
      ],
      analysis: "Engaging visual content with good composition",
      mood: "Positive and uplifting",
      bestTimes: ["9-10 AM", "7-8 PM"],
      colors: ["Warm tones"],
      subjects: ["Lifestyle"],
      confidence: 0.7,
      fallback: true,
    };
  } catch (error) {
    console.error("Gemini analysis error:", error);
    throw error;
  }
}
