import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Heart, Search, Phone } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background" />
        <div className="container relative mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
              <Heart className="h-4 w-4" />
              Your Mental Wellness Journey Starts Here
            </div>
            
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Your Mental Wellness{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Companion
              </span>
            </h1>
            
            <p className="mb-10 text-lg text-muted-foreground sm:text-xl">
              Track your moods, find professional support, and access emergency resources
              all in one place. Because your mental health matters.
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link to="/auth">
                <Button size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all">
                  Get Started
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="group rounded-2xl border bg-card p-8 transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Mood Tracking</h3>
              <p className="text-muted-foreground">
                Monitor your emotional well-being with our intuitive mood tracker and visualize your progress over time.
              </p>
            </div>

            <div className="group rounded-2xl border bg-card p-8 transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Find Clinics</h3>
              <p className="text-muted-foreground">
                Search and connect with mental health professionals and clinics near you with detailed filters.
              </p>
            </div>

            <div className="group rounded-2xl border bg-card p-8 transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Emergency Support</h3>
              <p className="text-muted-foreground">
                Access immediate help through our 24/7 emergency hotlines and crisis support resources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Heart className="h-5 w-5 text-primary" />
                MindCare
              </h4>
              <p className="text-sm text-muted-foreground">
                Supporting your mental wellness journey with compassion and care.
              </p>
            </div>
            
            <div>
              <h5 className="mb-4 font-semibold">Quick Links</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/auth" className="hover:text-primary">Get Started</Link></li>
                <li><a href="#" className="hover:text-primary">About Us</a></li>
                <li><a href="#" className="hover:text-primary">Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="mb-4 font-semibold">Legal</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 MindCare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
