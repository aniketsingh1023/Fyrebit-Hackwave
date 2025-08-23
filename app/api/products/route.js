import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const subcategory = searchParams.get("subcategory")
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit")) || 20
    const page = Number.parseInt(searchParams.get("page")) || 1

    const client = await clientPromise
    const db = client.db("fashion_search")
    const products = db.collection("products")

    // Build query filter
    const filter = {}

    // Filter by category
    if (category) {
      filter.category = category
    }

    // Filter by subcategory
    if (subcategory) {
      filter.subcategory = subcategory
    }

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ]
    }

    const total = await products.countDocuments(filter)
    const skip = (page - 1) * limit

    const productResults = await products.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({
      products: productResults,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Products fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const productData = await request.json()

    const client = await clientPromise
    const db = client.db("fashion_search")
    const products = db.collection("products")

    const newProduct = {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await products.insertOne(newProduct)
    newProduct._id = result.insertedId

    return NextResponse.json({
      success: true,
      product: newProduct,
    })
  } catch (error) {
    console.error("Product creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
