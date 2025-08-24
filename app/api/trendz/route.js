import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Trends from "@/models/Trends"
import { scrapeAllFashionSites } from "@/lib/myntra-scraper"

export async function GET(req) {
  try {
    await connectDB()

    // Get the search query from URL
    const { searchParams } = new URL(req.url)
    const searchQuery = searchParams.get("query") || "light blue wide leg jeans"
    
    console.log(`🔍 Searching for: ${searchQuery}`)

    // Find existing trend data
    let existingTrend = await Trends.findOne({ searchQuery }).sort({ createdAt: -1 })

    // Check if data needs refresh (older than 1 day)
    const oneDay = 24 * 60 * 60 * 1000
    const needsRefresh = !existingTrend || 
      (Date.now() - new Date(existingTrend.updatedAt).getTime()) > oneDay ||
      !existingTrend.products ||
      existingTrend.products.length === 0

    if (needsRefresh) {
      console.log(`⚡ Scraping fresh data for: ${searchQuery}`)
      
      try {
        const allProducts = await scrapeAllFashionSites(searchQuery, 20)
        
        if (allProducts && allProducts.length > 0) {
          // Clean and validate products
          const cleanProducts = allProducts.map(product => ({
            name: product.name || 'Unknown Product',
            originalPrice: product.originalPrice || null,
            discountedPrice: product.discountedPrice || null,
            price: product.price || product.discountedPrice || product.originalPrice || 'Price not available',
            image: product.image || '',
            link: product.link || '#',
            source: product.source || 'Unknown'
          })).filter(product => product.name !== 'Unknown Product')

          console.log(`✅ Found ${cleanProducts.length} products`)

          // Upsert the trend data
          existingTrend = await Trends.findOneAndUpdate(
            { searchQuery },
            { 
              searchQuery, 
              products: cleanProducts,
              updatedAt: new Date()
            },
            { upsert: true, new: true }
          )
        } else {
          console.log(`❌ No products found for: ${searchQuery}`)
        }
      } catch (scrapeError) {
        console.error("Scraping error:", scrapeError)
        // If scraping fails, still return existing data if available
        if (!existingTrend) {
          return NextResponse.json({ 
            error: "Failed to fetch new data", 
            message: "No cached data available",
            products: [] 
          }, { status: 404 })
        }
      }
    }

    // Return existing or newly scraped data
    if (!existingTrend || !existingTrend.products) {
      return NextResponse.json({ 
        products: [], 
        message: "No products found for this search",
        searchQuery 
      }, { status: 200 })
    }

    // Filter out products with missing essential data
    const validProducts = existingTrend.products.filter(product => 
      product.name && 
      product.name.trim() !== '' &&
      product.name !== 'Unknown Product'
    )

    const response = {
      _id: existingTrend._id,
      searchQuery: existingTrend.searchQuery,
      createdAt: existingTrend.createdAt,
      updatedAt: existingTrend.updatedAt,
      products: validProducts,
      totalProducts: validProducts.length,
      lastScraped: existingTrend.updatedAt
    }

    console.log(`📦 Returning ${validProducts.length} products`)
    
    return NextResponse.json(response)

  } catch (error) {
    console.error("❌ Trendz API error:", error)
    
    return NextResponse.json(
      { 
        error: "Failed to fetch trends", 
        message: error.message,
        products: [],
        searchQuery: searchParams.get("query") || "light blue wide leg jeans"
      },
      { status: 500 }
    )
  }
}

// Optional: Add POST endpoint for manual refresh
export async function POST(req) {
  try {
    await connectDB()
    
    const body = await req.json()
    const searchQuery = body.query || "light blue wide leg jeans"
    
    console.log(`🔄 Force refresh for: ${searchQuery}`)
    
    // Force fresh scrape
    const allProducts = await scrapeAllFashionSites(searchQuery, 20)
    
    if (allProducts && allProducts.length > 0) {
      const cleanProducts = allProducts.map(product => ({
        name: product.name || 'Unknown Product',
        originalPrice: product.originalPrice || null,
        discountedPrice: product.discountedPrice || null,
        price: product.price || product.discountedPrice || product.originalPrice || 'Price not available',
        image: product.image || '',
        link: product.link || '#',
        source: product.source || 'Unknown'
      })).filter(product => product.name !== 'Unknown Product')

      const updatedTrend = await Trends.findOneAndUpdate(
        { searchQuery },
        { 
          searchQuery, 
          products: cleanProducts,
          updatedAt: new Date()
        },
        { upsert: true, new: true }
      )

      return NextResponse.json({
        message: "Successfully refreshed data",
        searchQuery,
        products: cleanProducts,
        totalProducts: cleanProducts.length
      })
    }

    return NextResponse.json({
      message: "No products found",
      searchQuery,
      products: []
    }, { status: 404 })

  } catch (error) {
    console.error("❌ Force refresh error:", error)
    
    return NextResponse.json(
      { 
        error: "Failed to refresh data", 
        message: error.message 
      },
      { status: 500 }
    )
  }
}