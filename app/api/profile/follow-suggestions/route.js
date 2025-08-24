import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectDB();

    const currentUser = await User.findById(session.user.id).select(
      "following profile.skills role"
    );

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get users that current user is not following
    const followingIds = currentUser.following || [];

    let suggestions = [];

    // Suggest users with similar skills (for freelancers)
    if (
      currentUser.role === "freelancer" &&
      currentUser.profile?.skills?.length > 0
    ) {
      const similarSkillUsers = await User.find({
        _id: { $nin: [...followingIds, currentUser._id] },
        role: { $in: ["freelancer", "hiring"] },
        "profile.skills": { $in: currentUser.profile.skills },
      })
        .select(
          "name image role profile.bio profile.companyName profile.skills stats"
        )
        .limit(5);

      suggestions.push(...similarSkillUsers);
    }

    // Suggest top-rated users
    const topUsers = await User.find({
      _id: {
        $nin: [
          ...followingIds,
          currentUser._id,
          ...suggestions.map((s) => s._id),
        ],
      },
      "stats.rating": { $gte: 4 },
    })
      .select("name image role profile.bio profile.companyName stats")
      .sort({ "stats.rating": -1, "stats.followers": -1 })
      .limit(5);

    suggestions.push(...topUsers);

    // If still need more suggestions, get recent users
    if (suggestions.length < 10) {
      const recentUsers = await User.find({
        _id: {
          $nin: [
            ...followingIds,
            currentUser._id,
            ...suggestions.map((s) => s._id),
          ],
        },
      })
        .select("name image role profile.bio profile.companyName stats")
        .sort({ createdAt: -1 })
        .limit(10 - suggestions.length);

      suggestions.push(...recentUsers);
    }

    // Add follow status and followers count
    const suggestionsWithStats = suggestions.map((user) => ({
      ...user.toObject(),
      isFollowing: false, // These are suggestions, so user is not following them
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
    }));

    return NextResponse.json({
      success: true,
      suggestions: suggestionsWithStats.slice(0, 10), // Limit to 10 suggestions
    });
  } catch (error) {
    console.error("Follow suggestions error:", error);
    return NextResponse.json(
      { error: "Failed to get follow suggestions" },
      { status: 500 }
    );
  }
}
