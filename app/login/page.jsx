"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Invalid email or password")
      setIsLoading(false)
    } else if (result?.ok) {
      window.location.href = "/home"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#F5F1E8]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#F5F1E8]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#F5F1E8] to-[#E8E0D1] rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300">
              <Search className="w-7 h-7 text-black" />
            </div>
            <h1 className="text-7xl font-bold tracking-wide text-[#F5F1E8] relative">
              <span className="inline-block animate-bounce" style={{animationDelay: '0ms'}}>W</span>
              <span className="inline-block animate-bounce" style={{animationDelay: '100ms'}}>e</span>
              <span className="inline-block animate-bounce" style={{animationDelay: '200ms'}}>a</span>
              <span className="inline-block animate-bounce" style={{animationDelay: '300ms'}}>r</span>
              <span className="inline-block animate-bounce" style={{animationDelay: '400ms'}}>l</span>
              <span className="inline-block animate-bounce" style={{animationDelay: '500ms'}}>y</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transform translate-x-full animate-shimmer"></div>
            </h1>
          </div>
          <p className="text-[#F5F1E8] text-lg font-medium animate-fade-in-up">
            Welcome back! Sign in to your account
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#F5F1E8] to-transparent mx-auto mt-4 animate-pulse"></div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] animate-fade-in-up delay-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl text-black font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text">
              Sign In
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 text-sm text-red-600 bg-red-50/80 border border-red-200/50 rounded-lg backdrop-blur-sm animate-shake">
                  {error}
                </div>
              )}

              <div className="space-y-2 group">
                <Label htmlFor="email" className="text-black font-medium text-base group-focus-within:text-gray-800 transition-colors">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="test@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/90 border-2 border-gray-300/50 text-black focus:ring-2 focus:ring-black/20 focus:border-black transition-all duration-300 text-base py-3 hover:bg-white hover:border-gray-400 rounded-lg"
                />
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="password" className="text-black font-medium text-base group-focus-within:text-gray-800 transition-colors">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-12 bg-white/90 border-2 border-gray-300/50 text-black focus:ring-2 focus:ring-black/20 focus:border-black transition-all duration-300 text-base py-3 hover:bg-white hover:border-gray-400 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black transition-all duration-300 hover:scale-110 p-1 rounded-full hover:bg-gray-100"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-5 h-5 text-black bg-gray-100 border-2 border-gray-300 rounded focus:ring-black focus:ring-2 transition-all duration-300 hover:scale-110"
                  />
                  <Label htmlFor="remember" className="text-base text-gray-700 hover:text-black transition-colors cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <Link href="/forgot-password" className="text-base text-black hover:text-gray-700 transition-colors font-medium relative group">
                  Forgot password?
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black text-white font-semibold py-4 text-base rounded-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-base text-gray-700">
                Don't have an account?{" "}
                <Link href="/signup" className="text-black hover:text-gray-700 transition-colors font-semibold relative group">
                  Sign up
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center animate-fade-in-up delay-500">
          <Link href="/" className="text-base text-[#F5F1E8] hover:text-white transition-all duration-300 inline-flex items-center space-x-2 hover:space-x-3 group">
            <span className="transform transition-transform group-hover:-translate-x-1">←</span>
            <span>Back to home</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(12deg);
          }
          100% {
            transform: translateX(300%) skewX(12deg);
          }
        }
        
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .delay-200 {
          animation-delay: 200ms;
        }
        
        .delay-500 {
          animation-delay: 500ms;
        }
        
        .active\\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  )
}