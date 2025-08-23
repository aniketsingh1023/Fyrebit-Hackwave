"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Grid3X3, List, Heart, Star, ArrowLeft, SlidersHorizontal } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-check"
import { useRouter } from "next/navigation"

// Mock product data
const mockProducts = {
  clothing: [
    {
      id: "dress-001",
      name: "Summer Floral Dress",
      brand: "Zara",
      price: 89.99,
      originalPrice: 129.99,
      image: "/summer-floral-dress.png",
      rating: 4.5,
      reviews: 234,
      colors: ["Blue", "Pink", "White"],
      sizes: ["XS", "S", "M", "L", "XL"],
      discount: 31,
    },
    {
      id: "shirt-002",
      name: "Classic White Shirt",
      brand: "H&M",
      price: 24.99,
      originalPrice: 39.99,
      image: "/classic-white-shirt.png",
      rating: 4.2,
      reviews: 156,
      colors: ["White", "Blue", "Black"],
      sizes: ["XS", "S", "M", "L", "XL"],
      discount: 38,
    },
    {
      id: "jeans-003",
      name: "High-Waist Skinny Jeans",
      brand: "Levi's",
      price: 79.99,
      originalPrice: 99.99,
      image: "/high-waist-jeans.png",
      rating: 4.7,
      reviews: 89,
      colors: ["Dark Blue", "Light Blue", "Black"],
      sizes: ["24", "26", "28", "30", "32"],
      discount: 20,
    },
    {
      id: "sweater-004",
      name: "Cozy Knit Sweater",
      brand: "Uniqlo",
      price: 49.99,
      originalPrice: 69.99,
      image: "/cozy-knit-sweater.png",
      rating: 4.4,
      reviews: 178,
      colors: ["Beige", "Gray", "Navy"],
      sizes: ["XS", "S", "M", "L", "XL"],
      discount: 29,
    },
  ],
  shoes: [
    {
      id: "sneakers-001",
      name: "Classic White Sneakers",
      brand: "Nike",
      price: 89.99,
      originalPrice: 119.99,
      image: "/white-sneakers.png",
      rating: 4.6,
      reviews: 342,
      colors: ["White", "Black", "Gray"],
      sizes: ["6", "7", "8", "9", "10", "11"],
      discount: 25,
    },
    {
      id: "heels-002",
      name: "Block Heel Pumps",
      brand: "Aldo",
      price: 69.99,
      originalPrice: 99.99,
      image: "/block-heel-pumps.png",
      rating: 4.3,
      reviews: 127,
      colors: ["Black", "Nude", "Red"],
      sizes: ["6", "7", "8", "9", "10"],
      discount: 30,
    },
  ],
  accessories: [
    {
      id: "bag-001",
      name: "Leather Crossbody Bag",
      brand: "Coach",
      price: 199.99,
      originalPrice: 299.99,
      image: "/leather-crossbody-bag.png",
      rating: 4.8,
      reviews: 95,
      colors: ["Black", "Brown", "Tan"],
      sizes: ["One Size"],
      discount: 33,
    },
  ],
  watches: [
    {
      id: "watch-001",
      name: "Minimalist Steel Watch",
      brand: "Daniel Wellington",
      price: 149.99,
      originalPrice: 199.99,
      image: "/minimalist-watch.png",
      rating: 4.5,
      reviews: 203,
      colors: ["Silver", "Gold", "Rose Gold"],
      sizes: ["36mm", "40mm"],
      discount: 25,
    },
  ],
  eyewear: [
    {
      id: "sunglasses-001",
      name: "Classic Aviator Sunglasses",
      brand: "Ray-Ban",
      price: 129.99,
      originalPrice: 159.99,
      image: "/aviator-sunglasses.png",
      rating: 4.7,
      reviews: 456,
      colors: ["Gold", "Silver", "Black"],
      sizes: ["One Size"],
      discount: 19,
    },
  ],
  jewelry: [
    {
      id: "necklace-001",
      name: "Delicate Gold Chain",
      brand: "Pandora",
      price: 89.99,
      originalPrice: 119.99,
      image: "/gold-chain-necklace.png",
      rating: 4.6,
      reviews: 167,
      colors: ["Gold", "Silver", "Rose Gold"],
      sizes: ['16"', '18"', '20"'],
      discount: 25,
    },
  ],
}

const categoryNames = {
  clothing: "Clothing",
  shoes: "Shoes",
  accessories: "Accessories",
  watches: "Watches",
  eyewear: "Eyewear",
  jewelry: "Jewelry",
}

export default function CategoryPage({ params }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("featured")
  const [showFilters, setShowFilters] = useState(false)
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const categoryId = params.categoryId

  const products = mockProducts[categoryId] || []
  const categoryName = categoryNames[categoryId] || "Category"

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Filter products based on search query
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/home">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-serif font-bold text-foreground">{categoryName}</h1>
              <Badge variant="secondary">{products.length} items</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}>
            <Card className="p-4">
              <h3 className="font-serif font-bold text-foreground mb-4">Filters</h3>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-foreground mb-2">Price Range</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-muted-foreground">Under $50</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-muted-foreground">$50 - $100</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-muted-foreground">$100 - $200</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-muted-foreground">Over $200</span>
                  </label>
                </div>
              </div>

              {/* Brand */}
              <div className="mb-6">
                <h4 className="font-medium text-foreground mb-2">Brand</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-muted-foreground">Zara</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-muted-foreground">H&M</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-muted-foreground">Nike</span>
                  </label>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h4 className="font-medium text-foreground mb-2">Rating</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-muted-foreground">4+ Stars</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-muted-foreground">3+ Stars</span>
                  </label>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder={`Search in ${categoryName.toLowerCase()}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </form>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-border rounded-md text-sm bg-background"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>

                <div className="flex border border-border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                  asChild
                >
                  <Link href={`/categories/${categoryId}/${product.id}`}>
                    <div className="relative">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.discount > 0 && (
                        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                          -{product.discount}%
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                        onClick={(e) => {
                          e.preventDefault()
                          // Add to wishlist logic
                        }}
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">{product.brand}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-muted-foreground">
                            {product.rating} ({product.reviews})
                          </span>
                        </div>
                      </div>
                      <h3 className="font-medium text-foreground mb-2 line-clamp-2">{product.name}</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg font-bold text-foreground">${product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {product.colors.slice(0, 3).map((color) => (
                          <Badge key={color} variant="outline" className="text-xs">
                            {color}
                          </Badge>
                        ))}
                        {product.colors.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{product.colors.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
