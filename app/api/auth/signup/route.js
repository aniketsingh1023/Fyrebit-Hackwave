import { NextResponse } from "next/server"

// Mock user database - in production, use a real database
const users = [
  { id: 1, email: "user@example.com", password: "password123", name: "John Doe" },
  { id: 2, email: "jane@example.com", password: "password456", name: "Jane Smith" },
]

export async function POST(request) {
  try {
    const { email, password, name } = await request.json()

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 409 })
    }

    // Create new user
    const newUser = {
      id: users.length + 1,
      email,
      password, // In production, hash the password
      name,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)

    // Create session token
    const token = `token_${newUser.id}_${Date.now()}`

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser

    const response = NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token,
    })

    // Set HTTP-only cookie for authentication
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
