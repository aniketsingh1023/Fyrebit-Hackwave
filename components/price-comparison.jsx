"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ExternalLink, RefreshCw, TrendingDown, TrendingUp, AlertCircle, Filter, Star } from "lucide-react"

export default function PriceComparison({ productName, category, products = [], className = "" }) {
  const [searchQuery, setSearchQuery] = useState(productName || "")
  const [results, setResults] = useState(products)
  const [loading, setLoading] = useState(false)
  const [lastSearched, setLastSearched] = useState("")
  const [isClient, setIsClient] = useState(false)
  const [sortBy, setSortBy] = useState("price-low")
  const [filterInStock, setFilterInStock] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (products && products.length > 0) {
      setResults(products)
      setLastSearched(productName || "Uploaded Image")
    }
  }, [products, productName])

  const handleSearch = async (query = searchQuery) => {
    if (!query.trim()) return

    setLoading(true)
    setLastSearched(query)

    try {
      const response = await fetch("/api/scrape/myntra", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          searchQuery: query,
          maxProducts: 20,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }

      const data = await response.json()
      if (data.success) {
        setResults(data.products || [])
      } else {
        throw new Error(data.error || "Search failed")
      }
    } catch (error) {
      console.error("Error searching products:", error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    if (lastSearched && lastSearched !== "Uploaded Image") {
      handleSearch(lastSearched)
    }
  }

  const getSortedAndFilteredResults = () => {
    let filtered = results

    if (filterInStock) {
      filtered = filtered.filter((item) => item.inStock !== false)
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return Number.parseFloat(a.price.replace(/[₹$,]/g, "")) - Number.parseFloat(b.price.replace(/[₹$,]/g, ""))
        case "price-high":
          return Number.parseFloat(b.price.replace(/[₹$,]/g, "")) - Number.parseFloat(a.price.replace(/[₹$,]/g, ""))
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })
  }

  const getBestPrice = () => {
    const availableItems = results.filter((item) => item.inStock !== false)
    if (availableItems.length === 0) return null
    const prices = availableItems.map((item) => Number.parseFloat(item.price.replace(/[₹$,]/g, "")))
    return Math.min(...prices).toFixed(2)
  }

  const getAveragePrice = () => {
    const availableItems = results.filter((item) => item.inStock !== false)
    if (availableItems.length === 0) return null
    const prices = availableItems.map((item) => Number.parseFloat(item.price.replace(/[₹$,]/g, "")))
    const sum = prices.reduce((acc, price) => acc + price, 0)
    return (sum / prices.length).toFixed(2)
  }

  const getPriceRange = () => {
    const availableItems = results.filter((item) => item.inStock !== false)
    if (availableItems.length === 0) return null
    const prices = availableItems.map((item) => Number.parseFloat(item.price.replace(/[₹$,]/g, "")))
    return {
      min: Math.min(...prices).toFixed(2),
      max: Math.max(...prices).toFixed(2),
    }
  }

  useEffect(() => {
    if (productName && isClient && !products.length) {
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

  const sortedResults = getSortedAndFilteredResults()
  const priceRange = getPriceRange()

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
          <div className="flex flex-col space-y-4">
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
              {results.length > 0 && lastSearched !== "Uploaded Image" && (
                <Button variant="outline" onClick={handleRefresh} disabled={loading}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              )}
            </div>

            {results.length > 0 && (
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="name">Name: A to Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant={filterInStock ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterInStock(!filterInStock)}
                >
                  In Stock Only
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Price Summary */}
      {results.length > 0 && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <TrendingDown className="w-5 h-5 text-green-500" />
                <span className="font-medium text-foreground">Best Price</span>
              </div>
              <div className="text-2xl font-bold text-green-600">₹{getBestPrice()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-foreground">Average Price</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">₹{getAveragePrice()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <span className="font-medium text-foreground">Products Found</span>
              </div>
              <div className="text-2xl font-bold text-amber-600">{sortedResults.length}</div>
            </CardContent>
          </Card>
          {priceRange && (
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  <span className="font-medium text-foreground">Price Range</span>
                </div>
                <div className="text-lg font-bold text-purple-600">
                  ₹{priceRange.min} - ₹{priceRange.max}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-2">Searching Products...</h3>
            <p className="text-muted-foreground">Finding the best deals across multiple retailers</p>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Results Grid */}
      {sortedResults.length > 0 && !loading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-bold text-foreground">
              {lastSearched === "Uploaded Image" ? "Similar Products Found" : `Results for "${lastSearched}"`}
            </h3>
            <span className="text-sm text-muted-foreground">
              {sortedResults.length} products • Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedResults.map((result, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-200 group">
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div className="aspect-square overflow-hidden rounded-t-lg bg-muted">
                    <img
                      src={result.image || "/placeholder.svg?height=300&width=300"}
                      alt={result.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h4 className="font-medium text-foreground line-clamp-2 mb-1">{result.name}</h4>
                      <p className="text-sm text-muted-foreground">Source: {result.source || "Myntra"}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-primary">{result.price}</span>
                        {result.originalPrice && result.originalPrice !== result.price && (
                          <span className="text-sm text-muted-foreground line-through ml-2">
                            {result.originalPrice}
                          </span>
                        )}
                      </div>
                      {result.inStock === false && <Badge variant="destructive">Out of Stock</Badge>}
                    </div>

                    {/* Rating and Reviews */}
                    {result.rating && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1">{result.rating}</span>
                        </div>
                        {result.reviews && <span>({result.reviews} reviews)</span>}
                      </div>
                    )}

                    <Button asChild size="sm" className="w-full" disabled={result.inStock === false}>
                      <a href={result.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {result.inStock === false ? "Out of Stock" : "View Product"}
                      </a>
                    </Button>
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
            <h3 className="font-medium text-foreground mb-2">No Products Found</h3>
            <p className="text-muted-foreground">
              We couldn't find any products for "{lastSearched}". Try a different search term or check back later.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
