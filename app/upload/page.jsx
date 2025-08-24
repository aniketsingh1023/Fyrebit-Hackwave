"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Image, ArrowLeft, Search, AlertCircle, CheckCircle, Clock, Target, TrendingUp, Star } from "lucide-react"
import Link from "next/link"

// Minimalist space background
const SpaceBackground = () => {
  const [particles, setParticles] = useState([])
  
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = []
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.1,
          delay: Math.random() * 5
        })
      }
      setParticles(newParticles)
    }
    
    generateParticles()
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-black" />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-neutral-900/20 to-neutral-800/10" />
      
      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bg-neutral-300 rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animationDelay: `${particle.delay}s`,
            animationDuration: '4s'
          }}
        />
      ))}
      
      {/* Subtle moving elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neutral-200/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-neutral-100/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}} />
    </div>
  )
}

export default function UploadPage() {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [products, setProducts] = useState([])
  const [error, setError] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/login")
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-neutral-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-500">loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
      if (!allowedTypes.includes(file.type)) {
        setError("invalid file type (jpeg, png, webp only)")
        return
      }

      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        setError("file too large (max 10mb)")
        return
      }

      setError(null)
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target.result)
        analyzeImage(file)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async (file) => {
    setAnalyzing(true)
    setUploadProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("image", file)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "upload failed")
      }

      const result = await response.json()

      if (result.success) {
        setAnalysisResult(result.analysis)
        setProducts(result.products || [])
      } else {
        throw new Error(result.error || "analysis failed")
      }
    } catch (error) {
      console.error("Upload error:", error)
      setError(error.message || "analysis failed, try again")
    } finally {
      setAnalyzing(false)
      setUploadProgress(0)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith("image/")) {
        const event = { target: { files: [file] } }
        handleImageUpload(event)
      } else {
        setError("not an image file")
      }
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <SpaceBackground />
      
      {/* Header */}
      <div className="border-b border-neutral-800/50 relative z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild className="text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50">
              <Link href="/home">
                <ArrowLeft className="w-4 h-4 mr-2" />
                back to home
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-light text-neutral-100">
                wearly<span className="text-neutral-500"> / upload & compare</span>
              </h1>
              <p className="text-neutral-500 text-sm">upload any fashion image to find similar items and compare prices</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        {/* Error Display */}
        {error && (
          <Card className="mb-8 bg-red-950/20 border-red-900/30">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Section */}
        <Card className="mb-8 bg-neutral-900/30 border-neutral-800/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-neutral-200">
              <Upload className="w-5 h-5 text-neutral-300" />
              <span className="font-light">upload fashion image</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!uploadedImage ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging 
                    ? "border-neutral-400 bg-neutral-900/20" 
                    : "border-neutral-700 hover:border-neutral-600"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Image className={`w-12 h-12 mx-auto mb-4 transition-colors ${
                  isDragging ? "text-neutral-300" : "text-neutral-600"
                }`} />
                <h3 className="font-medium text-neutral-200 mb-2">upload an image</h3>
                <p className="text-neutral-500 mb-4 text-sm">drag and drop or click to select a fashion image</p>
                <p className="text-xs text-neutral-600 mb-4">supports jpeg, png, webp up to 10mb</p>
                
                {/* Quick stats */}
                <div className="flex items-center justify-center space-x-6 mb-6 text-xs text-neutral-600">
                  <div className="flex items-center space-x-1">
                    <Target className="w-3 h-3" />
                    <span>94% accuracy</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>~2s analysis</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>1m+ products</span>
                  </div>
                </div>
                
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button asChild className="bg-neutral-200 text-black hover:bg-neutral-300 font-medium">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    choose image
                  </label>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="uploaded fashion item"
                    className="w-full max-w-md mx-auto rounded-lg shadow-lg border border-neutral-800"
                  />
                </div>
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setUploadedImage(null)
                      setAnalysisResult(null)
                      setProducts([])
                      setAnalyzing(false)
                      setError(null)
                    }}
                    className="border-neutral-700 text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200"
                  >
                    upload different image
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analysis Progress */}
        {analyzing && (
          <Card className="mb-8 bg-neutral-900/30 border-neutral-800/50">
            <CardContent className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-neutral-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="font-medium text-neutral-200 mb-2">analyzing image...</h3>
              <p className="text-neutral-500 mb-4 text-sm">
                ai is identifying the fashion item and finding similar products
              </p>
              {uploadProgress > 0 && (
                <div className="w-full bg-neutral-800 rounded-full h-2 mb-2">
                  <div
                    className="bg-neutral-300 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
              <div className="flex items-center justify-center space-x-4 text-sm text-neutral-500">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>image uploaded</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>ai analyzing...</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <Card className="mb-8 bg-neutral-900/30 border-neutral-800/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-neutral-200">
                <Search className="w-5 h-5 text-neutral-300" />
                <span className="font-light">analysis results</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-neutral-300 mb-2">detected item</h4>
                  <p className="text-neutral-400 capitalize">
                    {analysisResult.subcategory || analysisResult.category}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-300 mb-2">category</h4>
                  <p className="text-neutral-400 capitalize">{analysisResult.category}</p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-300 mb-2">colors</h4>
                  <p className="text-neutral-400 capitalize">
                    {analysisResult.colors?.join(", ") || "not detected"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-300 mb-2">confidence</h4>
                  <p className="text-neutral-400">{((analysisResult.confidence || 0) * 100).toFixed(0)}%</p>
                </div>
              </div>
              {analysisResult.description && (
                <div className="mb-4">
                  <h4 className="font-medium text-neutral-300 mb-2">description</h4>
                  <p className="text-neutral-400">{analysisResult.description}</p>
                </div>
              )}
              <div className="p-4 bg-neutral-800/30 rounded-lg">
                <h4 className="font-medium text-neutral-300 mb-2">suggested search</h4>
                <p className="text-neutral-400">{analysisResult.suggestedSearch}</p>
              </div>
              {analysisResult.tags && analysisResult.tags.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-neutral-300 mb-2">tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-neutral-800/50 text-neutral-400 rounded-md text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Products Grid */}
        {products.length > 0 && (
          <Card className="bg-neutral-900/30 border-neutral-800/50">
            <CardHeader>
              <CardTitle className="text-neutral-200 font-light">similar products found ({products.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <div key={index} className="border border-neutral-800/50 bg-neutral-900/20 rounded-lg p-4 hover:bg-neutral-900/40 hover:border-neutral-700/50 transition-all">
                    <div className="aspect-square mb-3 overflow-hidden rounded-md bg-neutral-800/30">
                      <img
                        src={product.image || "/placeholder.svg?height=200&width=200"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium text-neutral-200 mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-lg font-semibold text-neutral-300 mb-2">{product.price}</p>
                    <p className="text-sm text-neutral-500 mb-3">source: {product.source}</p>
                    <Button asChild size="sm" className="w-full bg-neutral-200 text-black hover:bg-neutral-300 font-medium">
                      <a href={product.link} target="_blank" rel="noopener noreferrer">
                        view on wearly
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}