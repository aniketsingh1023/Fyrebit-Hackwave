"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-check"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, ImageIcon, ArrowLeft, Search } from "lucide-react"
import Link from "next/link"
import PriceComparison from "@/components/price-comparison"

export default function UploadPage() {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
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

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock analysis result
    const mockResult = {
      category: "clothing",
      productType: "dress",
      colors: ["blue", "floral"],
      style: "summer dress",
      confidence: 0.92,
      suggestedSearch: "blue floral summer dress",
    }

    setAnalysisResult(mockResult)
    setAnalyzing(false)
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
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-foreground mb-2">Upload an image</h3>
                <p className="text-muted-foreground mb-4">Drag and drop or click to select a fashion image</p>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
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
                    className="w-full max-w-md mx-auto rounded-lg"
                  />
                </div>
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setUploadedImage(null)
                      setAnalysisResult(null)
                      setAnalyzing(false)
                    }}
                  >
                    Upload Different Image
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analyzing && (
          <Card className="mb-8">
            <CardContent className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="font-medium text-foreground mb-2">Analyzing Image...</h3>
              <p className="text-muted-foreground">
                Our AI is identifying the fashion item and finding similar products
              </p>
            </CardContent>
          </Card>
        )}

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
                  <p className="text-muted-foreground capitalize">{analysisResult.productType}</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Category</h4>
                  <p className="text-muted-foreground capitalize">{analysisResult.category}</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Colors</h4>
                  <p className="text-muted-foreground capitalize">{analysisResult.colors.join(", ")}</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Confidence</h4>
                  <p className="text-muted-foreground">{(analysisResult.confidence * 100).toFixed(0)}%</p>
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Suggested Search</h4>
                <p className="text-muted-foreground">{analysisResult.suggestedSearch}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Price Comparison */}
        {analysisResult && (
          <PriceComparison productName={analysisResult.suggestedSearch} category={analysisResult.category} />
        )}
      </div>
    </div>
  )
}
