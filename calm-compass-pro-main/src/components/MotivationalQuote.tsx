import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Quote, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const quotes = [
  {
    text: "You are not alone in this journey. Every step forward is a victory worth celebrating. 💪",
    category: "motivational"
  },
  {
    text: "It's okay to not be okay. What matters is that you're taking steps to feel better. 🌱",
    category: "supportive"
  },
  {
    text: "Your mental health is just as important as your physical health. Take care of both! 🧠❤️",
    category: "health"
  },
  {
    text: "Progress, not perfection. Every small step counts towards your wellbeing. 🎯",
    category: "motivational"
  },
  {
    text: "You have survived 100% of your worst days. You're stronger than you think! 💪",
    category: "strength"
  },
  {
    text: "Self-care isn't selfish. It's essential. You deserve to prioritize your mental health. 🛁✨",
    category: "self-care"
  },
  {
    text: "Just like plants need water to grow, your mind needs care to flourish. 🌱💚",
    category: "growth"
  },
  {
    text: "You're doing better than you think. Keep going, one day at a time. 🚀",
    category: "encouraging"
  },
  {
    text: "Mental health is not a destination, but a process. It's about how you drive, not where you're going. 🛣️",
    category: "philosophical"
  },
  {
    text: "Your feelings are valid. Your struggles are real. Your recovery is possible. ✨",
    category: "validating"
  },
  {
    text: "Sometimes the bravest thing you can do is ask for help. You're being incredibly brave right now. 🦸‍♀️",
    category: "courage"
  },
  {
    text: "You don't have to be perfect to be worthy of love, care, and happiness. 🌟",
    category: "self-worth"
  },
  {
    text: "Bad days don't last forever, but strong people do. You're one of them! 💪",
    category: "resilience"
  },
  {
    text: "Taking care of your mind is the most productive thing you can do today. 🧠",
    category: "productivity"
  },
  {
    text: "You're not broken. You're human. And being human is beautifully complicated. 🌈",
    category: "humanity"
  }
];

const funnyQuotes = [
  {
    text: "My therapist told me I need to stop being so hard on myself. I'm working on it... slowly. 😅",
    category: "humor"
  },
  {
    text: "I told my anxiety to take a break. It said 'sure, but first let me worry about what happens during the break.' 😂",
    category: "humor"
  },
  {
    text: "My brain is like a browser with 47 tabs open, and I'm not sure where the music is coming from. 🎵",
    category: "humor"
  },
  {
    text: "I'm not lazy, I'm just in energy-saving mode. My mental health app told me to take it easy! 🔋",
    category: "humor"
  },
  {
    text: "I tried to organize my thoughts, but they're like socks - they keep getting lost in pairs. 🧦",
    category: "humor"
  },
  {
    text: "My stress level is so high, even my coffee is nervous. ☕😰",
    category: "humor"
  },
  {
    text: "I'm not procrastinating, I'm just prioritizing my mental health by avoiding things that stress me out. 🎯",
    category: "humor"
  },
  {
    text: "My anxiety has anxiety. We're working on it together, one panic attack at a time. 😅",
    category: "humor"
  }
];

export const MotivationalQuote = () => {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const getRandomQuote = () => {
    const allQuotes = [...quotes, ...funnyQuotes];
    const randomIndex = Math.floor(Math.random() * allQuotes.length);
    return allQuotes[randomIndex];
  };

  const changeQuote = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentQuote(getRandomQuote());
      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    // Change quote every 10 seconds
    const interval = setInterval(changeQuote, 10000);
    return () => clearInterval(interval);
  }, []);

  const getQuoteIcon = (category: string) => {
    switch (category) {
      case "humor":
        return "😂";
      case "motivational":
        return "💪";
      case "supportive":
        return "🤗";
      case "self-care":
        return "✨";
      case "courage":
        return "🦸‍♀️";
      default:
        return "💚";
    }
  };

  const getQuoteColor = (category: string) => {
    switch (category) {
      case "humor":
        return "border-orange-200 bg-orange-50";
      case "motivational":
        return "border-blue-200 bg-blue-50";
      case "supportive":
        return "border-green-200 bg-green-50";
      case "self-care":
        return "border-purple-200 bg-purple-50";
      case "courage":
        return "border-pink-200 bg-pink-50";
      default:
        return "border-emerald-200 bg-emerald-50";
    }
  };

  return (
    <Card className={`transition-all duration-300 ${getQuoteColor(currentQuote.category)}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="text-2xl">{getQuoteIcon(currentQuote.category)}</div>
          <div className="flex-1">
            <div className="flex items-start gap-2 mb-3">
              <Quote className="h-5 w-5 text-muted-foreground mt-0.5" />
              <p className={`text-sm leading-relaxed transition-opacity duration-300 ${
                isAnimating ? 'opacity-0' : 'opacity-100'
              }`}>
                {currentQuote.text}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground capitalize">
                {currentQuote.category} quote
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={changeQuote}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
