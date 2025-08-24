"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"

export default function WishlistButton({ product, className = "" }) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    if (session && product?.id) {
      checkWishlistStatus()
    }
  }, [session, product?.id])

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch("/api/wishlist")
      if (response.ok) {
        const data = await response.json()
        const inWishlist = data.wishlist.some((item) => item.id === product.id)
        setIsInWishlist(inWishlist)
      }
    } catch (error) {
      console.error("Error checking wishlist status:", error)
    }
  }

  const toggleWishlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!session) {
      // Redirect to login if not authenticated
      window.location.href = "/login"
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product }),
      })

      if (response.ok) {
        const data = await response.json()
        setIsInWishlist(data.inWishlist)
      }
    } catch (error) {
      console.error("Error updating wishlist:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`w-8 h-8 p-0 bg-white/80 hover:bg-white ${className}`}
      onClick={toggleWishlist}
      disabled={isLoading}
    >
      <Heart className={`w-4 h-4 transition-colors ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
    </Button>
  )
}
