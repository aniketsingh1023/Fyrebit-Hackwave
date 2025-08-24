import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";

// GET - Download post image
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { postId } = params;
    const { searchParams } = new URL(request.url);
    const mediaIndex = parseInt(searchParams.get("mediaIndex") || "0");

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if post has media
    if (!post.media || post.media.length === 0) {
      return NextResponse.json(
        { error: "No media found in this post" },
        { status: 404 }
      );
    }

    // Get the specific media item
    const mediaItem = post.media[mediaIndex];
    if (!mediaItem || mediaItem.type !== "image") {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Log download activity (optional)
    console.log(`User ${session.user.id} downloaded image from post ${postId}`);

    // Return the image URL for download
    return NextResponse.json({
      success: true,
      downloadUrl: mediaItem.url,
      filename: `post-image-${postId}-${mediaIndex}.jpg`,
      message:
        "You can see products in this home by uploading this downloaded image",
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
