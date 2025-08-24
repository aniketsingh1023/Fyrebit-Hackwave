"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, Search, DollarSign, ArrowRight } from "lucide-react"
import Link from "next/link"
import { CardSwiperClient } from "@/components/card-swiper-client"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-foreground">FashionFind</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </Link>
            <Button asChild>
              <Link href="/login">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6">
            Find the Best Fashion Deals
            <span className="text-primary"> Instantly</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Upload any fashion image and discover the best prices across multiple retailers. Compare, save, and shop
            smarter with our AI-powered fashion search engine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/login">
                Start Comparing Prices
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent" asChild>
              <Link href="#how-it-works">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
<section id="features" className="py-16 px-4 relative bg-amber-50">
  <div className="absolute inset-0 opacity-10">
    <div
      className="h-full w-full"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    ></div>
  </div>

  <div className="container mx-auto max-w-6xl relative z-10">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-black mb-4">
        Why Choose FashionFind?
      </h2>
      <p className="text-lg text-gray-700 max-w-2xl mx-auto">
        Discover the power of AI-driven fashion search
      </p>
    </div>

    <div className="flex justify-center">
      <div className="w-full max-w-2xl">
        {/* Manual Swipe Only */}
        <CardSwiperClient className="space-y-6" cardsToShow={1} loop={false} autoplay={false}>
          {[ 
            {
              src: "/modern-fashion-ai-technology-interface-with-sleek-.png",
              icon: <Search className="w-5 h-5 text-primary" />,
              title: "Smart Image Recognition",
              text: "Advanced AI technology identifies fashion items from any photo with high accuracy.",
              bg: "bg-primary/10",
            },
            {
              src: "/dynamic-price-comparison-dashboard-with-multiple-r.png",
              icon: <DollarSign className="w-5 h-5 text-secondary" />,
              title: "Real-Time Price Comparison",
              text: "Compare prices across dozens of popular fashion retailers in real-time.",
              bg: "bg-secondary/10",
            },
            {
              src: "/happy-shoppers-saving-money-with-fashion-deals-and.png",
              icon: <Upload className="w-5 h-5 text-accent" />,
              title: "Save Money & Time",
              text: "Find the best deals without manually searching multiple websites.",
              bg: "bg-accent/10",
            },
          ].map((card, idx) => (
            <Card key={idx} className="p-6 border border-gray-200 rounded-lg bg-white shadow-lg">
              <div className="text-center">
                <img
                  src={card.src}
                  alt={card.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className={`w-8 h-8 ${card.bg} rounded-lg flex items-center justify-center`}>
                    {card.icon}
                  </div>
                  <h3 className="font-serif font-bold text-black text-lg">{card.title}</h3>
                </div>
                <p className="text-gray-600">{card.text}</p>
              </div>
            </Card>
          ))}
        </CardSwiperClient>
      </div>
    </div>
  </div>
</section>


      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary-foreground font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-foreground mb-2">Upload Image</h3>
                    <p className="text-muted-foreground">
                      Simply upload a photo of any fashion item you want to find or compare prices for.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-secondary-foreground font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-foreground mb-2">AI Analysis</h3>
                    <p className="text-muted-foreground">
                      Our AI identifies the item and searches across multiple fashion retailers automatically.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-accent-foreground font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-foreground mb-2">Best Prices</h3>
                    <p className="text-muted-foreground">
                      Get instant price comparisons and find the best deals from trusted retailers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-card rounded-lg p-8 border border-border">
                <div className="text-center">
                  <div className="w-24 h-24 bg-muted rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Upload className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h4 className="font-serif font-bold text-foreground mb-2">Upload & Compare</h4>
                  <p className="text-sm text-muted-foreground mb-4">Try it now - upload any fashion image</p>
                  <Button className="w-full" asChild>
                    <Link href="/login">Get Started Free</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

   
{/* CTA Section */}
<section id="cta" className="py-20 px-6" style={{ backgroundColor: "#EBD5B8" }}>
  <div className="container mx-auto max-w-4xl relative">
    
    {/* Title with underline */}
    <div className="mb-10 text-center relative">
      <div className="text-4xl md:text-5xl font-serif font-bold text-foreground inline-block relative">
        WalkThrough
        <span className="text-white-600 text-4xl inline-block ml-2">▶</span>
        {/* Decorative underline */}
        <span className="block w-24 h-1 bg-white mx-auto mt-4 rounded-full"></span>
      </div>
    </div>

    {/* Video Box */}
    <div
      className="relative mx-auto rounded-3xl overflow-hidden shadow-2xl border border-border"
      style={{ maxWidth: "720px" }}
    >
      <div className="aspect-video bg-white/80 flex items-center justify-center">
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


      {/* Footer */}
   
<footer className="py-8 px-4" style={{ backgroundColor: "black" }}>
  <div className="container mx-auto text-center">
    <div className="flex items-center justify-center space-x-2 mb-4">
      <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
        <Search className="w-4 h-4 text-[#EBD5B8]" />
      </div>
      <span className="font-serif font-bold text-white">Wearly</span>
    </div>
    <p className="text-sm text-white">
      © 2024 FashionFind. All rights reserved. Find the best fashion deals instantly.
    </p>
  </div>
</footer>

    </div>
  )
}


  
