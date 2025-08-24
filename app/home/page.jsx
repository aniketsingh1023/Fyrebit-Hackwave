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
  Camera,
  Sparkles,
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
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-serif font-bold text-foreground">FashionFind</h1>
            </div>



            <div className="hidden md:flex items-center space-x-4">

            </div>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

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

      <section className="py-4 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
              Welcome back, {session?.user?.name || session?.user?.email}!
            </h2>
            <p className="text-lg text-muted-foreground">Find the best fashion deals with our AI-powered search</p>
          </div>

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

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-3xl font-serif font-bold text-foreground mb-4">Visual Search</h2>
            <p className="text-lg text-muted-foreground">Upload any fashion image and find similar items instantly</p>
          </div>

          <Card
            className="max-w-4xl mx-auto overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
            asChild
          >
            <Link href="/upload">
              <div className="relative bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-8 md:p-12">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 group-hover:from-primary/10 group-hover:to-secondary/10 transition-all duration-300" />

                <div className="relative z-4 text-center">
                  <div className="w-20 h-10 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Camera className="w-10 h-10 text-primary" />
                  </div>

                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
                    AI-Powered Fashion Search
                  </h3>

                  <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Simply upload a photo of any fashion item and our AI will analyze it to find similar products with
                    the best prices across multiple retailers
                  </p>

                  <div className="flex items-center justify-center space-x-8 mb-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Upload className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-sm font-medium text-foreground">Upload Image</p>
                    </div>

                    <div className="w-8 h-px bg-border"></div>

                    <div className="text-center">
                      <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Sparkles className="w-6 h-6 text-secondary" />
                      </div>
                      <p className="text-sm font-medium text-foreground">AI Analysis</p>
                    </div>

                    <div className="w-8 h-px bg-border"></div>

                    <div className="text-center">
                      <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Search className="w-6 h-6 text-accent" />
                      </div>
                      <p className="text-sm font-medium text-foreground">Find Similar</p>
                    </div>
                  </div>

                  <Button size="lg" className="group-hover:scale-105 transition-transform duration-300">
                    <Camera className="w-5 h-5 mr-2" />
                    Start Visual Search
                  </Button>
                </div>
              </div>
            </Link>
          </Card>
        </div>
      </section>
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
