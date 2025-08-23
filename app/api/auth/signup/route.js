import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function POST(req) {
  try {
    const body = await req.json()
    const { email, password, name } = body

    // connect to DB
    await dbConnect()

    // check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 })
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // create new user
    const newUser = await User.create({
      ...body,
      password: hashedPassword,
    })

    return new Response(JSON.stringify({ user: newUser }), { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 })
  }
}
