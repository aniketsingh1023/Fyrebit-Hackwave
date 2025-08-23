import { NextResponse } from "next/server"

// Mock price comparison data simulating web scraping results
const mockRetailers = [
  { name: "Amazon", logo: "/amazon-logo.png", baseUrl: "https://amazon.com" },
  { name: "Nordstrom", logo: "/nordstrom-logo.png", baseUrl: "https://nordstrom.com" },
  { name: "Target", logo: "/generic-red-bullseye.png", baseUrl: "https://target.com" },
  { name: "Macy's", logo: "/macys-logo.png", baseUrl: "https://macys.com" },
  { name: "Fashion Nova", logo: "/generic-fashion-logo.png", baseUrl: "https://fashionnova.com" },
]

function generateMockPrices(basePrice, productName) {
  return mockRetailers.map((retailer, index) => {
    const variation = ((index % 3) - 1) * 0.15 // -15%, 0%, +15% variation
    const price = basePrice * (1 + variation)
    const isOnSale = index % 2 === 0
    const originalPrice = isOnSale ? price * 1.2 : price

    return {
      retailer: retailer.name,
      logo: retailer.logo,
      price: Number.parseFloat(price.toFixed(2)),
      originalPrice: isOnSale ? Number.parseFloat(originalPrice.toFixed(2)) : null,
      isOnSale,
      inStock: index !== 2, // Make one retailer out of stock deterministically
      rating: Number.parseFloat((3.5 + (index % 4) * 0.4).toFixed(1)),
      reviews: 50 + index * 100,
      url: `${retailer.baseUrl}/product/${productName.toLowerCase().replace(/\s+/g, "-")}`,
      shippingInfo: index === 0 ? "Free shipping" : index % 2 === 0 ? "Free shipping over $50" : "$5.99 shipping",
      estimatedDelivery: (index % 7) + 1,
    }
  })
}

export async function POST(request) {
  try {
    const { productName, basePrice, productId } = await request.json()

    if (!productName || !basePrice) {
      return NextResponse.json({ error: "Product name and base price are required" }, { status: 400 })
    }

    // Simulate web scraping delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate mock comparison data
    const comparisons = generateMockPrices(basePrice, productName)

    // Sort by price (lowest first)
    comparisons.sort((a, b) => a.price - b.price)

    // Add best deal indicator
    if (comparisons.length > 0) {
      comparisons[0].isBestDeal = true
    }

    return NextResponse.json({
      success: true,
      productName,
      comparisons,
      scrapedAt: new Date().toISOString(),
      totalRetailers: comparisons.length,
      priceRange: {
        min: Math.min(...comparisons.map((c) => c.price)),
        max: Math.max(...comparisons.map((c) => c.price)),
      },
    })
  } catch (error) {
    console.error("Price comparison error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")
    const productName = searchParams.get("productName")
    const basePrice = Number.parseFloat(searchParams.get("basePrice"))

    if (!productName || !basePrice) {
      return NextResponse.json({ error: "Product name and base price are required" }, { status: 400 })
    }

    // Generate mock comparison data
    const comparisons = generateMockPrices(basePrice, productName)
    comparisons.sort((a, b) => a.price - b.price)

    if (comparisons.length > 0) {
      comparisons[0].isBestDeal = true
    }

    return NextResponse.json({
      success: true,
      productName,
      comparisons,
      scrapedAt: new Date().toISOString(),
      totalRetailers: comparisons.length,
      priceRange: {
        min: Math.min(...comparisons.map((c) => c.price)),
        max: Math.max(...comparisons.map((c) => c.price)),
      },
    })
  } catch (error) {
    console.error("Price comparison error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
