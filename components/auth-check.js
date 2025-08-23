"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated")
      const userEmail = localStorage.getItem("userEmail")
      const userName = localStorage.getItem("userName")

      console.log("[v0] Checking auth status:", { authStatus, userEmail, userName }) // Added debugging

      if (authStatus === "true") {
        setIsAuthenticated(true)
        setUser({
          email: userEmail,
          name: userName || userEmail,
        })
        console.log("[v0] User authenticated:", { email: userEmail, name: userName }) // Added debugging
      } else {
        console.log("[v0] User not authenticated") // Added debugging
      }
      setIsLoading(false)
    }

    checkAuth()

    const handleStorageChange = () => {
      console.log("[v0] Storage changed, rechecking auth") // Added debugging
      checkAuth()
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")
    setIsAuthenticated(false)
    setUser(null)
    router.push("/")
  }

  return {
    isAuthenticated,
    isLoading,
    user,
    logout,
  }
}

export function AuthProvider({ children }) {
  return <>{children}</>
}
