import puppeteer from "puppeteer"

export async function scrapeMyntraProducts(searchQuery, maxProducts = 20) {
  let browser = null

  try {
    console.log(`Starting Myntra scrape for: "${searchQuery}"`)

    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
    })

    const page = await browser.newPage()

    // Set user agent to avoid bot detection
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    )

    // Set viewport
    await page.setViewport({ width: 1366, height: 768 })

    // Navigate to Myntra search
    const searchUrl = `https://www.myntra.com/${encodeURIComponent(searchQuery)}`
    console.log(`Navigating to: ${searchUrl}`)

    await page.goto(searchUrl, {
      waitUntil: "networkidle2",
      timeout: 30000,
    })

    // Wait for products to load
    try {
      await page.waitForSelector(".product-base", { timeout: 10000 })
    } catch (error) {
      console.log("Product selector not found, trying alternative selectors...")

      // Try alternative selectors
      const alternativeSelectors = [".results-base", ".search-searchProductsContainer", ".product-productMetaInfo"]

      let selectorFound = false
      for (const selector of alternativeSelectors) {
        try {
          await page.waitForSelector(selector, { timeout: 5000 })
          selectorFound = true
          break
        } catch (e) {
          continue
        }
      }

      if (!selectorFound) {
        throw new Error("No product containers found on page")
      }
    }

    // Extract product data
    const products = await page.evaluate((maxProducts) => {
      const productElements = document.querySelectorAll(".product-base, .product-productMetaInfo")
      const results = []

      for (let i = 0; i < Math.min(productElements.length, maxProducts); i++) {
        const element = productElements[i]

        try {
          // Extract product name
          const nameElement = element.querySelector(
            ".product-product, .product-brand, h3, h4, .product-productMetaInfo h3",
          )
          const name = nameElement ? nameElement.textContent.trim() : "Unknown Product"

          const discountedPriceElement = element.querySelector(".product-discountedPrice, .price-price")
          const originalPriceElement = element.querySelector(".product-strike, .price-strike")

          let originalPrice = null
          let discountedPrice = null

          if (discountedPriceElement) {
            discountedPrice = discountedPriceElement.textContent.trim()
            discountedPrice = discountedPrice.replace(/[^\d]/g, "")
            if (discountedPrice) {
              discountedPrice = "₹" + discountedPrice
            }
          }

          if (originalPriceElement) {
            originalPrice = originalPriceElement.textContent.trim()
            originalPrice = originalPrice.replace(/[^\d]/g, "")
            if (originalPrice) {
              originalPrice = "₹" + originalPrice
            }
          }

          // Extract image
          const imgElement = element.querySelector("img, .product-imageSliderContainer img")
          let image = "/diverse-fashion-display.png"
          if (imgElement) {
            image = imgElement.src || imgElement.getAttribute("data-src") || image
            // Ensure image URL is absolute
            if (image.startsWith("//")) {
              image = "https:" + image
            } else if (image.startsWith("/")) {
              image = "https://www.myntra.com" + image
            }
          }

          // Extract product link
          const linkElement = element.querySelector("a") || element.closest("a")
          let link = "#"
          if (linkElement) {
            link = linkElement.href
            if (link.startsWith("/")) {
              link = "https://www.myntra.com" + link
            }
          }

          // Only add if we have at least a name
          if (name && name !== "Unknown Product") {
            results.push({
              name: name,
              originalPrice: originalPrice,
              discountedPrice: discountedPrice || originalPrice,
              price: discountedPrice || originalPrice || "Price not available", // Keep for backward compatibility
              image: image,
              link: link,
              source: "Myntra",
            })
          }
        } catch (error) {
          console.log("Error extracting product data:", error)
          continue
        }
      }

      return results
    }, maxProducts)

    console.log(`Successfully scraped ${products.length} products from Myntra`)
    return products
  } catch (error) {
    console.error("Myntra scraping error:", error)

    // Return mock data as fallback
    return getMockMyntraProducts(searchQuery, maxProducts)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

function getMockMyntraProducts(searchQuery, maxProducts = 20) {
  console.log(`Using mock data for search: "${searchQuery}"`)

  const mockProducts = [
    {
      name: "Floral Print Summer Dress",
      price: "₹1,299",
      image: "/summer-floral-dress.png",
      link: "https://www.myntra.com/dresses/mock-product-1",
      source: "Myntra",
    },
    {
      name: "Casual Cotton Dress",
      price: "₹899",
      image: "/casual-cotton-dress.png",
      link: "https://www.myntra.com/dresses/mock-product-2",
      source: "Myntra",
    },
    {
      name: "Elegant Evening Dress",
      price: "₹2,199",
      image: "/elegant-evening-dress.png",
      link: "https://www.myntra.com/dresses/mock-product-3",
      source: "Myntra",
    },
    {
      name: "Bohemian Maxi Dress",
      price: "₹1,599",
      image: "/bohemian-maxi-dress.png",
      link: "https://www.myntra.com/dresses/mock-product-4",
      source: "Myntra",
    },
    {
      name: "Classic White Shirt",
      price: "₹799",
      image: "/classic-white-shirt.png",
      link: "https://www.myntra.com/shirts/mock-product-5",
      source: "Myntra",
    },
  ]

  // Repeat and shuffle to get desired number of products
  const extendedProducts = []
  while (extendedProducts.length < maxProducts) {
    extendedProducts.push(...mockProducts)
  }

  return extendedProducts.slice(0, maxProducts).map((product, index) => ({
    ...product,
    name: `${product.name} - Style ${index + 1}`,
    price: `₹${Math.floor(Math.random() * 2000) + 500}`,
  }))
}
