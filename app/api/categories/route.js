import { NextResponse } from "next/server"

const categories = [
  {
    id: "clothing",
    name: "Clothing",
    description: "Trendy fashion for every occasion",
    image: "/fashion-clothing-collection.png",
    itemCount: 1250,
    subcategories: [
      { id: "dresses", name: "Dresses", count: 320 },
      { id: "tops", name: "Tops", count: 450 },
      { id: "bottoms", name: "Bottoms", count: 280 },
      { id: "jackets", name: "Jackets", count: 200 },
    ],
  },
  {
    id: "shoes",
    name: "Shoes",
    description: "Step up your style game",
    image: "/fashion-shoes-collection.png",
    itemCount: 890,
    subcategories: [
      { id: "sneakers", name: "Sneakers", count: 340 },
      { id: "boots", name: "Boots", count: 220 },
      { id: "heels", name: "Heels", count: 180 },
      { id: "flats", name: "Flats", count: 150 },
    ],
  },
  {
    id: "accessories",
    name: "Accessories",
    description: "Complete your perfect look",
    image: "/fashion-accessories-collection.png",
    itemCount: 650,
    subcategories: [
      { id: "bags", name: "Bags", count: 280 },
      { id: "jewelry", name: "Jewelry", count: 200 },
      { id: "belts", name: "Belts", count: 90 },
      { id: "scarves", name: "Scarves", count: 80 },
    ],
  },
  {
    id: "watches",
    name: "Watches",
    description: "Luxury timepieces",
    image: "/luxury-watches.png",
    itemCount: 340,
    subcategories: [
      { id: "luxury", name: "Luxury", count: 120 },
      { id: "sport", name: "Sport", count: 100 },
      { id: "casual", name: "Casual", count: 80 },
      { id: "smart", name: "Smart Watches", count: 40 },
    ],
  },
]

export async function GET() {
  try {
    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Categories fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
