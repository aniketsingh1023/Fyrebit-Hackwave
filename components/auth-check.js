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

      if (authStatus === "true") {
        setIsAuthenticated(true)
        setUser({
          email: userEmail,
          name: userName || userEmail,
        })
      }
      setIsLoading(false)
    }

    checkAuth()
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
