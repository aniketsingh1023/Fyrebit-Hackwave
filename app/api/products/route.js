import { NextResponse } from "next/server";

// GET - Fetch products from multiple sources
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "all";

    let products = [];

    // Fake Store API
    const fakeStoreCategories = {
      shirts: "men's clothing",
      pants: "women's clothing",
      shoes: "jewelery",
      all: "",
    };

    if (category === "all" || fakeStoreCategories[category]) {
      const fakeStoreUrl =
        category === "all"
          ? "https://fakestoreapi.com/products?limit=20"
          : `https://fakestoreapi.com/products/category/${fakeStoreCategories[category]}`;

      try {
        const response = await fetch(fakeStoreUrl);
        const data = await response.json();
        products = [
          ...products,
          ...data.map((item) => ({
            ...item,
            source: "fakestore",
            category:
              category === "all" ? getCategoryFromTitle(item.title) : category,
          })),
        ];
      } catch (error) {
        console.error("FakeStore API error:", error);
      }
    }

    // Platzi Fake Store API
    try {
      const platziResponse = await fetch(
        "https://api.escuelajs.co/api/v1/products?limit=20"
      );
      const platziData = await platziResponse.json();
      products = [
        ...products,
        ...platziData.map((item) => ({
          id: `platzi_${item.id}`,
          title: item.title,
          price: item.price,
          image: item.images?.[0] || item.image,
          category: mapPlatziCategory(item.category?.name),
          source: "platzi",
        })),
      ];
    } catch (error) {
      console.error("Platzi API error:", error);
    }

    // JSONPlaceholder Photos (as fashion items)
    try {
      const photosResponse = await fetch(
        "https://jsonplaceholder.typicode.com/photos?_limit=10"
      );
      const photosData = await photosResponse.json();
      products = [
        ...products,
        ...photosData.map((item) => ({
          id: `photo_${item.id}`,
          title: `Fashion Item ${item.id}`,
          price: Math.floor(Math.random() * 100) + 20,
          image: item.url,
          category: getRandomCategory(),
          source: "placeholder",
        })),
      ];
    } catch (error) {
      console.error("Photos API error:", error);
    }

    // Filter by category if specified
    if (category !== "all") {
      products = products.filter((p) => p.category === category);
    }

    return NextResponse.json({
      success: true,
      products: products.slice(0, 50), // Limit results
      total: products.length,
    });
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

function getCategoryFromTitle(title) {
  const lower = title.toLowerCase();
  if (lower.includes("shirt") || lower.includes("t-shirt")) return "shirts";
  if (lower.includes("pant") || lower.includes("jean")) return "pants";
  if (lower.includes("shoe") || lower.includes("boot")) return "shoes";
  return "accessories";
}

function mapPlatziCategory(categoryName) {
  if (!categoryName) return "accessories";
  const lower = categoryName.toLowerCase();
  if (lower.includes("clothes") || lower.includes("shirt")) return "shirts";
  if (lower.includes("shoe")) return "shoes";
  return "accessories";
}

function getRandomCategory() {
  const categories = ["shirts", "pants", "shoes", "accessories"];
  return categories[Math.floor(Math.random() * categories.length)];
}
