// app/api/posts/[postId]/comments/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Comment from "@/models/Comment";
import Post from "@/models/Post";

// GET - Get comments for a post
export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const parentCommentId = searchParams.get("parentComment"); // For replies

    await connectDB();
    const { postId } = params;

    let query = {
      post: postId,
      isDeleted: false,
    };

    if (parentCommentId) {
      query.parentComment = parentCommentId;
    } else {
      query.parentComment = null; // Top-level comments only
    }

    const comments = await Comment.find(query)
      .populate("author", "name profileImage firstName lastName")
      .populate("mentions", "name firstName lastName")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Add user interaction info if logged in
    const session = await getServerSession(authOptions);
    if (session) {
      comments.forEach((comment) => {
        comment.userInteraction = {
          isLiked:
            comment.likes?.some(
              (like) => like.user.toString() === session.user.id
            ) || false,
          isOwner: comment.author._id.toString() === session.user.id,
        };
      });
    }

    const total = await Comment.countDocuments(query);

    return NextResponse.json({
      success: true,
      comments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalComments: total,
        hasMore: page < Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Comments fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new comment
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { postId } = params;
    const { content, parentComment, mentions } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    // Check if post exists and comments are enabled
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.commentsEnabled === false) {
      return NextResponse.json(
        { error: "Comments are disabled for this post" },
        { status: 403 }
      );
    }

    // Extract mentions from content
    const mentionRegex = /@([a-zA-Z0-9_]+)/g;
    const extractedMentions = [];
    let match;
    while ((match = mentionRegex.exec(content)) !== null) {
      extractedMentions.push(match[1]);
    }

    const comment = new Comment({
      post: postId,
      author: session.user.id,
      content: content.trim(),
      parentComment: parentComment || null,
      mentions: mentions || extractedMentions,
    });

    await comment.save();

    // Update post comments count
    post.commentsCount = (post.commentsCount || 0) + 1;
    await post.save();

    // If this is a reply, update parent comment replies count
    if (parentComment) {
      await Comment.findByIdAndUpdate(parentComment, {
        $inc: { repliesCount: 1 },
      });
    }

    // Populate comment details
    await comment.populate("author", "name profileImage firstName lastName");
    await comment.populate("mentions", "name firstName lastName");

    return NextResponse.json({
      success: true,
      message: "Comment created successfully",
      comment,
    });
  } catch (error) {
    console.error("Comment creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
