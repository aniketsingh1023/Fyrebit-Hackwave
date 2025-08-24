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

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !user) router.push("/login")
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

  if (!user) return null

  // Upload image and call backend
  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setAnalyzing(true)

    try {
      const formData = new FormData()
      formData.append("image", file)

      // Call backend upload & analysis
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()

      if (!data.success) throw new Error(data.error || "Analysis failed")

      // Set uploaded image and analysis results
      setUploadedImage(data.uploadedImage.url)
      setAnalysisResult({
        suggestedSearch: data.analysis.suggestedSearch,
        products: data.analysis.products || [],
        objects: data.analysis.objects || [],
        labels: data.analysis.labels || [],
      })
    } catch (err) {
      console.error("Image analysis error:", err)
      alert("Failed to analyze image")
    } finally {
      setAnalyzing(false)
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
              <p className="text-muted-foreground">
                Upload any fashion image to find similar items and compare prices
              </p>
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
                <p className="text-muted-foreground mb-4">
                  Drag and drop or click to select a fashion image
                </p>
                <input
                  type="file"
                  accept="image/*"
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
              <div className="p-4 bg-muted rounded-lg mb-4">
                <h4 className="font-medium text-foreground mb-2">Suggested Search</h4>
                <p className="text-muted-foreground">{analysisResult.suggestedSearch}</p>
              </div>

              {/* Show scraped products */}
              <PriceComparison products={analysisResult.products} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
