// app/api/posts/[postId]/like/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";

// POST - Toggle like on a post
export async function POST(request, { params }) {
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

    // Check if post is archived
    if (post.isArchived) {
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

    const userId = session.user.id;
    const isLiked = post.likes.some((like) => like.user.toString() === userId);

    if (isLiked) {
      // Unlike the post
      post.likes = post.likes.filter((like) => like.user.toString() !== userId);
      post.likesCount = Math.max(0, post.likesCount - 1);
    } else {
      // Like the post
      post.likes.push({
        user: userId,
        createdAt: new Date(),
      });
      post.likesCount += 1;
    }

    await post.save();

    // Optional: Create activity/notification for post author
    if (!isLiked && post.author.toString() !== userId) {
      // You can implement notification system here
      // Example: Create notification for post author
      try {
        // This would require a Notification model
        // await createNotification({
        //   recipient: post.author,
        //   actor: userId,
        //   type: 'like',
        //   entityType: 'post',
        //   entityId: postId,
        //   message: `${session.user.name} liked your post`
        // });
      } catch (notificationError) {
        console.error("Notification creation failed:", notificationError);
        // Don't fail the like operation if notification fails
      }
    }

    return NextResponse.json({
      success: true,
      liked: !isLiked,
      likesCount: post.likesCount,
      message: isLiked ? "Post unliked" : "Post liked",
    });
  } catch (error) {
    console.error("Post like toggle error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - Get like status for a post (optional endpoint)
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    await connectDB();
    const { postId } = params;

    const post = await Post.findById(postId).select("likes likesCount");
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    let isLiked = false;
    if (session) {
      isLiked = post.likes.some(
        (like) => like.user.toString() === session.user.id
      );
    }

    // Get recent likers (for showing "liked by X and Y others")
    const recentLikers = await Post.findById(postId)
      .populate({
        path: "likes.user",
        select: "name firstName lastName profileImage",
        options: { limit: 3 },
      })
      .select("likes");

    const likers =
      recentLikers?.likes?.slice(0, 3).map((like) => ({
        _id: like.user._id,
        name:
          like.user.name ||
          `${like.user.firstName} ${like.user.lastName}`.trim(),
        profileImage: like.user.profileImage,
      })) || [];

    return NextResponse.json({
      success: true,
      isLiked,
      likesCount: post.likesCount,
      recentLikers: likers,
    });
  } catch (error) {
    console.error("Post like status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
