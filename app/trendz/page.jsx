"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Filter, TrendingUp, Star, Heart, ShoppingBag, Loader2 } from "lucide-react"
import Navigation from "@/components/Navigation"

export default function TrendzPage() {
  const [trendData, setTrendData] = useState(null)
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTopic, setSelectedTopic] = useState('light blue wide leg jeans')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [likedProducts, setLikedProducts] = useState(new Set())
  const [searchLoading, setSearchLoading] = useState(false)

  const hotTopics = [
    { id: 'light blue wide leg jeans', label: 'Wide Leg Jeans', query: 'light blue wide leg jeans' },
    { id: 'oversized hoodies', label: 'Oversized Hoodies', query: 'oversized hoodies' },
    { id: 'minimal white sneakers', label: 'White Sneakers', query: 'minimal white sneakers' },
    { id: 'basic t-shirts', label: 'Basic Tees', query: 'basic t-shirts' },
    { id: 'mandarin collar shirt', label: 'Mandarin Shirts', query: "men's blue and white wave print mandarin collar shirt" },
    { id: 'black trousers', label: 'Black Trousers', query: 'black formal trousers' },
    { id: 'casual blazers', label: 'Casual Blazers', query: 'casual blazers' },
    { id: 'denim jackets', label: 'Denim Jackets', query: 'denim jackets' }
  ]

  const fetchTrendz = async (query) => {
    try {
      setSearchLoading(true)
      const res = await fetch(`/api/trendz?query=${encodeURIComponent(query)}`)
      const data = await res.json()
      setTrendData(data)
      return data.products || []
    } catch (err) {
      console.error("Error fetching trendz:", err)
      return []
    } finally {
      setSearchLoading(false)
    }
  }

  useEffect(() => {
    async function loadInitialData() {
      setLoading(true)
      await fetchTrendz(selectedTopic)
      setLoading(false)
    }
    loadInitialData()
  }, [])

  useEffect(() => {
    if (trendData?.products) {
      const products = trendData.products.map(product => ({
        ...product,
        numPrice: parsePrice(product.price || product.discountedPrice || "0")
      }))
      
      const filtered = products.filter(product => 
        product.numPrice >= priceRange[0] && product.numPrice <= priceRange[1]
      )
      
      setFilteredProducts(filtered)
    }
  }, [trendData, priceRange])

  const parsePrice = (priceString) => {
    if (!priceString || priceString === "Price not available") return 0
    const numStr = priceString.replace(/[₹,]/g, '').trim()
    return parseInt(numStr) || 0
  }

  const handleTopicChange = async (topic) => {
    setSelectedTopic(topic)
    await fetchTrendz(topic)
  }

  const toggleLike = (productId) => {
    const newLiked = new Set(likedProducts)
    if (newLiked.has(productId)) {
      newLiked.delete(productId)
    } else {
      newLiked.add(productId)
    }
    setLikedProducts(newLiked)
  }

  const MinimalDoodles = () => (
    <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
      <div className="absolute top-20 left-10 w-8 h-8 border border-stone-400 rotate-45"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-stone-300 rounded-full"></div>
      <div className="absolute top-60 left-1/4 w-12 h-1 bg-stone-400"></div>
      <div className="absolute bottom-40 right-10 w-10 h-10 border border-stone-400 rounded-full"></div>
      <div className="absolute bottom-60 left-20 w-16 h-1 bg-stone-300"></div>
      <div className="absolute top-1/3 right-1/4 w-4 h-4 border border-stone-400"></div>
      <div className="absolute bottom-20 left-1/3 w-6 h-6 border border-stone-400 rotate-45"></div>
      
      <svg className="absolute top-32 left-1/2 w-24 h-24 stroke-stone-300 opacity-30" viewBox="0 0 100 100">
        <path d="M10,50 L90,50" fill="none" strokeWidth="1"/>
        <path d="M50,10 L50,90" fill="none" strokeWidth="1"/>
      </svg>
      <svg className="absolute bottom-40 left-1/4 w-20 h-20 stroke-stone-300 opacity-30" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="25" fill="none" strokeWidth="1"/>
      </svg>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="flex items-center gap-3 text-stone-400">
            <Loader2 className="animate-spin" size={20} />
            <p className="font-light">Loading trendz...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-stone-100 relative">
      <MinimalDoodles />
      <Navigation />
      
      {/* Header */}
      <div className="relative z-10 pt-12 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-light mb-3 text-stone-200 tracking-wider">
              TRENDZ
            </h1>
            <div className="w-24 h-px bg-stone-500 mx-auto mb-4"></div>
            <p className="text-stone-400 text-sm font-light tracking-wide uppercase">
              {trendData?.searchQuery || 'Curated Fashion'}
            </p>
          </div>

          {/* Controls */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Hot Topics */}
            <div>
              <label className="block text-xs font-light text-stone-400 mb-3 uppercase tracking-wider">
                Categories
              </label>
              <select 
                value={selectedTopic}
                onChange={(e) => handleTopicChange(e.target.value)}
                disabled={searchLoading}
                className="w-full bg-transparent border border-stone-700 rounded-none px-4 py-3 text-stone-200 font-light focus:border-stone-500 focus:outline-none transition-colors disabled:opacity-50"
              >
                {hotTopics.map(topic => (
                  <option key={topic.id} value={topic.query} className="bg-black text-stone-200">
                    {topic.label}
                  </option>
                ))}
              </select>
              {searchLoading && (
                <div className="flex items-center gap-2 mt-2 text-stone-500">
                  <Loader2 className="animate-spin" size={14} />
                  <span className="text-xs">Fetching products...</span>
                </div>
              )}
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-xs font-light text-stone-400 mb-3 uppercase tracking-wider">
                Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
              </label>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-full h-px bg-stone-700 rounded-none appearance-none cursor-pointer slider"
                />
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-px bg-stone-700 rounded-none appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
        {!trendData || !filteredProducts || filteredProducts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-stone-400 text-lg font-light">
              {!trendData ? "No trendz found" : "No items in this price range"}
            </p>
            <p className="text-stone-600 mt-2 text-sm">
              {!trendData ? "Try a different category" : "Adjust your price filter"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div 
                key={product._id} 
                className="group relative bg-stone-100 border border-stone-200 overflow-hidden hover:border-stone-300 transition-all duration-500 hover:shadow-lg hover:shadow-stone-900/20"
              >
                {/* Like Button */}
                <button 
                  onClick={() => toggleLike(product._id)}
                  className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center hover:bg-white/20 transition-colors rounded-full"
                >
                  <Heart 
                    size={16} 
                    className={likedProducts.has(product._id) ? 'fill-stone-800 text-stone-800' : 'text-stone-600 hover:text-stone-800'} 
                  />
                </button>

                {/* Product Image */}
                <div className="aspect-[4/5] overflow-hidden relative bg-stone-200">
                  {product.image && product.image !== "" ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400">
                      <ShoppingBag size={48} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-300" />
                </div>

                {/* Product Info */}
                <div className="p-6 space-y-4 text-stone-900">
                  <h3 className="font-light text-lg line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-baseline gap-3">
                    {product.discountedPrice && product.discountedPrice !== "Price not available" ? (
                      <>
                        <span className="text-xl font-light">{product.discountedPrice}</span>
                        {product.originalPrice && product.originalPrice !== product.discountedPrice && (
                          <span className="text-sm text-stone-500 line-through font-light">{product.originalPrice}</span>
                        )}
                      </>
                    ) : product.price && product.price !== "Price not available" ? (
                      <span className="text-xl font-light">{product.price}</span>
                    ) : (
                      <span className="text-sm text-stone-500 font-light">Price not available</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-light text-stone-600 uppercase tracking-wider">
                      {product.source}
                    </span>
                    <div className="flex items-center gap-1 text-stone-500">
                      <Star size={12} className="fill-current" />
                      <span className="text-xs font-light">4.{Math.floor(Math.random() * 9) + 1}</span>
                    </div>
                  </div>

                  <Button
                    asChild
                    className="w-full bg-stone-800 hover:bg-stone-900 text-stone-100 font-light py-3 px-6 transition-all duration-300 text-sm tracking-wider uppercase rounded-none"
                  >
                    <a href={product.link} target="_blank" rel="noopener noreferrer">
                      View on {product.source}
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Minimal Footer */}
      <div className="relative z-10 border-t border-stone-800 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-stone-500 text-xs font-light tracking-wider uppercase">
            Minimal • Essential • Timeless
          </p>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 0;
          background: #d6d3d1;
          cursor: pointer;
          border: none;
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 0;
          background: #d6d3d1;
          cursor: pointer;
          border: none;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}