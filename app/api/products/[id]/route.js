import { NextResponse } from "next/server"

// Mock products database (same as above)
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
    details: {
      material: "100% Cotton",
      care: "Machine wash cold",
      origin: "Made in USA",
      fit: "Regular fit",
    },
  },
  // Add more detailed product data...
]

export async function GET(request, { params }) {
  try {
    const productId = Number.parseInt(params.id)
    const product = products.find((p) => p.id === productId)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Product fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
