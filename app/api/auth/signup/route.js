import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { hashPassword } from "@/lib/auth"
import User from "@/models/User"

export async function POST(request) {
  try {
    const userData = await request.json()
    const { email, password, name } = userData

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 })
    }

    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 409 })
    }

    const hashedPassword = await hashPassword(password)

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      isEmailVerified: false,
      isActive: true,
      lastLogin: null,
      wishlist: [],
      priceAlerts: [],
      searchHistory: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await newUser.save()

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
