import { NextResponse } from "next/server"
import { uploadImage } from "@/lib/cloudinary"
import clientPromise from "@/lib/mongodb"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"

// Mock AI analysis results
const mockAnalysisResults = [
  {
    productName: "Floral Summer Dress",
    category: "clothing",
    subcategory: "dresses",
    confidence: 0.92,
    estimatedPrice: 85.99,
    similarProducts: [
      {
        id: 1,
        name: "Summer Floral Dress",
        price: 89.99,
        image: "/summer-floral-dress.png",
        similarity: 0.95,
      },
    ],
  },
  {
    productName: "Denim Jacket",
    category: "clothing",
    subcategory: "jackets",
    confidence: 0.88,
    estimatedPrice: 75.99,
    similarProducts: [
      {
        id: 2,
        name: "Classic Denim Jacket",
        price: 79.99,
        image: "/classic-denim-jacket.png",
        similarity: 0.91,
      },
    ],
  },
]

export async function POST(request) {
  try {
    const token = getTokenFromRequest(request)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("image")

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`

    const uploadResult = await uploadImage(base64, "user-uploads")

    const client = await clientPromise
    const db = client.db("fashion_search")
    const uploads = db.collection("uploads")

    const uploadRecord = {
      userId: decoded.userId,
      originalName: file.name,
      cloudinaryUrl: uploadResult.url,
      cloudinaryPublicId: uploadResult.publicId,
      fileSize: file.size,
      uploadedAt: new Date(),
    }

    const result = await uploads.insertOne(uploadRecord)

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock AI analysis - in production, use actual AI service
    const randomResult = mockAnalysisResults[Math.floor(Math.random() * mockAnalysisResults.length)]

    // Generate price comparison for the analyzed product
    const mockRetailers = [
      { name: "Amazon", logo: "/amazon-logo.png" },
      { name: "Nordstrom", logo: "/nordstrom-logo.png" },
      { name: "Target", logo: "/generic-red-bullseye.png" },
      { name: "Macy's", logo: "/macys-logo.png" },
    ]

    const priceComparisons = mockRetailers.map((retailer) => ({
      retailer: retailer.name,
      logo: retailer.logo,
      price: Number.parseFloat((randomResult.estimatedPrice * (0.9 + Math.random() * 0.2)).toFixed(2)),
      inStock: Math.random() > 0.2,
      rating: Number.parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
      reviews: Math.floor(Math.random() * 300) + 20,
    }))

    return NextResponse.json({
      success: true,
      uploadedImage: {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
      },
      analysis: {
        ...randomResult,
        uploadId: result.insertedId,
        uploadedAt: new Date().toISOString(),
        fileSize: file.size,
        fileName: file.name,
      },
      priceComparisons: priceComparisons.sort((a, b) => a.price - b.price),
    })
  } catch (error) {
    console.error("Upload analysis error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
