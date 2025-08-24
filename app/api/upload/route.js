// app/api/upload/route.js
import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import Upload from "@/lib/models/upload";
import connectDB from "@/lib/mongodb";
import { scrapeMyntra } from "@/lib/myntraScraper";
import axios from "axios";

/**
 * Analyze image using Gemini (cheapest image-capable model)
 */
async function analyzeImageWithGemini(imageUrl) {
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1-small:generateContent";

  const response = await axios.post(
    url,
    {
      prompt:
        "Identify the main fashion item in this image and suggest a short search query. Respond only in JSON: { \"suggestedSearch\": \"...\" }",
      image: {
        imageUri: imageUrl,
      },
      maxOutputTokens: 100,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const raw = response.data?.candidates?.[0]?.content;
  if (!raw) throw new Error("No Gemini response");

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("Failed to parse Gemini response");
  }
}

export async function POST(request) {
  try {
    // Authenticate user
    const token = getTokenFromRequest(request);
    const decoded = verifyToken(token);
    if (!decoded)
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });

    // Get uploaded file
    const formData = await request.formData();
    const file = formData.get("image");
    if (!file) return NextResponse.json({ error: "No image file" }, { status: 400 });
    if (!file.type.startsWith("image/"))
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });

    // Convert to base64 for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const uploadResult = await uploadImage(base64, "user-uploads");

    // Analyze image with Gemini using the Cloudinary URL
    const analysis = await analyzeImageWithGemini(uploadResult.url);
    const suggestedSearch = analysis.suggestedSearch || "fashion item";

    // Scrape Myntra using suggestedSearch
    const products = await scrapeMyntra(suggestedSearch);

    // Save upload record in MongoDB via Mongoose
    await connectDB();
    const newUpload = await Upload.create({
      userId: decoded.userId,
      originalName: file.name,
      cloudinaryUrl: uploadResult.url,
      cloudinaryPublicId: uploadResult.publicId,
      fileSize: file.size,
      uploadedAt: new Date(),
      analysis: { suggestedSearch },
    });

    return NextResponse.json({
      success: true,
      uploadedImage: {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
      },
      analysis: {
        suggestedSearch,
        uploadId: newUpload._id,
        uploadedAt: newUpload.uploadedAt.toISOString(),
        fileSize: file.size,
        fileName: file.name,
      },
      products,
    });
  } catch (error) {
    console.error("Upload analysis error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
