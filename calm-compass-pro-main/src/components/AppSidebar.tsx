import { Link, useLocation } from "react-router-dom";
import { Heart, Home, Smile, Search, Phone, TrendingUp, Calendar, LogOut, Bot, Building2, Shield } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState, useEffect } from "react";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Mood Tracker", url: "/mood", icon: Smile },
  { title: "AI Guidance", url: "/ai-guidance", icon: Bot },
  { title: "Find Clinics", url: "/clinics", icon: Search },
  { title: "My Appointments", url: "/appointments", icon: Calendar },
  { title: "Progress", url: "/progress", icon: TrendingUp },
  { title: "Emergency", url: "/emergency", icon: Phone },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isClinicOwner, setIsClinicOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkClinicOwnership();
    checkAdminAccess();
  }, []);

  const checkClinicOwnership = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // For demo purposes, check if user email matches the mock clinic email
    // In a real implementation, you would query the clinic_registrations table
    const mockClinicEmail = "dineshkumar13311334@gmail.com";
    setIsClinicOwner(session.user.email === mockClinicEmail);
  };

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // For demo purposes, check if user email matches the admin email
    // In a real implementation, you would query an admin users table
    const adminEmail = "admin@mindcare.com";
    setIsAdmin(session.user.email === adminEmail);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/");
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        <div className="px-6 py-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold text-primary">
            <Heart className="h-5 w-5" />
            MindCare
          </Link>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              
              {isClinicOwner && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location.pathname === "/clinic-dashboard"}>
                    <Link to="/clinic-dashboard">
                      <Building2 className="h-4 w-4" />
                      <span>Clinic Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              
              {isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location.pathname === "/admin"}>
                    <Link to="/admin">
                      <Shield className="h-4 w-4" />
                      <span>Admin Panel</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <Button 
          variant="ghost" 
          className="w-full justify-start" 
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
