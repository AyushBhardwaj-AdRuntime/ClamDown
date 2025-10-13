import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Sparkles, Heart, Brain, Shield, Users, BookOpen, TrendingUp } from "lucide-react";
import AIGuidanceModal from "@/components/AIGuidanceModal";

const AIGuidance = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Personalized Support",
      description: "Get tailored advice based on your specific situation and feelings",
      color: "border-blue-200 bg-blue-50"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Evidence-Based Techniques",
      description: "Learn proven methods for managing stress, anxiety, and mental wellness",
      color: "border-green-200 bg-green-50"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "24/7 Availability",
      description: "Access guidance whenever you need it, day or night",
      color: "border-pink-200 bg-pink-50"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Privacy Focused",
      description: "Your conversations are private and secure",
      color: "border-purple-200 bg-purple-50"
    }
  ];

  const commonTopics = [
    {
      topic: "Work Stress",
      description: "Managing deadlines, workload, and workplace anxiety",
      icon: "💼"
    },
    {
      topic: "Social Anxiety",
      description: "Coping with social situations and building confidence",
      icon: "👥"
    },
    {
      topic: "Sleep Issues",
      description: "Improving sleep quality and managing racing thoughts",
      icon: "😴"
    },
    {
      topic: "Panic Attacks",
      description: "Understanding and managing panic symptoms",
      icon: "⚡"
    },
    {
      topic: "Relationship Stress",
      description: "Navigating relationship challenges and communication",
      icon: "💕"
    },
    {
      topic: "Life Transitions",
      description: "Coping with major life changes and uncertainty",
      icon: "🌱"
    }
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">
          <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center gap-4 px-6">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold">AI Wellness Guidance</h1>
            </div>
          </header>
          
          <div className="p-6 max-w-6xl">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <Bot className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-4">
                AI-Powered Mental Wellness Support
              </h1>
              <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
                Get personalized, evidence-based guidance for managing stress, anxiety, and improving your mental well-being. 
                Our AI assistant is here to support you 24/7.
              </p>
              <Button 
                size="lg" 
                onClick={() => setIsModalOpen(true)}
                className="mb-4"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Start AI Conversation
              </Button>
              <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                <Badge variant="secondary">
                  <Shield className="mr-1 h-3 w-3" />
                  Privacy Protected
                </Badge>
                <Badge variant="secondary">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  Evidence-Based
                </Badge>
                <Badge variant="secondary">
                  <Heart className="mr-1 h-3 w-3" />
                  Always Available
                </Badge>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {features.map((feature, index) => (
                <Card key={index} className={`${feature.color} hover:shadow-lg transition-shadow`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {feature.icon}
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Common Topics */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Common Topics We Can Help With
                </CardTitle>
                <CardDescription>
                  Click on any topic to start a conversation about it
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {commonTopics.map((topic, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => setIsModalOpen(true)}
                      className="h-auto p-4 text-left justify-start hover:bg-primary/5"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{topic.icon}</span>
                        <div>
                          <div className="font-medium">{topic.topic}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {topic.description}
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle>How AI Guidance Works</CardTitle>
                <CardDescription>
                  Simple steps to get the support you need
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <span className="text-lg font-bold text-primary">1</span>
                    </div>
                    <h3 className="font-medium mb-2">Share Your Feelings</h3>
                    <p className="text-sm text-muted-foreground">
                      Describe what you're experiencing or choose from common prompts
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <span className="text-lg font-bold text-primary">2</span>
                    </div>
                    <h3 className="font-medium mb-2">Get Personalized Advice</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive tailored guidance and practical techniques
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <span className="text-lg font-bold text-primary">3</span>
                    </div>
                    <h3 className="font-medium mb-2">Apply & Practice</h3>
                    <p className="text-sm text-muted-foreground">
                      Use the techniques and continue the conversation as needed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Notice */}
            <Card className="mt-8 border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800 mb-2">Important Notice</h4>
                    <p className="text-sm text-amber-700">
                      AI guidance is for informational purposes only and is not a substitute for professional mental health care. 
                      If you're experiencing a mental health emergency, please contact emergency services or a mental health professional immediately.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <AIGuidanceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </SidebarProvider>
  );
};

export default AIGuidance;
