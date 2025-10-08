import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Heart, TrendingUp, Clock } from "lucide-react";

interface DashboardStatsProps {
  userId: string;
}

export const DashboardStats = ({ userId }: DashboardStatsProps) => {
  const [stats, setStats] = useState({
    totalMoods: 0,
    recentMoods: 0,
    upcomingAppointments: 0,
    currentStreak: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchStats();
    }
  }, [userId]);

  const fetchStats = async () => {
    try {
      // Get total mood logs
      const { data: moodLogs, error: moodError } = await supabase
        .from("mood_logs")
        .select("created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      // Get recent moods (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentMoods = moodLogs?.filter(log => 
        new Date(log.created_at) >= sevenDaysAgo
      ).length || 0;

      // Get upcoming appointments
      const { data: appointments, error: appointmentError } = await supabase
        .from("appointments")
        .select("date")
        .eq("user_id", userId)
        .eq("status", "booked")
        .gte("date", new Date().toISOString().split('T')[0]);

      // Calculate current streak
      let currentStreak = 0;
      if (moodLogs && moodLogs.length > 0) {
        const sortedLogs = moodLogs.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        let checkDate = new Date();
        checkDate.setHours(0, 0, 0, 0);
        
        for (const log of sortedLogs) {
          const logDate = new Date(log.created_at);
          logDate.setHours(0, 0, 0, 0);
          
          if (logDate.getTime() === checkDate.getTime()) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else if (logDate.getTime() < checkDate.getTime()) {
            break;
          }
        }
      }

      setStats({
        totalMoods: moodLogs?.length || 0,
        recentMoods,
        upcomingAppointments: appointments?.length || 0,
        currentStreak
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Mood Logs</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalMoods}</div>
          <p className="text-xs text-muted-foreground">
            {stats.recentMoods} in the last 7 days
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.currentStreak}</div>
          <p className="text-xs text-muted-foreground">
            consecutive days
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
          <p className="text-xs text-muted-foreground">
            scheduled visits
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Wellness Journey</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalMoods > 0 ? Math.round((stats.totalMoods / 30) * 100) : 0}%
          </div>
          <p className="text-xs text-muted-foreground">
            monthly goal progress
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
