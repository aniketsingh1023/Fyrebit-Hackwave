"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-check"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Heart,
  Bell,
  Search,
  Settings,
  TrendingDown,
  Clock,
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  Plus,
} from "lucide-react"
import Link from "next/link"

// Mock data for dashboard
const mockWishlistItems = [
  {
    id: "1",
    name: "Summer Floral Dress",
    brand: "Zara",
    price: 89.99,
    originalPrice: 129.99,
    image: "/summer-floral-dress.png",
    category: "clothing",
    addedDate: "2024-01-15",
    inStock: true,
  },
  {
    id: "2",
    name: "Classic White Sneakers",
    brand: "Nike",
    price: 89.99,
    originalPrice: 119.99,
    image: "/white-sneakers.png",
    category: "shoes",
    addedDate: "2024-01-10",
    inStock: true,
  },
  {
    id: "3",
    name: "Leather Crossbody Bag",
    brand: "Coach",
    price: 199.99,
    originalPrice: 299.99,
    image: "/leather-crossbody-bag.png",
    category: "accessories",
    addedDate: "2024-01-08",
    inStock: false,
  },
]

const mockPriceAlerts = [
  {
    id: "1",
    productName: "Summer Floral Dress",
    currentPrice: 89.99,
    targetPrice: 75.0,
    status: "active",
    createdDate: "2024-01-15",
  },
  {
    id: "2",
    productName: "Classic White Sneakers",
    currentPrice: 89.99,
    targetPrice: 80.0,
    status: "triggered",
    createdDate: "2024-01-10",
  },
  {
    id: "3",
    productName: "Designer Handbag",
    currentPrice: 450.0,
    targetPrice: 350.0,
    status: "active",
    createdDate: "2024-01-05",
  },
]

const mockRecentSearches = [
  { query: "blue floral summer dress", date: "2024-01-20", results: 45 },
  { query: "white sneakers nike", date: "2024-01-19", results: 23 },
  { query: "leather handbag coach", date: "2024-01-18", results: 12 },
  { query: "black jeans high waist", date: "2024-01-17", results: 67 },
  { query: "gold jewelry necklace", date: "2024-01-16", results: 34 },
]

const mockRecommendations = [
  {
    id: "rec-1",
    name: "Bohemian Maxi Dress",
    brand: "Free People",
    price: 128.0,
    image: "/bohemian-maxi-dress.png",
    reason: "Based on your interest in summer dresses",
  },
  {
    id: "rec-2",
    name: "Minimalist Gold Ring",
    brand: "Mejuri",
    price: 85.0,
    image: "/minimalist-gold-ring.png",
    reason: "Matches your jewelry preferences",
  },
  {
    id: "rec-3",
    name: "Canvas Tote Bag",
    brand: "Everlane",
    price: 45.0,
    image: "/canvas-tote-bag.png",
    reason: "Similar to your saved accessories",
  },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    preferences: {
      categories: ["clothing", "accessories"],
      priceRange: { min: 0, max: 500 },
      brands: ["Zara", "Nike", "Coach"],
    },
  })
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (user) {
      setProfileData((prev) => ({
        ...prev,
        name: user.name || user.email?.split("@")[0] || "",
        email: user.email || "",
      }))
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleRemoveWishlistItem = (itemId) => {
    // Remove item from wishlist logic
    console.log("Removing item:", itemId)
  }

  const handleRemovePriceAlert = (alertId) => {
    // Remove price alert logic
    console.log("Removing alert:", alertId)
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
            <div>
              <h1 className="text-2xl font-serif font-bold text-foreground">My Dashboard</h1>
              <p className="text-muted-foreground">Manage your fashion finds and preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Wishlist</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Price Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{mockWishlistItems.length}</div>
                  <p className="text-muted-foreground">Wishlist Items</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Bell className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{mockPriceAlerts.length}</div>
                  <p className="text-muted-foreground">Price Alerts</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Search className="w-8 h-8 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{mockRecentSearches.length}</div>
                  <p className="text-muted-foreground">Recent Searches</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentSearches.slice(0, 3).map((search, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">"{search.query}"</p>
                          <p className="text-sm text-muted-foreground">{search.results} results found</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{search.date}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {mockRecommendations.map((item) => (
                    <div
                      key={item.id}
                      className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h4 className="font-medium text-foreground mb-1">{item.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{item.brand}</p>
                      <p className="text-lg font-bold text-foreground mb-2">${item.price}</p>
                      <p className="text-xs text-muted-foreground mb-3">{item.reason}</p>
                      <Button size="sm" className="w-full">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>My Wishlist ({mockWishlistItems.length} items)</span>
                  <Button size="sm" asChild>
                    <Link href="/home">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Items
                    </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockWishlistItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="relative">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-48 object-cover"
                        />
                        {!item.inStock && (
                          <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                            Out of Stock
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">{item.brand}</span>
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                              <Link href={`/categories/${item.category}/${item.id}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveWishlistItem(item.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <h4 className="font-medium text-foreground mb-2 line-clamp-2">{item.name}</h4>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg font-bold text-foreground">${item.price}</span>
                          {item.originalPrice > item.price && (
                            <span className="text-sm text-muted-foreground line-through">${item.originalPrice}</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">Added {item.addedDate}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Price Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Price Alerts ({mockPriceAlerts.length} active)</span>
                  <Button size="sm" asChild>
                    <Link href="/compare">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Alert
                    </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPriceAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-foreground">{alert.productName}</h4>
                          <Badge
                            variant={alert.status === "triggered" ? "default" : "secondary"}
                            className={alert.status === "triggered" ? "bg-green-100 text-green-800" : ""}
                          >
                            {alert.status === "triggered" ? "Price Reached!" : "Active"}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Current: ${alert.currentPrice}</span>
                          <span>Target: ${alert.targetPrice}</span>
                          <span>Created: {alert.createdDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {alert.status === "triggered" && (
                          <Button size="sm" asChild>
                            <Link href="/compare">
                              <TrendingDown className="w-4 h-4 mr-2" />
                              View Deal
                            </Link>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemovePriceAlert(alert.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Search History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockRecentSearches.map((search, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">"{search.query}"</p>
                          <p className="text-sm text-muted-foreground">{search.results} results found</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{search.date}</span>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/compare?q=${encodeURIComponent(search.query)}`}>Search Again</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Profile Information</span>
                  <Button variant="outline" size="sm" onClick={() => setEditingProfile(!editingProfile)}>
                    <Edit className="w-4 h-4 mr-2" />
                    {editingProfile ? "Cancel" : "Edit"}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                    <Input
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      disabled={!editingProfile}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    <Input
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={!editingProfile}
                    />
                  </div>
                  {editingProfile && (
                    <div className="flex space-x-2">
                      <Button size="sm">Save Changes</Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingProfile(false)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Favorite Categories</label>
                    <div className="flex flex-wrap gap-2">
                      {["clothing", "shoes", "accessories", "watches", "eyewear", "jewelry"].map((category) => (
                        <Badge
                          key={category}
                          variant={profileData.preferences.categories.includes(category) ? "default" : "outline"}
                          className="cursor-pointer capitalize"
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Price Range</label>
                    <div className="flex items-center space-x-4">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={profileData.preferences.priceRange.min}
                        className="w-24"
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={profileData.preferences.priceRange.max}
                        className="w-24"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
