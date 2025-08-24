// app/api/posts/[postId]/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";

// GET - Get single post
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    await connectDB();
    const { postId } = params;

    const post = await Post.findById(postId)
      .populate("author", "name profileImage firstName lastName")
      .populate("mentions", "name firstName lastName");

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if story has expired
    if (
      post.type === "story" &&
      post.expiresAt &&
      post.expiresAt < new Date()
    ) {
      return NextResponse.json({ error: "Story has expired" }, { status: 404 });
    }

    // Increment view count
    post.viewsCount += 1;
    await post.save();

    // Add user interaction info if logged in
    let userInteraction = {};
    if (session) {
      userInteraction = {
        isLiked: post.isLikedBy(session.user.id),
        userVote: post.getVoteByUser(session.user.id)?.type || null,
        isOwner: post.author._id.toString() === session.user.id,
      };
    }

    return NextResponse.json({
      success: true,
      post: {
        ...post.toObject(),
        userInteraction,
      },
    });
  } catch (error) {
    console.error("Post fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update post
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { postId } = params;
    const data = await request.json();

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if user owns the post
    if (post.author.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "You can only edit your own posts" },
        { status: 403 }
      );
    }

    // Update allowed fields
    const { caption, hashtags, location, commentsEnabled, likesHidden } = data;

    if (caption !== undefined) {
      post.caption = caption;
      // Re-extract hashtags from caption
      const extractedHashtags = caption
        ? caption
            .match(/#[a-zA-Z0-9_]+/g)
            ?.map((tag) => tag.slice(1).toLowerCase()) || []
        : [];
      post.hashtags = [...new Set([...(hashtags || []), ...extractedHashtags])];
    }

    if (location !== undefined) post.location = location;
    if (commentsEnabled !== undefined) post.commentsEnabled = commentsEnabled;
    if (likesHidden !== undefined) post.likesHidden = likesHidden;

    await post.save();
    await post.populate("author", "name profileImage firstName lastName");

    return NextResponse.json({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.error("Post update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete post
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { postId } = params;

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if user owns the post
    if (post.author.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "You can only delete your own posts" },
        { status: 403 }
      );
    }

    // Soft delete by archiving
    post.isArchived = true;
    await post.save();

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Post deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
