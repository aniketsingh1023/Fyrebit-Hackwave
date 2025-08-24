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
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    if (files.length > 10) {
      return NextResponse.json({ error: "Maximum 10 files allowed" }, { status: 400 });
    }

    const uploadedFiles = [];
    const uploadDir = join(process.cwd(), "public", "uploads", "posts");
    await mkdir(uploadDir, { recursive: true });

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ error: `Invalid file type for ${file.name}` }, { status: 400 });
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: `File ${file.name} too large` }, { status: 400 });
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
      });
    }

    return NextResponse.json({
      success: true,
      message: `${uploadedFiles.length} images uploaded successfully`,
      files: uploadedFiles,
    });
  } catch (error) {
    console.error("Multiple image upload error:", error);
    return NextResponse.json({ error: "Failed to upload images" }, { status: 500 });
  }
}
