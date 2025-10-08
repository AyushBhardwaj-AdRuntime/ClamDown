import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";
import MoodTrackingModal from "@/components/MoodTrackingModal";
import { MoodTrendChart } from "@/components/MoodTrendChart";

const moodEmojis = [
  { mood: "happy", emoji: "😊", label: "Happy", color: "text-yellow-500" },
  { mood: "calm", emoji: "😌", label: "Calm", color: "text-blue-500" },
  { mood: "excited", emoji: "🤗", label: "Excited", color: "text-orange-500" },
  { mood: "neutral", emoji: "😐", label: "Neutral", color: "text-gray-500" },
  { mood: "sad", emoji: "😢", label: "Sad", color: "text-blue-700" },
  { mood: "anxious", emoji: "😰", label: "Anxious", color: "text-purple-500" },
  { mood: "stressed", emoji: "😫", label: "Stressed", color: "text-red-500" },
  { mood: "angry", emoji: "😠", label: "Angry", color: "text-red-700" },
];

const MoodTracker = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<{
    mood: string;
    emoji: string;
    label: string;
    color: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recentMoods, setRecentMoods] = useState<any[]>([]);

  useEffect(() => {
    checkUser();
    fetchRecentMoods();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchRecentMoods = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("mood_logs")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (!error && data) {
      setRecentMoods(data);
    }
  };

  const handleMoodSelect = (mood: typeof moodEmojis[0]) => {
    setSelectedMood(mood);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchRecentMoods();
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">
          <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center gap-4 px-6">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold">Mood Tracker</h1>
            </div>
          </header>
          
          <div className="p-6 max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle>How are you feeling today?</CardTitle>
                <CardDescription>Select your current mood and add optional notes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-4 gap-4">
                  {moodEmojis.map((item) => (
                    <button
                      key={item.mood}
                      onClick={() => handleMoodSelect(item)}
                      className="flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all hover:scale-105 border-border hover:border-primary/50 hover:bg-primary/5"
                    >
                      <span className="text-4xl">{item.emoji}</span>
                      <span className={`text-sm font-medium ${item.color}`}>{item.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <MoodTrendChart />
              
              {recentMoods.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Mood Logs</CardTitle>
                    <CardDescription>Your last 5 mood entries</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentMoods.map((log) => {
                        const moodData = moodEmojis.find((m) => m.mood === log.mood);
                        return (
                          <div key={log.id} className="flex items-start gap-3 rounded-lg border p-3">
                            <span className="text-2xl">{moodData?.emoji}</span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className={`font-medium ${moodData?.color}`}>
                                  {moodData?.label}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(log.created_at), "MMM d, h:mm a")}
                                </span>
                              </div>
                              {log.notes && (
                                <p className="mt-1 text-sm text-muted-foreground">{log.notes}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {selectedMood && (
              <MoodTrackingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedMood={selectedMood}
                onSuccess={handleModalSuccess}
              />
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MoodTracker;
