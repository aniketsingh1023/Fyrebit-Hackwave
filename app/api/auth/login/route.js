import { NextResponse } from "next/server"
import { generateToken, comparePassword } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Ensure DB connection
    await connectDB()

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Account is deactivated" },
        { status: 401 }
      )
    }

    // Compare password
    const isValidPassword = await comparePassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Update last login
    user.lastLogin = new Date()
    user.updatedAt = new Date()
    await user.save()

    // Generate token
    const token = generateToken(user._id.toString())

    // Convert to JSON and strip sensitive data
    const userResponse = user.toObject()
    delete userResponse.password

    const response = NextResponse.json({
      success: true,
      user: userResponse,
      token,
    })

    // Set cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // better CSRF protection
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
