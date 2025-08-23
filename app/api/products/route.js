import { NextResponse } from "next/server"

// Mock products database
const products = [
  {
    id: 1,
    name: "Summer Floral Dress",
    category: "clothing",
    subcategory: "dresses",
    price: 89.99,
    originalPrice: 129.99,
    brand: "Fashion Forward",
    image: "/summer-floral-dress.png",
    description: "Beautiful floral print dress perfect for summer occasions",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Blue", "Pink", "White"],
    rating: 4.5,
    reviews: 128,
    inStock: true,
  },
  {
    id: 2,
    name: "Classic Denim Jacket",
    category: "clothing",
    subcategory: "jackets",
    price: 79.99,
    originalPrice: 99.99,
    brand: "Urban Style",
    image: "/classic-denim-jacket.png",
    description: "Timeless denim jacket that goes with everything",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Light Blue", "Dark Blue", "Black"],
    rating: 4.7,
    reviews: 89,
    inStock: true,
  },
  {
    id: 3,
    name: "Leather Ankle Boots",
    category: "shoes",
    subcategory: "boots",
    price: 149.99,
    originalPrice: 199.99,
    brand: "Step Forward",
    image: "/leather-ankle-boots.png",
    description: "Premium leather ankle boots for any season",
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: ["Black", "Brown", "Tan"],
    rating: 4.8,
    reviews: 156,
    inStock: true,
  },
  {
    id: 4,
    name: "Gold Chain Necklace",
    category: "accessories",
    subcategory: "jewelry",
    price: 59.99,
    originalPrice: 79.99,
    brand: "Elegant Touch",
    image: "/gold-chain-necklace.png",
    description: "Elegant gold-plated chain necklace",
    sizes: ["One Size"],
    colors: ["Gold"],
    rating: 4.3,
    reviews: 67,
    inStock: true,
  },
]

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const subcategory = searchParams.get("subcategory")
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit")) || 20
    const page = Number.parseInt(searchParams.get("page")) || 1

    let filteredProducts = [...products]

    // Filter by category
    if (category) {
      filteredProducts = filteredProducts.filter((p) => p.category === category)
    }

    // Filter by subcategory
    if (subcategory) {
      filteredProducts = filteredProducts.filter((p) => p.subcategory === subcategory)
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.brand.toLowerCase().includes(searchLower),
      )
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    return NextResponse.json({
      products: paginatedProducts,
      total: filteredProducts.length,
      page,
      limit,
      totalPages: Math.ceil(filteredProducts.length / limit),
    })
  } catch (error) {
    console.error("Products fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
