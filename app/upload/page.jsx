"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, ImageIcon, ArrowLeft, Search, AlertCircle, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

export default function UploadPage() {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [products, setProducts] = useState([])
  const [error, setError] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
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
        setError("Please upload a valid image file (JPEG, PNG, or WebP)")
        return
      }

      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        setError("File size must be less than 10MB")
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
        throw new Error(errorData.error || "Upload failed")
      }

      const result = await response.json()

      if (result.success) {
        setAnalysisResult(result.analysis)
        setProducts(result.products || [])
      } else {
        throw new Error(result.error || "Analysis failed")
      }
    } catch (error) {
      console.error("Upload error:", error)
      setError(error.message || "Failed to analyze image. Please try again.")
    } finally {
      setAnalyzing(false)
      setUploadProgress(0)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith("image/")) {
        const event = { target: { files: [file] } }
        handleImageUpload(event)
      } else {
        setError("Please drop an image file")
      }
    }
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
              <h1 className="text-2xl font-serif font-bold text-foreground">Upload & Compare</h1>
              <p className="text-muted-foreground">Upload any fashion image to find similar items and compare prices</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Error Display */}
        {error && (
          <Card className="mb-8 border-destructive">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-destructive">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5 text-primary" />
              <span>Upload Fashion Image</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!uploadedImage ? (
              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-foreground mb-2">Upload an image</h3>
                <p className="text-muted-foreground mb-4">Drag and drop or click to select a fashion image</p>
                <p className="text-sm text-muted-foreground mb-4">Supports JPEG, PNG, WebP up to 10MB</p>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button asChild>
                  <label htmlFor="image-upload" className="cursor-pointer">
                    Choose Image
                  </label>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Uploaded fashion item"
                    className="w-full max-w-md mx-auto rounded-lg shadow-lg"
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
                  >
                    Upload Different Image
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analysis Progress */}
        {analyzing && (
          <Card className="mb-8">
            <CardContent className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="font-medium text-foreground mb-2">Analyzing Image...</h3>
              <p className="text-muted-foreground mb-4">
                Our AI is identifying the fashion item and finding similar products
              </p>
              {uploadProgress > 0 && (
                <div className="w-full bg-muted rounded-full h-2 mb-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
              <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Image uploaded</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>AI analyzing...</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-primary" />
                <span>Analysis Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Detected Item</h4>
                  <p className="text-muted-foreground capitalize">
                    {analysisResult.subcategory || analysisResult.category}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Category</h4>
                  <p className="text-muted-foreground capitalize">{analysisResult.category}</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Colors</h4>
                  <p className="text-muted-foreground capitalize">
                    {analysisResult.colors?.join(", ") || "Not detected"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Confidence</h4>
                  <p className="text-muted-foreground">{((analysisResult.confidence || 0) * 100).toFixed(0)}%</p>
                </div>
              </div>
              {analysisResult.description && (
                <div className="mb-4">
                  <h4 className="font-medium text-foreground mb-2">Description</h4>
                  <p className="text-muted-foreground">{analysisResult.description}</p>
                </div>
              )}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Suggested Search</h4>
                <p className="text-muted-foreground">{analysisResult.suggestedSearch}</p>
              </div>
              {analysisResult.tags && analysisResult.tags.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-foreground mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
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
          <Card>
            <CardHeader>
              <CardTitle>Similar Products Found ({products.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="aspect-square mb-3 overflow-hidden rounded-md bg-muted">
                      <img
                        src={product.image || "/placeholder.svg?height=200&width=200"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium text-foreground mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-lg font-semibold text-primary mb-2">{product.price}</p>
                    <p className="text-sm text-muted-foreground mb-3">Source: {product.source}</p>
                    <Button asChild size="sm" className="w-full">
                      <a href={product.link} target="_blank" rel="noopener noreferrer">
                        View on Myntra
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
