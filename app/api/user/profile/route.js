// app/api/user/profile/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// GET - Get user profile
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate profile completeness
    const profileCompleteness = calculateProfileCompleteness(user);

    return NextResponse.json({
      success: true,
      user: {
        ...user.toObject(),
        profileCompleteness,
        canCreatePosts: profileCompleteness >= 50,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    await connectDB();

    // Remove sensitive fields that shouldn't be updated via this endpoint
    const { password, email, _id, createdAt, updatedAt, ...updateData } = data;

    const user = await User.findByIdAndUpdate(
      session.user.id,
      {
        ...updateData,
        updatedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const profileCompleteness = calculateProfileCompleteness(user);

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        ...user.toObject(),
        profileCompleteness,
        canCreatePosts: profileCompleteness >= 50,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete user account
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Instead of hard delete, we'll soft delete by setting isActive to false
    const user = await User.findByIdAndUpdate(
      session.user.id,
      {
        isActive: false,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Account deactivated successfully",
    });
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to calculate profile completeness
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
