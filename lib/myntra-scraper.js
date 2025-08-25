import puppeteer from "puppeteer"
import fs from "fs"
import path from "path"

// Path for trends database file
const trendsFile = path.resolve("./trends.js")

// --- Save globally sorted top 5 results into trends.js ---
// --- Save globally sorted top 5 results into trends.js ---
function saveTrends(searchQuery, allProducts) {
  // ✅ Only keep products with both price & image
  const filtered = allProducts.filter(
    (p) => p.price && p.price.trim() !== "" && p.image && p.image.trim() !== ""
  )

  // Normalize price to number for sorting
  const withNumericPrice = filtered.map(p => {
    const numeric = parseInt((p.price || "").replace(/[^\d]/g, ""), 10)
    return { ...p, numericPrice: isNaN(numeric) ? Infinity : numeric }
  })

  // Sort ascending by price
  const sorted = withNumericPrice.sort((a, b) => a.numericPrice - b.numericPrice)

  // Take top 5 cheapest
  const topFive = sorted.slice(0, 5).map(({ numericPrice, ...rest }) => rest)

  let db = {}
  if (fs.existsSync(trendsFile)) {
    db = JSON.parse(fs.readFileSync(trendsFile, "utf-8"))
  }

  db[searchQuery] = topFive

  fs.writeFileSync(trendsFile, JSON.stringify(db, null, 2))
  console.log(`✅ Saved globally cheapest top 5 results for "${searchQuery}" into trends.js`)
}


// --- Common page setup ---
async function setupPage(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })
  const page = await browser.newPage()
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91 Safari/537.36"
  )
  await page.setViewport({ width: 1366, height: 768 })
  await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 })
  page.browser = () => browser
  return page
}

// --- Myntra Scraper ---
export async function scrapeMyntraProducts(searchQuery, maxProducts = 20) {
  let browser
  try {
    const url = `https://www.myntra.com/${encodeURIComponent(searchQuery)}`
    const page = await setupPage(url)
    browser = page.browser()

    await page.waitForSelector(".product-base", { timeout: 10000 })

    const products = await page.evaluate((maxProducts) => {
      const productElements = document.querySelectorAll(".product-base")
      const results = []

      for (let i = 0; i < Math.min(productElements.length, maxProducts); i++) {
        const el = productElements[i]
        const brand = el.querySelector(".product-brand")?.innerText?.trim() || ""
        const productName = el.querySelector(".product-product")?.innerText?.trim() || ""
        const name = `${brand} ${productName}`.trim()

        const discounted = el.querySelector(".product-discountedPrice")?.innerText?.replace(/[^\d]/g, "")
        const original = el.querySelector(".product-strike")?.innerText?.replace(/[^\d]/g, "")
        const price = discounted || original

        let image = el.querySelector("img")?.getAttribute("src") || el.querySelector("img")?.getAttribute("data-src") || ""
        if (image.startsWith("//")) image = "https:" + image
        if (image.startsWith("/")) image = "https://www.myntra.com" + image

        let link = el.querySelector("a")?.href || "#"
        if (link.startsWith("/")) link = "https://www.myntra.com" + link

        if (name) {
          results.push({
            name,
            originalPrice: original ? `₹${original}` : null,
            discountedPrice: discounted ? `₹${discounted}` : null,
            price: price ? `₹${price}` : "Price not available",
            image,
            link,
            source: "Myntra",
          })
        }
      }
      return results
    }, maxProducts)

    console.log(`✅ Scraped ${products.length} products from Myntra`)
    return products
  } catch (err) {
    console.error("❌ Myntra scraping error:", err)
    return []
  } finally {
    if (browser) await browser.close()
  }
}

// --- Ajio Scraper ---
export async function scrapeAjioProducts(searchQuery, maxProducts = 20) {
  let browser
  try {
    const url = `https://www.ajio.com/search/?text=${encodeURIComponent(searchQuery)}`
    const page = await setupPage(url)
    browser = page.browser()

    await page.waitForSelector(".item", { timeout: 10000 })

    const products = await page.evaluate((maxProducts) => {
      const items = document.querySelectorAll(".item")
      const results = []

      for (let i = 0; i < Math.min(items.length, maxProducts); i++) {
        const el = items[i]
        const brand = el.querySelector(".brand")?.innerText?.trim() || ""
        const productName = el.querySelector(".name")?.innerText?.trim() || ""
        const name = `${brand} ${productName}`.trim()

        const discounted = el.querySelector(".price")?.innerText?.replace(/[^\d]/g, "")
        const original = el.querySelector(".orginal-price")?.innerText?.replace(/[^\d]/g, "")
        const price = discounted || original

        let image = el.querySelector("img")?.src || ""
        if (image.startsWith("//")) image = "https:" + image

        let link = el.querySelector("a")?.href || "#"
        if (link.startsWith("/")) link = "https://www.ajio.com" + link

        if (name) {
          results.push({
            name,
            originalPrice: original ? `₹${original}` : null,
            discountedPrice: discounted ? `₹${discounted}` : null,
            price: price ? `₹${price}` : "Price not available",
            image,
            link,
            source: "Ajio",
          })
        }
      }
      return results
    }, maxProducts)

    console.log(`✅ Scraped ${products.length} products from Ajio`)
    return products
  } catch (err) {
    console.error("❌ Ajio scraping error:", err)
    return []
  } finally {
    if (browser) await browser.close()
  }
}

// --- Master function: scrape both & save trends ---
export async function scrapeAllFashionSites(searchQuery, maxProducts = 20) {
  const [myntra, ajio] = await Promise.all([
    scrapeMyntraProducts(searchQuery, maxProducts),
    scrapeAjioProducts(searchQuery, maxProducts),
  ])

  const allProducts = [...myntra, ...ajio]

  // Save cheapest 5 across all platforms
  saveTrends(searchQuery, allProducts)

  return allProducts
}