"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, Search, DollarSign, Heart, Menu, X } from "lucide-react"
import Link from "next/link"
import { CardSwiperClient } from "@/components/card-swiper-client"

export default function LandingPage() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F1E8" }}>
      {/* Floating Rounded Navbar (Top-Right) */}
      <header className="fixed top-4 right-4 z-50">
        <div className="bg-black border border-gray-800 rounded-2xl shadow-lg px-4 py-2">
          <div className="flex items-center justify-between space-x-4">
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/how-it-works"
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                How It Works
              </Link>
              <Link
                href="/about-team"
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                About the Team
              </Link>
              <Button
                size="sm"
                className="bg-amber-100 text-black hover:bg-amber-200 font-semibold px-4 py-1"
                asChild
              >
                <Link href="/login">Get Started</Link>
              </Button>
            </nav>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden text-white focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex">
            <div className="bg-black w-72 h-full shadow-2xl p-6 rounded-r-2xl relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <nav className="mt-12 flex flex-col space-y-6">
                <Link
                  href="/how-it-works"
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  How It Works
                </Link>
                <Link
                  href="/about-team"
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  About the Team
                </Link>
                <Button
                  className="bg-amber-100 text-black hover:bg-amber-200 font-semibold px-6"
                  asChild
                >
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section (Full Screen, Touching Top) */}
      <section
        className="relative w-full h-[100vh] bg-cover bg-center bg-[url('/hero2.png')] md:bg-[url('/hero-section.png')]"
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </section>

      {/* Features Section */}
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
          />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-Jersey10 font-bold text-black mb-6">
              Why Choose Wearly?
            </h2>
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
                      src="image.png"
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
                      src="img2.png"
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
                      src="img5.jpg"
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

      {/* WalkThrough Section */}
      <section
        className="py-16 px-4 sm:py-20 sm:px-6 bg-cover bg-center"
        style={{ backgroundImage: "url('/yt.jpg')" }}
      >
        <div className="container mx-auto max-w-5xl relative">
          <div className="mb-8 sm:mb-12 text-center relative">
            <div className="inline-block bg-black px-4 py-4 sm:px-8 sm:py-6 rounded-xl shadow-lg">
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white italic leading-snug">
                WalkThrough
                <span className="text-white text-3xl sm:text-5xl inline-block ml-2 sm:ml-4">▶</span>
              </h2>
              <div className="block w-20 sm:w-32 h-1.5 sm:h-2 bg-white mx-auto mt-4 sm:mt-6 rounded-full"></div>
            </div>
          </div>

          <div
            className="relative mx-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white"
            style={{ maxWidth: "800px" }}
          >
            <div className="aspect-video bg-black flex items-center justify-center">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/y37nkZkaCW8"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
