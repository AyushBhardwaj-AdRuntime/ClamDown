import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format, subDays } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const moodValues: { [key: string]: number } = {
  happy: 5,
  excited: 4,
  calm: 4,
  neutral: 3,
  anxious: 2,
  stressed: 2,
  sad: 1,
  angry: 1,
};

const Progress = () => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, avgMood: 0, mostCommon: "" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();
    fetchMoodData();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchMoodData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Get last 30 days of mood logs
    const thirtyDaysAgo = subDays(new Date(), 30);
    const { data, error } = await supabase
      .from("mood_logs")
      .select("*")
      .eq("user_id", session.user.id)
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: true });

    if (!error && data) {
      // Process data for chart
      const processedData = data.map((log) => ({
        date: format(new Date(log.created_at), "MMM d"),
        value: moodValues[log.mood] || 3,
        mood: log.mood,
      }));
      setChartData(processedData);

      // Calculate stats
      const total = data.length;
      const avgMood = data.reduce((acc, log) => acc + (moodValues[log.mood] || 3), 0) / (total || 1);
      
      const moodCounts: { [key: string]: number } = {};
      data.forEach((log) => {
        moodCounts[log.mood] = (moodCounts[log.mood] || 0) + 1;
      });
      const mostCommon = Object.keys(moodCounts).reduce((a, b) => 
        moodCounts[a] > moodCounts[b] ? a : b, ""
      );

      setStats({ total, avgMood: Math.round(avgMood * 10) / 10, mostCommon });
    }
    
    setIsLoading(false);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">
          <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center gap-4 px-6">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold">Progress</h1>
            </div>
          </header>
          
          <div className="p-6">
            {isLoading ? (
              <div className="text-center text-muted-foreground">Loading your progress...</div>
            ) : chartData.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground mb-4">No mood data available yet.</p>
                  <p className="text-sm text-muted-foreground">
                    Start tracking your moods to see your progress over time!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-3 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">{stats.total}</CardTitle>
                      <CardDescription>Total Mood Logs</CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">{stats.avgMood}/5</CardTitle>
                      <CardDescription>Average Mood Score</CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl capitalize">{stats.mostCommon}</CardTitle>
                      <CardDescription>Most Common Mood</CardDescription>
                    </CardHeader>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Mood Trends (Last 30 Days)</CardTitle>
                    <CardDescription>Track your emotional journey over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis 
                            domain={[0, 5]} 
                            ticks={[1, 2, 3, 4, 5]}
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip 
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-card border rounded-lg p-3 shadow-lg">
                                    <p className="font-medium">{payload[0].payload.date}</p>
                                    <p className="text-sm capitalize text-muted-foreground">
                                      Mood: {payload[0].payload.mood}
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2}
                            dot={{ fill: "hsl(var(--primary))", r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Progress;
