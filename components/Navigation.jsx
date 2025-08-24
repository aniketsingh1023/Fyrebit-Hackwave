"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Home,
  TrendingUp,
  User,
  FileText,
} from "lucide-react"

export default function Navigation() {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState("")

  const sidebarItems = [
    { id: "home", icon: Home, label: "Home", href: "/home" },
    { id: "trendz", icon: TrendingUp, label: "Trendz", href: "/trendz" },
    { id: "posts", icon: FileText, label: "Posts", href: "/posts" },
    { id: "profile", icon: User, label: "Profile", href: "/profile" },
  ]

  useEffect(() => {
    const currentPath = pathname
    const activeItem = sidebarItems.find(item => item.href === currentPath)
    if (activeItem) {
      setActiveTab(activeItem.id)
    }
  }, [pathname])

  return (
    <div className="fixed left-6 top-56 h-auto bg-stone-900/90 backdrop-blur-sm rounded-2xl border border-white/20 flex flex-col items-center py-6 px-4 z-50">
      {/* Navigation Items */}
      <nav className="flex flex-col gap-3">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id || pathname === item.href
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group relative ${
                isActive 
                  ? "bg-stone-100 text-black shadow-lg" 
                  : "text-stone-400 hover:text-stone-100 hover:bg-stone-800/50"
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={20} />
              
              {/* Tooltip */}
              <div className="absolute left-16 bg-stone-100 text-black text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-lg font-light">
                {item.label}
              </div>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}