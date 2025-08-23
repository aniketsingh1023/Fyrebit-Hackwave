import { NextResponse } from "next/server"

// Mock user profiles database
const userProfiles = {
  1: {
    id: 1,
    email: "user@example.com",
    name: "John Doe",
    avatar: "/diverse-user-avatars.png",
    preferences: {
      categories: ["clothing", "shoes"],
      priceRange: { min: 0, max: 200 },
      brands: ["Fashion Forward", "Urban Style"],
      notifications: {
        priceAlerts: true,
        newArrivals: false,
        sales: true,
      },
    },
    stats: {
      totalSearches: 45,
      wishlistItems: 8,
      priceAlerts: 3,
      savedAmount: 127.5,
    },
  },
}

// Helper function to get user ID from token
function getUserIdFromToken(request) {
  const token = request.cookies.get("auth-token")?.value
  if (!token) return null

  const match = token.match(/token_(\d+)_/)
  return match ? Number.parseInt(match[1]) : null
}

export async function GET(request) {
  try {
    const userId = getUserIdFromToken(request)

    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const profile = userProfiles[userId]

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const userId = getUserIdFromToken(request)

    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const updates = await request.json()

    if (!userProfiles[userId]) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Update profile (merge with existing data)
    userProfiles[userId] = {
      ...userProfiles[userId],
      ...updates,
      preferences: {
        ...userProfiles[userId].preferences,
        ...updates.preferences,
      },
    }

    return NextResponse.json({
      success: true,
      profile: userProfiles[userId],
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
