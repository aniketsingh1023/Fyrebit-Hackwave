"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Upload,
  User,
  Home,
  TrendingUp,
  FileText,
  Camera,
  Sparkles,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("home")
  const [trendData, setTrendData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { data: session, status } = useSession()
  const router = useRouter()

  const sidebarItems = [
    { id: "home", icon: Home, label: "Home", href: "/home" },
    { id: "trendz", icon: TrendingUp, label: "Trendz", href: "/trendz" },
    { id: "posts", icon: FileText, label: "Posts", href: "/posts" },
    { id: "profile", icon: User, label: "Profile", href: "/profile" },
  ]

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    const fetchInitialTrends = async () => {
      try {
        const res = await fetch("/api/trendz?query=trending fashion")
        const data = await res.json()
        setTrendData(data)
      } catch (err) {
        console.error("Error fetching trends:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchInitialTrends()
  }, [])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex items-center gap-3 text-stone-400">
          <Loader2 className="animate-spin" size={20} />
          <p className="font-light">Loading...</p>
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

  return (
    <div className="min-h-screen bg-black text-stone-100 flex overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 ml-24 relative z-10">
        {/* Header Section */}
        <div className="pt-12 pb-12 px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-7xl mb-6 text-stone-100 tracking-wide font-minecraft">
                Wearly
              </h1>
              <div className="w-24 h-px bg-stone-500 mx-auto mb-8"></div>
              <p className="text-stone-400 text-lg font-light tracking-wide">
                Welcome back, {session?.user?.name || session?.user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Visual Search Section */}
        <div className="px-8 pb-10 -mt-16">
          <div className="max-w-5xl mx-auto">
 

            <Link href="/upload">
              <div className="bg-stone-100 rounded-3xl p-10 hover:bg-stone-50 transition-all duration-500 group cursor-pointer shadow-2xl">
                <div className="text-center text-black">
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                    <Camera className="w-12 h-12 text-stone-100" />
                  </div>

                  <h3 className="text-3xl font-light mb-6 tracking-wide">
                    AI-Powered Fashion Discovery
                  </h3>

                  <p className="text-stone-700 mb-12 max-w-2xl mx-auto font-light text-lg leading-relaxed">
                    Simply upload a photo of any fashion item and our AI will analyze it to find similar products with the best prices across multiple retailers
                  </p>

                  <div className="flex items-center justify-center gap-16 mb-12">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-8 h-8 text-stone-100" />
                      </div>
                      <p className="text-sm font-light">Upload Image</p>
                    </div>

                    <div className="w-12 h-px bg-stone-400"></div>

                    <div className="text-center">
                      <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-stone-100" />
                      </div>
                      <p className="text-sm font-light">AI Analysis</p>
                    </div>

                    <div className="w-12 h-px bg-stone-400"></div>

                    <div className="text-center">
                      <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-stone-100" />
                      </div>
                      <p className="text-sm font-light">Find Similar</p>
                    </div>
                  </div>

                  <Button className="bg-black text-stone-100 hover:bg-stone-800 font-light px-10 py-4 text-lg rounded-2xl group-hover:scale-105 transition-transform duration-300">
                    <Camera className="w-6 h-6 mr-3" />
                    Start Visual Search
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .font-minecraft {
          font-family: 'Press Start 2P', cursive;
        }
      `}</style>
    </div>
  )
}
