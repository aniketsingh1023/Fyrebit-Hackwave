import { NextResponse } from "next/server"
import { uploadImage } from "@/lib/cloudinary"
import { GoogleGenerativeAI } from "@google/generative-ai"
import Upload from "@/models/Upload.js"
import { connectDB } from "@/lib/mongodb"
import mongoose from "mongoose"
import { scrapeMyntraProducts } from "@/lib/myntra-scraper"

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null

async function analyzeImageWithGemini(imageUrl, mimeType = "image/jpeg") {
  if (!genAI) {
    console.warn("Gemini API key not found, using fallback analysis")
    return getFallbackAnalysis()
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `You are a fashion expert AI. Analyze this fashion image and identify the main fashion item. 

    Look for:
    - Type of clothing/accessory (dress, shirt, shoes, bag, etc.)
    - Colors (primary and secondary)
    - Style/pattern (floral, striped, solid, etc.)
    - Season/occasion (summer, formal, casual, etc.)
    
    Return ONLY a valid JSON response with this exact structure:
    {
      "suggestedSearch": "concise search term for Myntra (e.g., 'blue floral summer dress', 'black leather boots')",
      "category": "main category (clothing/shoes/accessories)",
      "subcategory": "specific type (dress/shirt/sneakers/handbag)",
      "colors": ["primary color", "secondary color"],
      "confidence": 0.85,
      "tags": ["style", "pattern", "occasion", "season"],
      "description": "brief description of the item"
    }
    
    Make the suggestedSearch term specific and searchable on fashion websites.`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageUrl.split(",")[1], // Remove data:image/jpeg;base64, prefix
          mimeType: mimeType,
        },
      },
    ])

    const response = await result.response
    const text = response.text()

    let analysisResult = null

    // Try to extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        analysisResult = JSON.parse(jsonMatch[0])
      } catch (parseError) {
        console.error("JSON parse error:", parseError)
      }
    }

    if (!analysisResult || !analysisResult.suggestedSearch) {
      console.warn("Invalid Gemini response, using fallback")
      return getFallbackAnalysis()
    }

    return {
      suggestedSearch: analysisResult.suggestedSearch || "fashion item",
      category: analysisResult.category || "clothing",
      subcategory: analysisResult.subcategory || "general",
      colors: Array.isArray(analysisResult.colors) ? analysisResult.colors : ["unknown"],
      confidence: typeof analysisResult.confidence === "number" ? analysisResult.confidence : 0.7,
      tags: Array.isArray(analysisResult.tags) ? analysisResult.tags : ["fashion"],
      description: analysisResult.description || "Fashion item detected in image",
    }
  } catch (error) {
    console.error("Gemini analysis error:", error)
    return getFallbackAnalysis()
  }
}

function getFallbackAnalysis() {
  const fallbackOptions = [
    {
      suggestedSearch: "women dress casual",
      category: "clothing",
      subcategory: "dress",
      colors: ["blue", "white"],
      tags: ["casual", "summer", "comfortable"],
    },
    {
      suggestedSearch: "men shirt formal",
      category: "clothing",
      subcategory: "shirt",
      colors: ["white", "blue"],
      tags: ["formal", "office", "cotton"],
    },
    {
      suggestedSearch: "sneakers casual shoes",
      category: "shoes",
      subcategory: "sneakers",
      colors: ["white", "black"],
      tags: ["casual", "comfortable", "sports"],
    },
  ]

  const randomOption = fallbackOptions[Math.floor(Math.random() * fallbackOptions.length)]

  return {
    ...randomOption,
    confidence: 0.5,
    description: "Fashion item detected (using fallback analysis)",
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get("image")

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 })
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Please upload JPEG, PNG, or WebP images only.",
        },
        { status: 400 },
      )
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: "File too large. Please upload images smaller than 10MB.",
        },
        { status: 400 },
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`

    const uploadResult = await uploadImage(base64, "fashion-analysis")

    const analysis = await analyzeImageWithGemini(base64, file.type)

    const products = await scrapeMyntraProducts(analysis.suggestedSearch, 20)

    await connectDB()

    const uploadRecord = new Upload({
      userId: new mongoose.Types.ObjectId(), // Temporary - will be replaced with actual user ID from session
      originalName: file.name,
      cloudinaryUrl: uploadResult.url,
      cloudinaryPublicId: uploadResult.publicId,
      fileSize: file.size,
      analysis: analysis,
      scrapedProducts: products, // Store scraped products
    })

    const savedUpload = await uploadRecord.save()

    return NextResponse.json({
      success: true,
      uploadedImage: {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        width: uploadResult.width,
        height: uploadResult.height,
      },
      analysis: {
        ...analysis,
        uploadId: savedUpload._id,
        uploadedAt: savedUpload.uploadedAt,
        fileSize: file.size,
        fileName: file.name,
      },
      products: products, // Return scraped products
      message: "Image uploaded, analyzed, and products scraped successfully",
    })
  } catch (error) {
    console.error("Upload analysis error:", error)
    return NextResponse.json(
      {
        error: "Failed to process image. Please try again.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
