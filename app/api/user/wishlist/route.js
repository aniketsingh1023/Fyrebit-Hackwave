import { NextResponse } from "next/server"

// Mock wishlist database - in production, use a real database
const userWishlists = {
  1: [
    {
      id: 1,
      productId: 1,
      name: "Summer Floral Dress",
      price: 89.99,
      image: "/summer-floral-dress.png",
      addedAt: "2024-01-15T10:30:00Z",
    },
  ],
}

// Helper function to get user ID from token (mock implementation)
function getUserIdFromToken(request) {
  const token = request.cookies.get("auth-token")?.value
  if (!token) return null

  // Extract user ID from token (in production, verify JWT)
  const match = token.match(/token_(\d+)_/)
  return match ? Number.parseInt(match[1]) : null
}

export async function GET(request) {
  try {
    const userId = getUserIdFromToken(request)

    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const wishlist = userWishlists[userId] || []

    return NextResponse.json({ wishlist })
  } catch (error) {
    console.error("Wishlist fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const userId = getUserIdFromToken(request)

    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { productId, name, price, image } = await request.json()

    if (!productId || !name || !price) {
      return NextResponse.json({ error: "Product details are required" }, { status: 400 })
    }

    // Initialize user wishlist if it doesn't exist
    if (!userWishlists[userId]) {
      userWishlists[userId] = []
    }

    // Check if product already in wishlist
    const existingItem = userWishlists[userId].find((item) => item.productId === productId)
    if (existingItem) {
      return NextResponse.json({ error: "Product already in wishlist" }, { status: 409 })
    }

    // Add to wishlist
    const wishlistItem = {
      id: Date.now(),
      productId,
      name,
      price,
      image,
      addedAt: new Date().toISOString(),
    }

    userWishlists[userId].push(wishlistItem)

    return NextResponse.json({
      success: true,
      item: wishlistItem,
    })
  } catch (error) {
    console.error("Wishlist add error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const userId = getUserIdFromToken(request)

    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const itemId = Number.parseInt(searchParams.get("itemId"))

    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 })
    }

    if (!userWishlists[userId]) {
      return NextResponse.json({ error: "Wishlist not found" }, { status: 404 })
    }

    // Remove item from wishlist
    userWishlists[userId] = userWishlists[userId].filter((item) => item.id !== itemId)

    return NextResponse.json({
      success: true,
      message: "Item removed from wishlist",
    })
  } catch (error) {
    console.error("Wishlist remove error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
