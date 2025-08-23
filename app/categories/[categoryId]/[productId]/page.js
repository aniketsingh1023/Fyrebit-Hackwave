"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, Share2, Star, ShoppingCart, Truck, Shield, RotateCcw, Plus, Minus } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-check"
import { useRouter } from "next/navigation"
import PriceComparison from "@/components/price-comparison"

export default function ProductPage({ params }) {
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { categoryId, productId } = params

  const products = mockProducts[categoryId] || []
  const product = products.find((p) => p.id === productId)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0])
      setSelectedSize(product.sizes[0])
    }
  }, [product])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!user || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/home">Back to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, quantity + change))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/categories/${categoryId}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {categoryId}
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={product.images?.[selectedImage] || product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? "border-primary" : "border-border"
                    }`}
                  >
                    <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">{product.brand}</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>
              <h1 className="text-3xl font-serif font-bold text-foreground mb-4">{product.name}</h1>
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl font-bold text-foreground">${product.price}</span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">${product.originalPrice}</span>
                    <Badge className="bg-primary text-primary-foreground">-{product.discount}% OFF</Badge>
                  </>
                )}
              </div>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="font-medium text-foreground mb-3">Color: {selectedColor}</h3>
              <div className="flex space-x-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border text-sm ${
                      selectedColor === color
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:border-primary"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-medium text-foreground mb-3">Size: {selectedSize}</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border text-sm ${
                      selectedSize === size
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:border-primary"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-medium text-foreground mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" onClick={() => handleQuantityChange(-1)}>
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <Button variant="outline" size="sm" onClick={() => handleQuantityChange(1)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-3">
              <Button size="lg" className="w-full">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-border">
              <div className="text-center">
                <Truck className="w-6 h-6 text-primary mx-auto mb-2" />
                <span className="text-sm text-muted-foreground">Free Shipping</span>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 text-primary mx-auto mb-2" />
                <span className="text-sm text-muted-foreground">Easy Returns</span>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
                <span className="text-sm text-muted-foreground">Secure Payment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Price Comparison Section */}
        <div className="mt-12">
          <PriceComparison productName={product.name} category={categoryId} className="max-w-6xl mx-auto" />
        </div>

        {/* Product Features */}
        {product.features && (
          <div className="mt-12">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Product Features</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 border border-border rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const mockProducts = {
  clothing: [
    {
      id: "dress-001",
      name: "Summer Floral Dress",
      brand: "Zara",
      price: 89.99,
      originalPrice: 129.99,
      image: "/summer-floral-dress.png",
      images: ["/summer-floral-dress.png", "/summer-floral-dress-2.png", "/summer-floral-dress-3.png"],
      rating: 4.5,
      reviews: 234,
      colors: ["Blue", "Pink", "White"],
      sizes: ["XS", "S", "M", "L", "XL"],
      discount: 31,
      description:
        "A beautiful summer dress perfect for warm weather. Made from lightweight, breathable fabric with a flattering fit.",
      features: ["Lightweight fabric", "Machine washable", "Flattering fit", "Perfect for summer"],
      priceComparison: [
        { retailer: "Zara", price: 89.99, url: "#", inStock: true },
        { retailer: "ASOS", price: 94.99, url: "#", inStock: true },
        { retailer: "Nordstrom", price: 129.99, url: "#", inStock: false },
        { retailer: "Amazon", price: 92.5, url: "#", inStock: true },
      ],
    },
  ],
  // Add other categories as needed
}
