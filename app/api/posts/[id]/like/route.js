import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";
import NotificationService from "@/lib/notificationService";

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  try {
    // First populate to check existing likes
    const post = await Post.findById(params.id)
      .populate("likes.user")
      .populate("author", "name image email");

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Find the current user
    let currentUser = null;
    const userId =
      session.user.userId ||
      session.user.id ||
      session.user._id ||
      session.user.sub;

    if (userId) {
      currentUser = await User.findById(userId);
    }

    if (!currentUser && session.user.email) {
      currentUser = await User.findOne({ email: session.user.email });
    }

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentUserId = currentUser._id.toString();
    const alreadyLiked = post.likes.some(
      (l) => l.user?._id?.toString() === currentUserId
    );

    if (alreadyLiked) {
      // Unlike the post
      post.likes = post.likes.filter(
        (l) => l.user?._id?.toString() !== currentUserId
      );
    } else {
      // Like the post
      post.likes.push({ user: currentUserId });

      // 🔥 CREATE NOTIFICATION FOR POST LIKE
      try {
        await NotificationService.notifyPostLike(
          post.author._id,
          currentUser,
          post._id,
          post.content || post.title || "their post"
        );
      } catch (notificationError) {
        console.error(
          "❌ Failed to create like notification:",
          notificationError
        );
        // Don't fail the like action if notification fails
      }
    }

    await post.save();

    // Re-populate all necessary fields after saving
    const updatedPost = await Post.findById(post._id)
      .populate("author", "name image role profile")
      .populate("comments.user", "name image")
      .populate("likes.user", "name image")
      .lean();

    return NextResponse.json(
      {
        liked: !alreadyLiked,
        post: updatedPost,
        message: !alreadyLiked ? "Post liked!" : "Post unliked!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Like/unlike error:", error);
    return NextResponse.json(
      { error: "Failed to update like status" },
      { status: 500 }
    );
  }
}
