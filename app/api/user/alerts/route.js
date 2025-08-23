import { NextResponse } from "next/server"

// Mock price alerts database
const userAlerts = {
  1: [
    {
      id: 1,
      productId: 1,
      productName: "Summer Floral Dress",
      currentPrice: 89.99,
      targetPrice: 75.0,
      isActive: true,
      createdAt: "2024-01-15T10:30:00Z",
    },
  ],
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

    const alerts = userAlerts[userId] || []

    return NextResponse.json({ alerts })
  } catch (error) {
    console.error("Alerts fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const userId = getUserIdFromToken(request)

    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { productId, productName, currentPrice, targetPrice } = await request.json()

    if (!productId || !productName || !currentPrice || !targetPrice) {
      return NextResponse.json({ error: "All alert details are required" }, { status: 400 })
    }

    if (targetPrice >= currentPrice) {
      return NextResponse.json({ error: "Target price must be lower than current price" }, { status: 400 })
    }

    // Initialize user alerts if it doesn't exist
    if (!userAlerts[userId]) {
      userAlerts[userId] = []
    }

    // Create new alert
    const alert = {
      id: Date.now(),
      productId,
      productName,
      currentPrice,
      targetPrice,
      isActive: true,
      createdAt: new Date().toISOString(),
    }

    userAlerts[userId].push(alert)

    return NextResponse.json({
      success: true,
      alert,
    })
  } catch (error) {
    console.error("Alert creation error:", error)
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
    const alertId = Number.parseInt(searchParams.get("alertId"))

    if (!alertId) {
      return NextResponse.json({ error: "Alert ID is required" }, { status: 400 })
    }

    if (!userAlerts[userId]) {
      return NextResponse.json({ error: "No alerts found" }, { status: 404 })
    }

    // Remove alert
    userAlerts[userId] = userAlerts[userId].filter((alert) => alert.id !== alertId)

    return NextResponse.json({
      success: true,
      message: "Alert removed successfully",
    })
  } catch (error) {
    console.error("Alert removal error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
