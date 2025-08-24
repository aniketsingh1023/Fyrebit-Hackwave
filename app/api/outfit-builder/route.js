import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST - Create outfit collage for download only
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { outfitItems, title, background = "#ffffff" } = await request.json();

    if (!outfitItems || outfitItems.length === 0) {
      return NextResponse.json(
        {
          error: "Please add at least one item to create an outfit",
        },
        { status: 400 }
      );
    }

    // Create collage using Cloudinary
    const collageUrl = await createOutfitCollage(
      outfitItems,
      title,
      background
    );

    return NextResponse.json({
      success: true,
      message: "Outfit collage created successfully!",
      collageUrl: collageUrl,
      downloadUrl: collageUrl,
    });
  } catch (error) {
    console.error("Outfit builder error:", error);
    return NextResponse.json(
      { error: "Failed to create outfit collage" },
      { status: 500 }
    );
  }
}

// Create collage using Cloudinary transformations
async function createOutfitCollage(items, title, background) {
  try {
    // Upload items to Cloudinary first
    const uploadedItems = [];

    for (const item of items) {
      try {
        const uploadResult = await cloudinary.uploader.upload(item.image, {
          folder: "outfit-builder-temp",
          transformation: [
            { width: 250, height: 250, crop: "fit" },
            { quality: "auto" },
          ],
        });
        uploadedItems.push({
          ...item,
          publicId: uploadResult.public_id,
        });
      } catch (uploadError) {
        console.error("Upload error:", uploadError);
      }
    }

    // Create base canvas
    const baseTransformation = `c_fill,w_800,h_600,b_${background.replace(
      "#",
      "rgb:"
    )}`;

    // Build overlay transformations
    let overlays = [];

    // Add title
    if (title) {
      overlays.push(
        `l_text:Arial_32_bold:${encodeURIComponent(
          title
        )},co_rgb:333333,g_north,y_30`
      );
    }

    // Position items in grid
    const positions = getItemPositions(uploadedItems.length);

    uploadedItems.forEach((item, index) => {
      if (index < positions.length) {
        const pos = positions[index];
        overlays.push(
          `l_${item.publicId},w_200,h_200,c_fit,x_${pos.x},y_${pos.y}`
        );
        overlays.push(
          `l_text:Arial_16:${encodeURIComponent(
            item.category.toUpperCase()
          )},co_rgb:666666,x_${pos.x},y_${pos.y + 120}`
        );
      }
    });

    // Generate final URL
    const transformationString = `${baseTransformation}/${overlays.join("/")}`;
    const collageUrl = cloudinary.url("outfit_base", {
      transformation: transformationString,
      format: "jpg",
      quality: "auto",
    });

    return collageUrl;
  } catch (error) {
    console.error("Collage creation error:", error);
    throw new Error("Failed to create collage");
  }
}

function getItemPositions(itemCount) {
  const positions = {
    1: [{ x: 0, y: 0 }],
    2: [
      { x: -150, y: 0 },
      { x: 150, y: 0 },
    ],
    3: [
      { x: 0, y: -100 },
      { x: -150, y: 100 },
      { x: 150, y: 100 },
    ],
    4: [
      { x: -150, y: -100 },
      { x: 150, y: -100 },
      { x: -150, y: 100 },
      { x: 150, y: 100 },
    ],
  };
  return positions[Math.min(itemCount, 4)] || positions[4];
}
