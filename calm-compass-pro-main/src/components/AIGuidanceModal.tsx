import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Bot, Sparkles, Copy, RefreshCw, Heart, Brain, Lightbulb } from "lucide-react";

interface AIGuidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMood?: string;
}

interface AIResponse {
  guidance: string;
  techniques: string[];
  category: string;
  confidence: number;
}

const AIGuidanceModal = ({ isOpen, onClose, initialMood }: AIGuidanceModalProps) => {
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [conversationHistory, setConversationHistory] = useState<{user: string, ai: AIResponse}[]>([]);

  const predefinedPrompts = [
    "I'm feeling overwhelmed with work stress",
    "I'm having anxiety about an upcoming presentation",
    "I can't sleep because I'm worrying about everything",
    "I feel like I'm in a constant state of panic",
    "I'm struggling with social anxiety",
    "I feel depressed and unmotivated"
  ];

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'stress': return <Brain className="h-4 w-4" />;
      case 'anxiety': return <Heart className="h-4 w-4" />;
      case 'general': return <Lightbulb className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'stress': return "border-blue-200 bg-blue-50 text-blue-800";
      case 'anxiety': return "border-purple-200 bg-purple-50 text-purple-800";
      case 'general': return "border-green-200 bg-green-50 text-green-800";
      default: return "border-gray-200 bg-gray-50 text-gray-800";
    }
  };

  // Simulate AI response generation
  const generateAIResponse = async (input: string): Promise<AIResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const lowerInput = input.toLowerCase();
    
    // Determine category based on input
    let category = 'general';
    if (lowerInput.includes('stress') || lowerInput.includes('overwhelmed') || lowerInput.includes('work')) {
      category = 'stress';
    } else if (lowerInput.includes('anxiety') || lowerInput.includes('worry') || lowerInput.includes('panic') || lowerInput.includes('nervous')) {
      category = 'anxiety';
    }

    // Generate contextual responses
    const responses = {
      stress: {
        guidance: "I understand you're feeling stressed. This is completely normal, and you're not alone. Let's work through this step by step. First, recognize that stress is your body's natural response to challenges, but we can learn to manage it effectively.",
        techniques: [
          "Practice deep breathing (4-7-8 technique: inhale 4, hold 7, exhale 8)",
          "Take a 5-minute walk outside to get fresh air and change your environment",
          "Write down your thoughts in a journal to organize your mind",
          "Try progressive muscle relaxation starting from your toes to your head",
          "Listen to calming music or nature sounds for 10 minutes"
        ]
      },
      anxiety: {
        guidance: "Anxiety can feel overwhelming, but remember that these feelings are temporary and manageable. You're safe right now. Let's focus on grounding techniques that can help bring you back to the present moment.",
        techniques: [
          "Try the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste",
          "Practice box breathing: inhale 4 counts, hold 4, exhale 4, hold 4",
          "Use positive affirmations like 'I am safe' or 'This feeling will pass'",
          "Try the butterfly hug technique: cross your arms and tap alternating shoulders",
          "Focus on one small task you can complete right now"
        ]
      },
      general: {
        guidance: "It sounds like you're going through a challenging time. Remember that seeking help and taking care of your mental health is a sign of strength, not weakness. Let's explore some gentle techniques to help you feel better.",
        techniques: [
          "Practice mindful breathing for 2-3 minutes",
          "Engage in gentle physical movement like stretching or walking",
          "Connect with a trusted friend or family member",
          "Try a gratitude practice by listing 3 things you're thankful for",
          "Engage in a creative activity like drawing, writing, or music"
        ]
      }
    };

    const selectedResponse = responses[category as keyof typeof responses] || responses.general;
    
    return {
      guidance: selectedResponse.guidance,
      techniques: selectedResponse.techniques,
      category,
      confidence: Math.floor(Math.random() * 20) + 80 // 80-100% confidence
    };
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      toast.error("Please describe how you're feeling");
      return;
    }

    setIsLoading(true);
    try {
      const response = await generateAIResponse(userInput);
      setAiResponse(response);
      setConversationHistory(prev => [...prev, { user: userInput, ai: response }]);
      toast.success("AI guidance generated!");
    } catch (error) {
      toast.error("Failed to generate guidance. Please try again.");
      console.error("AI guidance error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setUserInput(prompt);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const startNewConversation = () => {
    setAiResponse(null);
    setUserInput("");
    setConversationHistory([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            AI Wellness Guidance
          </DialogTitle>
          <DialogDescription>
            Share what you're experiencing and get personalized, evidence-based guidance for managing stress and anxiety.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Quick Prompts */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Quick prompts to get started:</label>
            <div className="grid grid-cols-1 gap-2">
              {predefinedPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePromptClick(prompt)}
                  className="text-left justify-start h-auto p-3 text-xs"
                  disabled={isLoading}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>

          {/* User Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Or describe your feelings in your own words:</label>
            <Textarea
              placeholder="Tell me about what's on your mind... What are you experiencing right now?"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              rows={4}
              className="resize-none"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading || !userInput.trim()}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating Guidance...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get AI Guidance
                </>
              )}
            </Button>
          </div>

          {/* AI Response */}
          {aiResponse && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {getCategoryIcon(aiResponse.category)}
                    Personalized Guidance
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge className={getCategoryColor(aiResponse.category)}>
                      {aiResponse.category.charAt(0).toUpperCase() + aiResponse.category.slice(1)}
                    </Badge>
                    <Badge variant="secondary">
                      {aiResponse.confidence}% confidence
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Understanding & Support:</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {aiResponse.guidance}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Try These Techniques:</h4>
                  <div className="space-y-2">
                    {aiResponse.techniques.map((technique, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-background border">
                        <span className="text-primary font-bold text-sm mt-0.5">{index + 1}</span>
                        <span className="text-sm">{technique}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(technique)}
                          className="ml-auto h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={startNewConversation} size="sm">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      New Conversation
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => copyToClipboard(aiResponse.guidance)} 
                      size="sm"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Guidance
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conversation History */}
          {conversationHistory.length > 1 && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Previous Conversations:</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {conversationHistory.slice(0, -1).map((entry, index) => (
                  <div key={index} className="p-2 rounded border bg-muted/30 text-xs">
                    <div className="font-medium">You: {entry.user}</div>
                    <div className="text-muted-foreground mt-1">
                      AI: {entry.ai.guidance.substring(0, 100)}...
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIGuidanceModal;
