import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeMyntra(query) {
  const searchUrl = `https://www.myntra.com/${encodeURIComponent(query)}`;
  const { data } = await axios.get(searchUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    },
  });

  const $ = cheerio.load(data);
  const products = [];

  $("li.product-base").each((i, el) => {
    const name = $(el).find(".product-product").text().trim();
    const price =
      $(el).find(".product-discountedPrice").text().trim() ||
      $(el).find(".product-strike").text().trim();
    const image =
      $(el).find("img").attr("src") || $(el).find("img").attr("data-src");
    const link = "https://www.myntra.com" + $(el).find("a").attr("href");

    if (name && image) products.push({ name, price, image, link });
  });

  return products.slice(0, 20);
}
