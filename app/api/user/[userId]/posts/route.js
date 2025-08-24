// app/api/user/[userId]/posts/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";

export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const type = searchParams.get("type"); // post, reel, story

    const session = await getServerSession(authOptions);
    await connectDB();

    const { userId } = params;

    // Check if user exists
    const user = await User.findById(userId).select(
      "name firstName lastName profileImage isPrivate"
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check privacy - if private and not owner, return empty
    const isOwner = session && session.user.id === userId;
    if (user.isPrivate && !isOwner) {
      return NextResponse.json({
        success: true,
        posts: [],
        user: {
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImage: user.profileImage,
          isPrivate: true,
        },
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalPosts: 0,
          hasMore: false,
        },
      });
    }

    let query = {
      author: userId,
      isArchived: false,
    };

    if (type) {
      query.type = type;
    }

    // For stories, only show non-expired ones
    if (type === "story") {
      query.$or = [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }];
    }

    const posts = await Post.find(query)
      .populate("author", "name profileImage firstName lastName")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Post.countDocuments(query);

    // Add user interaction info if logged in
    const postsWithInteraction = posts.map((post) => {
      let userInteraction = {};
      if (session) {
        userInteraction = {
          isLiked: post.likes.some(
            (like) => like.user.toString() === session.user.id
          ),
          userVote:
            post.votes.find((vote) => vote.user.toString() === session.user.id)
              ?.type || null,
          isOwner: post.author._id.toString() === session.user.id,
        };
      }
      return {
        ...post,
        userInteraction,
      };
    });

    return NextResponse.json({
      success: true,
      posts: postsWithInteraction,
      user: {
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
        isPrivate: user.isPrivate,
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasMore: page < Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("User posts fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
