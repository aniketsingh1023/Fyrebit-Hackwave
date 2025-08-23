"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Upload,
  User,
  Heart,
  ShoppingBag,
  Bell,
  Menu,
  X,
  Shirt,
  Crown,
  Watch,
  Glasses,
  Footprints,
  Gem,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const categories = [
  {
    id: "clothing",
    name: "Clothing",
    icon: Shirt,
    description: "Dresses, tops, pants, and more",
    image: "/fashion-clothing-collection.png",
    itemCount: "2,500+ items",
  },
  {
    id: "shoes",
    name: "Shoes",
    icon: Footprints,
    description: "Sneakers, heels, boots, and sandals",
    image: "/fashion-shoes-collection.png",
    itemCount: "1,800+ items",
  },
  {
    id: "accessories",
    name: "Accessories",
    icon: Crown,
    description: "Bags, jewelry, and fashion accessories",
    image: "/fashion-accessories-collection.png",
    itemCount: "3,200+ items",
  },
  {
    id: "watches",
    name: "Watches",
    icon: Watch,
    description: "Luxury and casual timepieces",
    image: "/luxury-watches.png",
    itemCount: "900+ items",
  },
  {
    id: "eyewear",
    name: "Eyewear",
    icon: Glasses,
    description: "Sunglasses and prescription glasses",
    image: "/placeholder-w3qk0.png",
    itemCount: "650+ items",
  },
  {
    id: "jewelry",
    name: "Jewelry",
    icon: Gem,
    description: "Rings, necklaces, and fine jewelry",
    image: "/luxury-jewelry-collection.png",
    itemCount: "1,100+ items",
  },
]

const offers = [
  {
    id: 1,
    title: "Summer Sale",
    description: "Up to 70% off on summer collection",
    discount: "70% OFF",
    image: "/summer-fashion-sale.png",
    validUntil: "July 31, 2024",
  },
  {
    id: 2,
    title: "Designer Deals",
    description: "Luxury brands at unbeatable prices",
    discount: "50% OFF",
    image: "/luxury-designer-fashion.png",
    validUntil: "August 15, 2024",
  },
  {
    id: 3,
    title: "New Arrivals",
    description: "Fresh styles just landed",
    discount: "30% OFF",
    image: "/new-fashion-arrivals.png",
    validUntil: "August 30, 2024",
  },
]

const trendingProducts = [
  {
    id: 1,
    name: "Floral Summer Dress",
    brand: "Zara",
    price: 2999,
    originalPrice: 4999,
    discount: 40,
    rating: 4.3,
    reviews: 1250,
    image: "/summer-floral-dress.png",
    category: "clothing",
  },
  {
    id: 2,
    name: "Classic White Sneakers",
    brand: "Nike",
    price: 7999,
    originalPrice: 9999,
    discount: 20,
    rating: 4.5,
    reviews: 2100,
    image: "/white-sneakers.png",
    category: "shoes",
  },
  {
    id: 3,
    name: "Leather Crossbody Bag",
    brand: "Coach",
    price: 15999,
    originalPrice: 19999,
    discount: 20,
    rating: 4.7,
    reviews: 890,
    image: "/leather-crossbody-bag.png",
    category: "accessories",
  },
  {
    id: 4,
    name: "Denim Jacket",
    brand: "Levi's",
    price: 3499,
    originalPrice: 4999,
    discount: 30,
    rating: 4.2,
    reviews: 1560,
    image: "/classic-denim-jacket.png",
    category: "clothing",
  },
  {
    id: 5,
    name: "Gold Chain Necklace",
    brand: "Pandora",
    price: 8999,
    originalPrice: 12999,
    discount: 31,
    rating: 4.6,
    reviews: 670,
    image: "/gold-chain-necklace.png",
    category: "jewelry",
  },
  {
    id: 6,
    name: "Aviator Sunglasses",
    brand: "Ray-Ban",
    price: 12999,
    originalPrice: 15999,
    discount: 19,
    rating: 4.8,
    reviews: 3200,
    image: "/aviator-sunglasses.png",
    category: "eyewear",
  },
  {
    id: 7,
    name: "Black Ankle Boots",
    brand: "Dr. Martens",
    price: 16999,
    originalPrice: 19999,
    discount: 15,
    rating: 4.4,
    reviews: 980,
    image: "/black-ankle-boots.png",
    category: "shoes",
  },
  {
    id: 8,
    name: "Silk Scarf",
    brand: "Hermès",
    price: 25999,
    originalPrice: 29999,
    discount: 13,
    rating: 4.9,
    reviews: 450,
    image: "/luxury-silk-scarf.png",
    category: "accessories",
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-serif font-bold text-foreground">FashionFind</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/home" className="text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
                Categories
              </Link>
              <Link href="/compare" className="text-muted-foreground hover:text-foreground transition-colors">
                Compare
              </Link>
              <Link href="/deals" className="text-muted-foreground hover:text-foreground transition-colors">
                Deals
              </Link>
            </div>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/wishlist">
                  <Heart className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/notifications">
                  <Bell className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <User className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <div className="flex flex-col space-y-3">
                <Link href="/home" className="text-foreground hover:text-primary transition-colors">
                  Home
                </Link>
                <Link href="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
                  Categories
                </Link>
                <Link href="/compare" className="text-muted-foreground hover:text-foreground transition-colors">
                  Compare
                </Link>
                <Link href="/deals" className="text-muted-foreground hover:text-foreground transition-colors">
                  Deals
                </Link>
                <Link href="/wishlist" className="text-muted-foreground hover:text-foreground transition-colors">
                  Wishlist
                </Link>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout} className="w-fit bg-transparent">
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Welcome Section */}
      <section className="py-8 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
              Welcome back, {session?.user?.name || session?.user?.email}!
            </h2>
            <p className="text-lg text-muted-foreground">Find the best fashion deals with our AI-powered search</p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for fashion items, brands, or upload an image..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-20 h-12 text-base"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                <Button type="button" variant="ghost" size="sm" asChild>
                  <Link href="/upload">
                    <Upload className="w-4 h-4" />
                  </Link>
                </Button>
                <Button type="submit" size="sm">
                  Search
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Offers Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Special Offers</h2>
            <Button variant="outline" asChild>
              <Link href="/deals">View All Deals</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative">
                  <img src={offer.image || "/placeholder.svg"} alt={offer.title} className="w-full h-40 object-cover" />
                  <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">{offer.discount}</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-serif font-bold text-foreground mb-2">{offer.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{offer.description}</p>
                  <p className="text-xs text-muted-foreground">Valid until {offer.validUntil}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">Shop by Category</h2>
            <p className="text-lg text-muted-foreground">Discover the best deals across all fashion categories</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <Card
                  key={category.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
                  asChild
                >
                  <Link href={`/categories/${category.id}`}>
                    <div className="relative">
                      <img
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                      <div className="absolute top-4 left-4">
                        <div className="w-10 h-10 bg-white/90 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-serif font-bold text-foreground">{category.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {category.itemCount}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{category.description}</p>
                    </CardContent>
                  </Link>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Trending Now</h2>
            <Button variant="outline" asChild>
              <Link href="/products">View All Products</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {trendingProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
                asChild
              >
                <Link href={`/categories/${product.category}/${product.id}`}>
                  <div className="relative">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 md:h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-primary text-primary-foreground text-xs">{product.discount}% OFF</Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 w-8 h-8 p-0 bg-white/80 hover:bg-white"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardContent className="p-3 md:p-4">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">{product.brand}</p>
                        <h3 className="text-sm md:text-base font-medium text-foreground line-clamp-2 leading-tight">
                          {product.name}
                        </h3>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-sm md:text-base font-bold text-foreground">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <span className="text-xs md:text-sm text-muted-foreground line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <div className="flex items-center space-x-1">
                          <span className="text-xs font-medium text-foreground">{product.rating}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-xs ${
                                  i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">({product.reviews.toLocaleString()})</span>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-serif font-bold text-foreground mb-2">Upload & Compare</h3>
              <p className="text-muted-foreground mb-4">
                Upload any fashion image and find similar items with price comparisons
              </p>
              <Button asChild>
                <Link href="/upload">Start Upload</Link>
              </Button>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <ShoppingBag className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-serif font-bold text-foreground mb-2">Price Alerts</h3>
              <p className="text-muted-foreground mb-4">
                Set up price alerts for your favorite items and never miss a deal
              </p>
              <Button variant="outline" asChild>
                <Link href="/alerts">Setup Alerts</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
