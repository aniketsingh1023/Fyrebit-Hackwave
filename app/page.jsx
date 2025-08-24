"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, Search, DollarSign, ArrowRight, Heart } from "lucide-react"
import Link from "next/link"
import { CardSwiperClient } from "@/components/card-swiper-client"

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F1E8" }}>
      <header className="bg-black border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Search className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-white tracking-wide">Wearly</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#how-it-works" className="text-gray-300 hover:text-white transition-colors font-medium">
              How It Works
            </Link>
            <Link href="/about-team" className="text-gray-300 hover:text-white transition-colors font-medium">
              About the Team
            </Link>
            <Button className="bg-amber-100 text-black hover:bg-amber-200 font-semibold px-6" asChild>
              <Link href="/login">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="py-24 px-4" style={{ backgroundColor: "#F5F1E8" }}>
        <div className="container mx-auto text-center max-w-5xl">
          <h1 className="text-6xl md:text-7xl font-serif font-bold text-black mb-8 leading-tight">
            Find Fashion That
            <span className="block text-amber-700 italic"> Fits Your Style</span>
          </h1>
          <p className="text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Upload any fashion image and discover the best prices across multiple retailers. Compare, save, and shop
            smarter with our AI-powered fashion search engine.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="text-xl px-12 py-8 bg-black text-white hover:bg-gray-800 font-semibold rounded-full"
              asChild
            >
              <Link href="/login">
                Start Your Fashion Journey
                <ArrowRight className="ml-3 w-6 h-6" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-xl px-12 py-8 border-2 border-black text-black hover:bg-black hover:text-white font-semibold rounded-full bg-transparent"
              asChild
            >
              <Link href="#how-it-works">Discover How</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 relative bg-amber-50">
        <div className="absolute inset-0 opacity-15">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
              linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)
            `,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-black mb-6 italic">Why Choose Wearly?</h2>
            <p className="text-2xl text-gray-700 max-w-3xl mx-auto font-light">
              Discover the power of AI-driven fashion search
            </p>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-3xl">
              <CardSwiperClient className="space-y-6" cardsToShow={1} loop={true}>
                <Card className="p-8 border-2 border-black rounded-2xl bg-white shadow-2xl">
                  <div className="text-center">
                    <img
                      src="/"
                      alt="AI Fashion Recognition"
                      className="w-full h-72 object-cover rounded-xl mb-6"
                    />
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                        <Search className="w-7 h-7 text-black" />
                      </div>
                      <h3 className="font-serif font-bold text-black text-2xl">Smart Image Recognition</h3>
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Advanced AI technology identifies fashion items from any photo with incredible accuracy and style
                      understanding.
                    </p>
                  </div>
                </Card>

                <Card className="p-8 border-2 border-black rounded-2xl bg-white shadow-2xl">
                  <div className="text-center">
                    <img
                      src="/dynamic-price-comparison-dashboard-with-multiple-r.png"
                      alt="Price Comparison"
                      className="w-full h-72 object-cover rounded-xl mb-6"
                    />
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-7 h-7 text-black" />
                      </div>
                      <h3 className="font-serif font-bold text-black text-2xl">Real-Time Price Comparison</h3>
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Compare prices across dozens of popular fashion retailers in real-time to find the perfect deal.
                    </p>
                  </div>
                </Card>

                <Card className="p-8 border-2 border-black rounded-2xl bg-white shadow-2xl">
                  <div className="text-center">
                    <img
                      src="/happy-shoppers-saving-money-with-fashion-deals-and.png"
                      alt="Save Money"
                      className="w-full h-72 object-cover rounded-xl mb-6"
                    />
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                        <Upload className="w-7 h-7 text-black" />
                      </div>
                      <h3 className="font-serif font-bold text-black text-2xl">Save Money & Time</h3>
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Find the best deals without manually searching multiple websites or stores.
                    </p>
                  </div>
                </Card>
              </CardSwiperClient>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-4 relative overflow-hidden" style={{ backgroundColor: "#F5F1E8" }}>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-black mb-6 italic">How It Works</h2>
          </div>

          <div className="relative">
            <CardSwiperClient className="space-y-6" cardsToShow={1} loop={true} autoplayDelay={4000}>
              {/* Card 1: Upload Image */}
              <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/wearly-fashion-upload-interface-beige-stone-texture.png"
                  alt="Upload Fashion Image"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="absolute top-8 left-8">
                  <h3 className="text-6xl font-serif font-bold text-white tracking-wider">WEARLY</h3>
                </div>
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white bg-opacity-95 rounded-2xl p-8 backdrop-blur-sm">
                    <h4 className="text-2xl font-serif font-bold text-black mb-4">Upload & Discover</h4>
                    <p className="text-lg text-gray-800 leading-relaxed">
                      "One screen, endless styles. Our interface lets users upload any fashion image and instantly
                      discover similar items across multiple retailers — fast, simple, and personalized."
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: AI Analysis */}
              <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/wearly-ai-analysis-fashion-recognition-beige-texture.png"
                  alt="AI Fashion Analysis"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="absolute top-8 left-8">
                  <h3 className="text-6xl font-serif font-bold text-white tracking-wider">WEARLY</h3>
                </div>
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white bg-opacity-95 rounded-2xl p-8 backdrop-blur-sm">
                    <h4 className="text-2xl font-serif font-bold text-black mb-4">AI-Powered Recognition</h4>
                    <p className="text-lg text-gray-800 leading-relaxed">
                      "Advanced machine learning analyzes every detail of your fashion image. Our AI understands style,
                      color, pattern, and fabric to find the most accurate matches — intelligent, precise, and
                      lightning-fast."
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3: Price Comparison */}
              <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/wearly-price-comparison-shopping-deals-beige-stone.png"
                  alt="Price Comparison Results"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="absolute top-8 left-8">
                  <h3 className="text-6xl font-serif font-bold text-white tracking-wider">WEARLY</h3>
                </div>
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white bg-opacity-95 rounded-2xl p-8 backdrop-blur-sm">
                    <h4 className="text-2xl font-serif font-bold text-black mb-4">Best Prices, Instantly</h4>
                    <p className="text-lg text-gray-800 leading-relaxed">
                      "Compare prices across dozens of top fashion retailers in seconds. Find the best deals, track
                      price drops, and save money on every purchase — comprehensive, real-time, and always accurate."
                    </p>
                  </div>
                </div>
              </div>
            </CardSwiperClient>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-amber-100">
        <div className="container mx-auto max-w-5xl relative">
          <div className="mb-12 text-center relative">
            <div className="text-5xl md:text-6xl font-serif font-bold text-black inline-block relative italic">
              WalkThrough
              <span className="text-black text-5xl inline-block ml-4">▶</span>
              <span className="block w-32 h-2 bg-black mx-auto mt-6 rounded-full"></span>
            </div>
          </div>

          <div
            className="relative mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-black"
            style={{ maxWidth: "800px" }}
          >
            <div className="aspect-video bg-white flex items-center justify-center">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/9Ftc719VHuE"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-4 bg-black">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-black" />
            </div>
            <span className="font-serif font-bold text-white text-2xl">Wearly</span>
          </div>
          <p className="text-gray-400 mb-4 text-lg">
            © 2024 Wearly. All rights reserved. Find the best fashion deals instantly.
          </p>
          <div className="flex items-center justify-center space-x-2 text-amber-100">
            <span className="text-lg">Made with</span>
            <Heart className="w-5 h-5 fill-current" />
            <span className="text-lg">by team</span>
            <span className="font-bold text-xl">fyrebit</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
