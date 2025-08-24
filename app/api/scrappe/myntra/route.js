import { NextResponse } from "next/server"
import { scrapeMyntraProducts } from "@/lib/myntra-scraper"

export async function POST(request) {
  try {
    const { searchQuery, maxProducts = 20 } = await request.json()

    if (!searchQuery) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 })
    }

    console.log(`Scraping Myntra for: "${searchQuery}"`)

    const products = await scrapeMyntraProducts(searchQuery, maxProducts)

    return NextResponse.json({
      success: true,
      searchQuery,
      totalProducts: products.length,
      products: products,
      scrapedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Myntra scraping API error:", error)

    return NextResponse.json(
      {
        error: "Failed to scrape products",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const searchQuery = searchParams.get("q")
  const maxProducts = Number.parseInt(searchParams.get("limit") || "20")

  if (!searchQuery) {
    return NextResponse.json({ error: "Search query parameter 'q' is required" }, { status: 400 })
  }

  try {
    const products = await scrapeMyntraProducts(searchQuery, maxProducts)

    return NextResponse.json({
      success: true,
      searchQuery,
      totalProducts: products.length,
      products: products,
      scrapedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Myntra scraping API error:", error)

    return NextResponse.json(
      {
        error: "Failed to scrape products",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
