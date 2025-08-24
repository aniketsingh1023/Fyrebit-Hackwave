// lib/gemini.js
import { google } from "googleapis"

const client = new google.generativeai({
  apiKey: process.env.GEMINI_API_KEY
})

export async function generateGeminiEmbedding(imageUrl) {
  // Assuming Gemini supports image embeddings via a "text-image embedding" API
  // For text embedding you would do:
  const response = await client.embeddings.create({
    model: "gemini-text-embedding-001",
    input: imageUrl
  })
  return response.data[0].embedding
}
