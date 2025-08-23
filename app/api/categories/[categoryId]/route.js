import { NextResponse } from "next/server"

// Mock products by category
const productsByCategory = {
  clothing: [
    {
      id: 1,
      name: "Summer Floral Dress",
      subcategory: "dresses",
      price: 89.99,
      originalPrice: 129.99,
      brand: "Fashion Forward",
      image: "/summer-floral-dress.png",
      rating: 4.5,
      reviews: 128,
      inStock: true,
    },
    {
      id: 2,
      name: "Classic Denim Jacket",
      subcategory: "jackets",
      price: 79.99,
      originalPrice: 99.99,
      brand: "Urban Style",
      image: "/classic-denim-jacket.png",
      rating: 4.7,
      reviews: 89,
      inStock: true,
    },
  ],
  shoes: [
    {
      id: 3,
      name: "Leather Ankle Boots",
      subcategory: "boots",
      price: 149.99,
      originalPrice: 199.99,
      brand: "Step Forward",
      image: "/leather-ankle-boots.png",
      rating: 4.8,
      reviews: 156,
      inStock: true,
    },
  ],
  accessories: [
    {
      id: 4,
      name: "Gold Chain Necklace",
      subcategory: "jewelry",
      price: 59.99,
      originalPrice: 79.99,
      brand: "Elegant Touch",
      image: "/gold-chain-necklace.png",
      rating: 4.3,
      reviews: 67,
      inStock: true,
    },
  ],
}

export async function GET(request, { params }) {
  try {
    const { categoryId } = params
    const { searchParams } = new URL(request.url)
    const subcategory = searchParams.get("subcategory")
    const limit = Number.parseInt(searchParams.get("limit")) || 20
    const page = Number.parseInt(searchParams.get("page")) || 1

    let products = productsByCategory[categoryId] || []

    // Filter by subcategory if specified
    if (subcategory) {
      products = products.filter((p) => p.subcategory === subcategory)
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = products.slice(startIndex, endIndex)

    return NextResponse.json({
      products: paginatedProducts,
      total: products.length,
      page,
      limit,
      totalPages: Math.ceil(products.length / limit),
      category: categoryId,
    })
  } catch (error) {
    console.error("Category products fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
