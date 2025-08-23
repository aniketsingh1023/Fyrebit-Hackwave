"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, ExternalLink, RefreshCw, TrendingDown, TrendingUp, AlertCircle } from "lucide-react"

const mockScrapeRetailers = async (productName, category) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const retailers = [
    { name: "Amazon", domain: "amazon.com", logo: "/amazon-logo.png" },
    { name: "Zara", domain: "zara.com", logo: "/generic-fashion-logo.png" },
    { name: "H&M", domain: "hm.com", logo: "/generic-interlocking-shapes-logo.png" },
    { name: "ASOS", domain: "asos.com", logo: "/generic-clothing-retailer-logo.png" },
    { name: "Nordstrom", domain: "nordstrom.com", logo: "/nordstrom-logo.png" },
    { name: "Target", domain: "target.com", logo: "/generic-red-bullseye.png" },
    { name: "Macy's", domain: "macys.com", logo: "/macys-logo.png" },
  ]

  // Use deterministic base price to avoid hydration issues
  const basePrice = 75.99

  return retailers
    .map((retailer, index) => {
      // Use index-based deterministic variations instead of Math.random()
      const priceVariation = ((index % 3) - 1) * 0.15 // -15%, 0%, +15% variation
      const price = basePrice * (1 + priceVariation)
      const originalPrice = price * 1.2 // 20% higher original price
      const inStock = index !== 2 // Make one retailer out of stock deterministically
      const rating = 3.5 + (index % 4) * 0.4 // Ratings from 3.5 to 4.7
      const reviews = 50 + index * 100 // Reviews from 50 to 650

      return {
        retailer: retailer.name,
        domain: retailer.domain,
        logo: retailer.logo,
        price: Number.parseFloat(price.toFixed(2)),
        originalPrice: Number.parseFloat(originalPrice.toFixed(2)),
        discount: Math.floor(((originalPrice - price) / originalPrice) * 100),
        inStock,
        rating: Number.parseFloat(rating.toFixed(1)),
        reviews,
        url: `https://${retailer.domain}/search?q=${encodeURIComponent(productName)}`,
        lastUpdated: new Date().toISOString(),
        shipping: index % 2 === 0 ? "Free" : `$${(5 + index).toFixed(2)}`,
      }
    })
    .sort((a, b) => a.price - b.price)
}

export default function PriceComparison({ productName, category, className = "" }) {
  const [searchQuery, setSearchQuery] = useState(productName || "")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [lastSearched, setLastSearched] = useState("")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleSearch = async (query = searchQuery) => {
    if (!query.trim()) return

    setLoading(true)
    setLastSearched(query)

    try {
      const scrapedResults = await mockScrapeRetailers(query, category)
      setResults(scrapedResults)
    } catch (error) {
      console.error("Error scraping prices:", error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    if (lastSearched) {
      handleSearch(lastSearched)
    }
  }

  const getBestPrice = () => {
    const inStockItems = results.filter((item) => item.inStock)
    return inStockItems.length > 0 ? Math.min(...inStockItems.map((item) => item.price)) : null
  }

  const getAveragePrice = () => {
    const inStockItems = results.filter((item) => item.inStock)
    if (inStockItems.length === 0) return null
    const sum = inStockItems.reduce((acc, item) => acc + item.price, 0)
    return (sum / inStockItems.length).toFixed(2)
  }

  useEffect(() => {
    if (productName && isClient) {
      handleSearch(productName)
    }
  }, [productName, isClient])

  if (!isClient) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-primary" />
              <span>Price Comparison Tool</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input type="text" placeholder="Enter product name to compare prices..." className="flex-1" disabled />
              <Button disabled>
                <Search className="w-4 h-4" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-primary" />
            <span>Price Comparison Tool</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter product name to compare prices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={() => handleSearch()} disabled={loading}>
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Search
            </Button>
            {results.length > 0 && (
              <Button variant="outline" onClick={handleRefresh} disabled={loading}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Price Summary */}
      {results.length > 0 && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <TrendingDown className="w-5 h-5 text-green-500" />
                <span className="font-medium text-foreground">Best Price</span>
              </div>
              <div className="text-2xl font-bold text-green-600">${getBestPrice()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-foreground">Average Price</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">${getAveragePrice()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <span className="font-medium text-foreground">Retailers Found</span>
              </div>
              <div className="text-2xl font-bold text-amber-600">{results.filter((r) => r.inStock).length}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-2">Scanning Retailers...</h3>
            <p className="text-muted-foreground">Comparing prices across multiple websites</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results.length > 0 && !loading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-bold text-foreground">
              Price Comparison Results for "{lastSearched}"
            </h3>
            <span className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</span>
          </div>

          <div className="grid gap-4">
            {results.map((result, index) => (
              <Card key={index} className={`${!result.inStock ? "opacity-60" : ""} hover:shadow-md transition-shadow`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={result.logo || "/placeholder.svg"}
                        alt={`${result.retailer} logo`}
                        className="w-10 h-10 rounded-lg object-contain bg-muted p-1"
                      />
                      <div>
                        <h4 className="font-medium text-foreground">{result.retailer}</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>★ {result.rating}</span>
                          <span>({result.reviews} reviews)</span>
                          {!result.inStock && <Badge variant="destructive">Out of Stock</Badge>}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-2xl font-bold text-foreground">${result.price}</span>
                        {result.discount > 0 && (
                          <Badge className="bg-green-100 text-green-800">-{result.discount}%</Badge>
                        )}
                      </div>
                      {result.originalPrice > result.price && (
                        <span className="text-sm text-muted-foreground line-through">${result.originalPrice}</span>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">Shipping: {result.shipping}</div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      {result.inStock ? (
                        <Button size="sm" asChild>
                          <a href={result.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Visit Store
                          </a>
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          Out of Stock
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {results.length === 0 && !loading && lastSearched && (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-2">No Results Found</h3>
            <p className="text-muted-foreground">
              We couldn't find any results for "{lastSearched}". Try a different search term.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
