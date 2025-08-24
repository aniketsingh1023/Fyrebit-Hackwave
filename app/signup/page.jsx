"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!")
      return
    }

    if (!agreedToTerms) {
      setError("Please agree to the terms and conditions")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const result = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        })

        if (result?.ok) {
          router.push("/home")
        } else {
          setError("Account created but login failed. Please try logging in manually.")
        }
      } else {
        setError(data.error || "Signup failed")
      }
    } catch (error) {
      console.error("Signup error:", error)
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        
        .dancing-script {
          font-family: 'Dancing Script', cursive;
        }
        
        .inter-font {
          font-family: 'Inter', sans-serif;
        }
        
        .gradient-bg {
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 25%, #000000 50%, #0d0d0d 75%, #000000 100%);
          position: relative;
          min-height: 100vh;
        }
        
        .gradient-bg::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 15% 85%, rgba(245, 241, 232, 0.08) 0%, transparent 60%),
            radial-gradient(circle at 85% 15%, rgba(245, 241, 232, 0.06) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(245, 241, 232, 0.03) 0%, transparent 70%);
          pointer-events: none;
        }
        
        .gradient-bg::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            linear-gradient(45deg, transparent 30%, rgba(245, 241, 232, 0.02) 50%, transparent 70%),
            linear-gradient(-45deg, transparent 30%, rgba(0, 0, 0, 0.1) 50%, transparent 70%);
          pointer-events: none;
        }
        
        .animated-heading {
          animation: fadeInUp 1s ease-out, glow 2s ease-in-out infinite alternate;
          text-shadow: 0 0 20px rgba(245, 241, 232, 0.5);
        }
        
        .animated-subtitle {
          animation: fadeInUp 1s ease-out 0.3s both;
        }
        
        .floating-card {
          animation: float 6s ease-in-out infinite;
          backdrop-filter: blur(20px);
          background: rgba(245, 241, 232, 0.98);
          border: 2px solid rgba(0, 0, 0, 0.1);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4), 
                      0 0 0 1px rgba(245, 241, 232, 0.2),
                      inset 0 1px 0 rgba(245, 241, 232, 0.9);
          position: relative;
        }
        
        .floating-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(245, 241, 232, 0.1) 0%, transparent 50%, rgba(0, 0, 0, 0.05) 100%);
          border-radius: inherit;
          pointer-events: none;
        }
        
        .glass-input {
          background: #F5F1E8;
          border: 2px solid rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          color: #000;
        }
        
        .glass-input:focus {
          background: #F5F1E8;
          border: 2px solid #000;
          box-shadow: 0 0 0 4px rgba(245, 241, 232, 0.3), 0 8px 25px rgba(0, 0, 0, 0.1);
          transform: translateY(-3px);
        }
        
        .glass-input::placeholder {
          color: rgba(0, 0, 0, 0.5);
        }
        
        .modern-button {
          background: linear-gradient(135deg, #F5F1E8 0%, rgba(245, 241, 232, 0.9) 100%);
          border: 2px solid #000;
          color: #000 !important;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          font-weight: 600;
        }
        
        .modern-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #000 0%, #333 100%);
          color: #F5F1E8 !important;
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
        }
        
        .modern-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent);
          transition: left 0.6s;
        }
        
        .modern-button:hover:not(:disabled)::before {
          left: 100%;
        }
        
        .modern-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .logo-icon {
          background: linear-gradient(135deg, #000000 0%, #333333 100%);
          animation: pulse 2s ease-in-out infinite;
        }
        
        .form-container {
          animation: slideInUp 0.8s ease-out 0.5s both;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes glow {
          from {
            text-shadow: 0 0 20px rgba(245, 241, 232, 0.5), 0 0 40px rgba(245, 241, 232, 0.3);
          }
          to {
            text-shadow: 0 0 30px rgba(245, 241, 232, 0.8), 0 0 50px rgba(245, 241, 232, 0.5);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
      
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4 inter-font">
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 logo-icon rounded-xl flex items-center justify-center shadow-lg">
                <Search className="w-7 h-7" style={{color: '#F5F1E8'}} />
              </div>
              <h1 
                className="text-5xl font-bold dancing-script animated-heading" 
                style={{color: '#F5F1E8'}}
              >
                Wearly
              </h1>
            </div>
            <p className="text-gray-300 text-lg animated-subtitle inter-font font-light">
              Create your account to start finding the best deals
            </p>
          </div>

          <div className="form-container">
            <Card className="floating-card border-0 shadow-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-3xl font-bold text-black inter-font">Create Account</CardTitle>
                <CardDescription className="text-gray-600 text-base inter-font">
                  Enter your details to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg shadow-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-black font-medium inter-font">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="glass-input h-12 inter-font"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-black font-medium inter-font">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="glass-input h-12 inter-font"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-black font-medium inter-font">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="glass-input h-12 pr-12 inter-font"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="confirmPassword" className="text-black font-medium inter-font">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="glass-input h-12 pr-12 inter-font"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 pt-2">
                    <div className="relative">
                      <input
                        id="terms"
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="w-5 h-5 mt-0.5 appearance-none border-2 border-black rounded bg-F5F1E8 checked:bg-black checked:border-black focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-200"
                        style={{backgroundColor: agreedToTerms ? '#000' : '#F5F1E8'}}
                      />
                      {agreedToTerms && (
                        <svg
                          className="w-3 h-3 text-white absolute top-1 left-1 pointer-events-none"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <Label htmlFor="terms" className="text-sm text-gray-800 inter-font leading-relaxed">
                      I agree to the{" "}
                      <Link href="/terms" className="text-black hover:underline font-semibold transition-all duration-200 hover:text-gray-800">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-black hover:underline font-semibold transition-all duration-200 hover:text-gray-800">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !agreedToTerms}
                    className="w-full h-14 modern-button text-lg inter-font disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    <span className="relative z-10">
                      {isLoading ? "Creating account..." : "Create Account"}
                    </span>
                  </Button>
                </form>

                <div className="mt-8 text-center border-t pt-6" style={{borderColor: 'rgba(0, 0, 0, 0.1)'}}>
                  <p className="text-gray-800 inter-font">
                    Already have an account?{" "}
                    <Link href="/login" className="text-black hover:underline font-semibold transition-all duration-200 hover:text-gray-700">
                      Sign in
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 text-center">
              <Link 
                href="/" 
                className="inline-flex items-center text-gray-400 hover:text-gray-300 transition-all duration-300 inter-font group"
              >
                <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
                <span className="ml-2">Back to home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}