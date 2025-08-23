import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Search, DollarSign, ArrowRight } from "lucide-react"
import Link from "next/link"

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
      <section id="features" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">How FashionFind Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to find the best fashion deals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-serif font-bold text-foreground mb-3">Upload Image</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Simply upload a photo of any fashion item you want to find or compare prices for.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-serif font-bold text-foreground mb-3">AI Analysis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our AI identifies the item and searches across multiple fashion retailers automatically.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-serif font-bold text-foreground mb-3">Best Prices</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get instant price comparisons and find the best deals from trusted retailers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Why Choose FashionFind?</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary-foreground font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-foreground mb-2">Smart Image Recognition</h3>
                    <p className="text-muted-foreground">
                      Advanced AI technology identifies fashion items from any photo with high accuracy.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-secondary-foreground font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-foreground mb-2">Real-Time Price Comparison</h3>
                    <p className="text-muted-foreground">
                      Compare prices across dozens of popular fashion retailers in real-time.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-accent-foreground font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-foreground mb-2">Save Money & Time</h3>
                    <p className="text-muted-foreground">
                      Find the best deals without manually searching multiple websites.
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
      <section className="py-16 px-4 bg-primary/5">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Ready to Start Saving?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of smart shoppers who use FashionFind to get the best deals on fashion.
          </p>
          <Button size="lg" className="text-lg px-8 py-6" asChild>
            <Link href="/login">
              Sign Up Now - It's Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Search className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-serif font-bold text-foreground">FashionFind</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 FashionFind. All rights reserved. Find the best fashion deals instantly.
          </p>
        </div>
      </footer>
    </div>
  )
}
