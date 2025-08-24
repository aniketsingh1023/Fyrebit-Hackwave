// app/api/upload/image/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const type = formData.get("type") || "general"; // 'profile', 'post', 'general'

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Only JPEG, PNG, and WebP are allowed",
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "File too large. Maximum size is 5MB",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const fileExtension = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;

    // Create upload directory structure
    const uploadDir = join(process.cwd(), "public", "uploads", type);
    await mkdir(uploadDir, { recursive: true });

    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // Return the public URL
    const publicUrl = `/uploads/${type}/${fileName}`;

    // Optional: If using a cloud service like Cloudinary, upload there instead
    // const cloudinaryResult = await uploadToCloudinary(buffer, fileName)
    // const publicUrl = cloudinaryResult.secure_url

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully",
      url: publicUrl,
      fileName,
      type,
      size: file.size,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

// Example Cloudinary upload function (uncomment if using Cloudinary)
/*
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function uploadToCloudinary(buffer, fileName) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        public_id: fileName,
        folder: "profile-images"
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
    ).end(buffer)
  })
}
*/

// app/api/upload/multiple/route.js - For post images (multiple files)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    if (files.length > 10) {
      return NextResponse.json(
        { error: "Maximum 10 files allowed" },
        { status: 400 }
      );
    }

    const uploadedFiles = [];
    const uploadDir = join(process.cwd(), "public", "uploads", "posts");
    await mkdir(uploadDir, { recursive: true });

    for (const file of files) {
      // Validate each file
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            error: `Invalid file type for ${file.name}. Only JPEG, PNG, and WebP are allowed`,
          },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            error: `File ${file.name} is too large. Maximum size is 5MB`,
          },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileExtension = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      const filePath = join(uploadDir, fileName);

      await writeFile(filePath, buffer);

      uploadedFiles.push({
        url: `/uploads/posts/${fileName}`,
        fileName,
        originalName: file.name,
        size: file.size,
        type: "image",
      });
    }

    return NextResponse.json({
      success: true,
      message: `${uploadedFiles.length} images uploaded successfully`,
      files: uploadedFiles,
    });
  } catch (error) {
    console.error("Multiple image upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload images" },
      { status: 500 }
    );
  }
}
