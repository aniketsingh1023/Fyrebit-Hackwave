// app/api/imageSearch/route.js
import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { scrapeMyntra } from "@/lib/myntraScraper";
import { cosineSimilarity } from "@/lib/cosine";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { imageUrl, query } = await req.json();
    if (!imageUrl || !query)
      return NextResponse.json(
        { error: "Image URL and query required" },
        { status: 400 }
      );

    // 1️⃣ Generate embedding for input image
    const imageEmbeddingResp = await openai.embeddings.create({
      model: "clip-vit-base-patch32",
      input: imageUrl,
    });
    const imageEmbedding = imageEmbeddingResp.data[0].embedding;

    // 2️⃣ Scrape Myntra products
    const products = await scrapeMyntra(query);

    // 3️⃣ Generate embeddings for product images
    const productsWithEmbeddings = await Promise.all(
      products.map(async (p) => {
        try {
          const embResp = await openai.embeddings.create({
            model: "clip-vit-base-patch32",
            input: p.image,
          });
          return { ...p, embedding: embResp.data[0].embedding };
        } catch {
          return null;
        }
      })
    );

    // Filter out failed embeddings
    const validProducts = productsWithEmbeddings.filter(Boolean);

    // 4️⃣ Compute similarity
    const ranked = validProducts
      .map((p) => ({
        ...p,
        similarity: cosineSimilarity(imageEmbedding, p.embedding),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10); // top 10

    return NextResponse.json({ result: ranked });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
