// app/api/user/profile-completion/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

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

    const profileData = calculateDetailedProfileCompleteness(user);

    return NextResponse.json({
      success: true,
      profileCompleteness: profileData.completeness,
      canCreatePosts: profileData.completeness >= 50,
      missingFields: profileData.missingFields,
      completedFields: profileData.completedFields,
    });
  } catch (error) {
    console.error("Profile completion check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function calculateDetailedProfileCompleteness(user) {
  const fieldWeights = {
    name: { weight: 15, label: "Full Name" },
    firstName: { weight: 10, label: "First Name" },
    lastName: { weight: 10, label: "Last Name" },
    phone: { weight: 10, label: "Phone Number" },
    dateOfBirth: { weight: 10, label: "Date of Birth" },
    gender: { weight: 10, label: "Gender" },
    "address.city": { weight: 10, label: "City" },
    profileImage: { weight: 15, label: "Profile Picture" },
    "preferences.categories": { weight: 10, label: "Favorite Categories" },
  };

  let completeness = 0;
  const missingFields = [];
  const completedFields = [];

  Object.entries(fieldWeights).forEach(([field, config]) => {
    let hasValue = false;

    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      if (user[parent] && user[parent][child]) {
        if (Array.isArray(user[parent][child])) {
          hasValue = user[parent][child].length > 0;
        } else {
          hasValue = true;
        }
      }
    } else {
      hasValue = Boolean(user[field]);
    }

    if (hasValue) {
      completeness += config.weight;
      completedFields.push({
        field,
        label: config.label,
        weight: config.weight,
      });
    } else {
      missingFields.push({
        field,
        label: config.label,
        weight: config.weight,
      });
    }
  });

  return {
    completeness: Math.round(completeness),
    missingFields,
    completedFields,
  };
}
