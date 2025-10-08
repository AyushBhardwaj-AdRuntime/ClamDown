import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const dailyTips = [
  {
    tip: "Take 5 deep breaths when you feel overwhelmed. Inhale for 4 counts, hold for 4, exhale for 6.",
    category: "breathing",
    emoji: "🫁"
  },
  {
    tip: "Write down 3 things you're grateful for today. Gratitude can shift your perspective instantly.",
    category: "gratitude",
    emoji: "🙏"
  },
  {
    tip: "Step outside for 10 minutes of fresh air. Nature has a calming effect on the nervous system.",
    category: "nature",
    emoji: "🌿"
  },
  {
    tip: "Listen to your favorite song and dance like nobody's watching. Movement releases endorphins!",
    category: "movement",
    emoji: "💃"
  },
  {
    tip: "Practice the 5-4-3-2-1 grounding technique: 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.",
    category: "grounding",
    emoji: "🌍"
  },
  {
    tip: "Set a timer for 2 minutes and do nothing but sit quietly. Even brief meditation helps.",
    category: "meditation",
    emoji: "🧘‍♀️"
  },
  {
    tip: "Send a kind message to someone you care about. Spreading kindness boosts your own mood too.",
    category: "kindness",
    emoji: "💌"
  },
  {
    tip: "Drink a glass of water. Dehydration can affect your mood and energy levels.",
    category: "hydration",
    emoji: "💧"
  },
  {
    tip: "Take a warm shower or bath. Water therapy is a simple but effective stress reliever.",
    category: "self-care",
    emoji: "🛁"
  },
  {
    tip: "Write down your thoughts in a journal. Getting them out of your head can provide clarity.",
    category: "journaling",
    emoji: "📝"
  },
  {
    tip: "Look at old photos of happy memories. Nostalgia can boost positive emotions.",
    category: "memories",
    emoji: "📸"
  },
  {
    tip: "Try progressive muscle relaxation: tense each muscle group for 5 seconds, then release.",
    category: "relaxation",
    emoji: "😌"
  },
  {
    tip: "Eat something nutritious. Your brain needs good fuel to function at its best.",
    category: "nutrition",
    emoji: "🥗"
  },
  {
    tip: "Do something creative for 15 minutes - draw, color, craft, or write. Creativity is therapeutic.",
    category: "creativity",
    emoji: "🎨"
  },
  {
    tip: "Connect with a friend or family member. Social connection is vital for mental health.",
    category: "connection",
    emoji: "👥"
  }
];

export const DailyTip = () => {
  const [currentTip, setCurrentTip] = useState(dailyTips[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const getRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * dailyTips.length);
    return dailyTips[randomIndex];
  };

  const changeTip = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentTip(getRandomTip());
      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    // Change tip every 15 seconds
    const interval = setInterval(changeTip, 15000);
    return () => clearInterval(interval);
  }, []);

  const getCategoryColor = (category: string) => {
    const colors = {
      breathing: "border-cyan-200 bg-cyan-50",
      gratitude: "border-yellow-200 bg-yellow-50",
      nature: "border-green-200 bg-green-50",
      movement: "border-pink-200 bg-pink-50",
      grounding: "border-brown-200 bg-brown-50",
      meditation: "border-purple-200 bg-purple-50",
      kindness: "border-red-200 bg-red-50",
      hydration: "border-blue-200 bg-blue-50",
      "self-care": "border-indigo-200 bg-indigo-50",
      journaling: "border-orange-200 bg-orange-50",
      memories: "border-rose-200 bg-rose-50",
      relaxation: "border-emerald-200 bg-emerald-50",
      nutrition: "border-lime-200 bg-lime-50",
      creativity: "border-violet-200 bg-violet-50",
      connection: "border-teal-200 bg-teal-50"
    };
    return colors[category as keyof typeof colors] || "border-gray-200 bg-gray-50";
  };

  return (
    <Card className={`transition-all duration-300 ${getCategoryColor(currentTip.category)}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          Daily Wellness Tip
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{currentTip.emoji}</span>
            <p className={`text-sm leading-relaxed transition-opacity duration-300 ${
              isAnimating ? 'opacity-0' : 'opacity-100'
            }`}>
              {currentTip.tip}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground capitalize">
              {currentTip.category} tip
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={changeTip}
              className="h-8 w-8 p-0"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
