import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";

interface MoodData {
  mood: string;
  notes: string | null;
  created_at: string;
}

const moodEmojis: { [key: string]: string } = {
  happy: "😊",
  calm: "😌",
  excited: "🤗",
  neutral: "😐",
  sad: "😢",
  anxious: "😰",
  stressed: "😫",
  angry: "😠",
};

const moodValues: { [key: string]: number } = {
  happy: 8,
  excited: 9,
  calm: 7,
  neutral: 5,
  sad: 2,
  anxious: 3,
  stressed: 1,
  angry: 1,
};

interface ChartData {
  date: string;
  mood: number;
  moodName: string;
  emoji: string;
}

export const MoodTrendChart = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMoodTrend();
  }, []);

  const fetchMoodTrend = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Get mood logs from the last 14 days
    const { data, error } = await supabase
      .from("mood_logs")
      .select("mood, created_at")
      .eq("user_id", session.user.id)
      .gte("created_at", subDays(new Date(), 14).toISOString())
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching mood data:", error);
      setLoading(false);
      return;
    }

    // Group by date and get the latest mood for each day
    const moodByDate: { [key: string]: MoodData } = {};
    data?.forEach((mood) => {
      const date = format(new Date(mood.created_at), "yyyy-MM-dd");
      if (!moodByDate[date] || new Date(mood.created_at) > new Date(moodByDate[date].created_at)) {
        moodByDate[date] = mood;
      }
    });

    // Create chart data
    const chartDataArray: ChartData[] = [];
    for (let i = 13; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, "yyyy-MM-dd");
      const moodData = moodByDate[dateStr];
      
      if (moodData) {
        chartDataArray.push({
          date: format(date, "MMM dd"),
          mood: moodValues[moodData.mood] || 5,
          moodName: moodData.mood,
          emoji: moodEmojis[moodData.mood] || "😐",
        });
      } else {
        // Fill in missing days with neutral mood
        chartDataArray.push({
          date: format(date, "MMM dd"),
          mood: 5,
          moodName: "neutral",
          emoji: "😐",
        });
      }
    }

    setChartData(chartDataArray);
    setLoading(false);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{`${data.emoji} ${data.moodName.charAt(0).toUpperCase() + data.moodName.slice(1)}`}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mood Trend</CardTitle>
          <CardDescription>Your mood over the last 14 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood Trend</CardTitle>
        <CardDescription>Your mood over the last 14 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 10]}
                className="text-xs"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const moodNames = Object.keys(moodValues);
                  const moodName = moodNames.find(key => moodValues[key] === value);
                  return moodName ? moodEmojis[moodName] : value.toString();
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {Object.entries(moodEmojis).map(([mood, emoji]) => (
            <span key={mood} className="text-xs text-muted-foreground">
              {emoji} {mood.charAt(0).toUpperCase() + mood.slice(1)}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
