import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smile, Search, Phone, TrendingUp, Calendar, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import { MotivationalQuote } from "@/components/MotivationalQuote";
import { DailyTip } from "@/components/DailyTip";
import { DashboardStats } from "@/components/DashboardStats";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    // Get profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", session.user.id)
      .single();

    if (profile) {
      setUserName(profile.name);
      setUserId(session.user.id);
    }
    
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">
          <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center gap-4 px-6">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
          </header>
          
          <div className="p-6 space-y-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold">Welcome back, {userName}! 👋</h2>
              <p className="text-muted-foreground mt-1">Here's your wellness overview</p>
            </div>

            {/* Stats Overview */}
            {userId && <DashboardStats userId={userId} />}

            {/* Motivational Content */}
            <div className="grid gap-6 lg:grid-cols-2">
              <MotivationalQuote />
              <DailyTip />
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smile className="h-5 w-5 text-accent" />
                    Mood Tracker
                  </CardTitle>
                  <CardDescription>Log your daily mood</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/mood">
                    <Button className="w-full">Track Mood</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-primary" />
                    Find Clinics
                  </CardTitle>
                  <CardDescription>Search for support</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/clinics">
                    <Button variant="outline" className="w-full">Search</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    My Appointments
                  </CardTitle>
                  <CardDescription>Manage bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/appointments">
                    <Button variant="outline" className="w-full">View Appointments</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-success" />
                    Progress
                  </CardTitle>
                  <CardDescription>View your journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/progress">
                    <Button variant="outline" className="w-full">View Progress</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <Bot className="h-5 w-5" />
                    AI Guidance
                  </CardTitle>
                  <CardDescription className="text-purple-600">Get personalized support</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/ai-guidance">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">Ask AI Assistant</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-destructive/50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <Phone className="h-5 w-5" />
                    Emergency
                  </CardTitle>
                  <CardDescription>Get immediate help</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/emergency">
                    <Button variant="destructive" className="w-full">Get Help</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
