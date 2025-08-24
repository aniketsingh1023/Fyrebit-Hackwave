import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectDB } from "@/lib/mongodb.js"
import User from "@/models/User.js"

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ wishlist: user.wishlist || [] })
  } catch (error) {
    console.error("Wishlist fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { product } = await request.json()
    if (!product || !product.id) {
      return NextResponse.json({ error: "Product data required" }, { status: 400 })
    }

    await connectDB()
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if product already in wishlist
    const existingIndex = user.wishlist.findIndex((item) => item.id === product.id)

    if (existingIndex > -1) {
      // Remove from wishlist
      user.wishlist.splice(existingIndex, 1)
      await user.save()
      return NextResponse.json({ message: "Removed from wishlist", inWishlist: false })
    } else {
      // Add to wishlist
      user.wishlist.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        source: product.source,
        link: product.link,
        addedAt: new Date(),
      })
      await user.save()
      return NextResponse.json({ message: "Added to wishlist", inWishlist: true })
    }
  } catch (error) {
    console.error("Wishlist update error:", error)
    return NextResponse.json({ error: "Failed to update wishlist" }, { status: 500 })
  }
}
