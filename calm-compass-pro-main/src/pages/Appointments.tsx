import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Phone, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format, isAfter, isToday, isTomorrow } from "date-fns";

interface Appointment {
  id: string;
  date: string;
  time_slot: string;
  status: string;
  created_at: string;
  clinic: {
    id: string;
    name: string;
    category: string;
    location: string;
    contact_info: string;
    map_link: string;
  };
}

const Appointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();
    fetchAppointments();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchAppointments = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        clinic:clinics(*)
      `)
      .eq("user_id", session.user.id)
      .order("date", { ascending: true })
      .order("time_slot", { ascending: true });

    if (!error && data) {
      setAppointments(data);
    }
    setIsLoading(false);
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    const { error } = await supabase
      .from("appointments")
      .update({ status: "cancelled" })
      .eq("id", appointmentId);

    if (error) {
      toast.error("Failed to cancel appointment");
      console.error("Error cancelling appointment:", error);
    } else {
      toast.success("Appointment cancelled successfully");
      fetchAppointments();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "booked":
        return <Badge variant="default">Booked</Badge>;
      case "cancelled":
        return <Badge variant="secondary">Cancelled</Badge>;
      case "completed":
        return <Badge variant="outline">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getDateLabel = (date: string) => {
    const appointmentDate = new Date(date);
    if (isToday(appointmentDate)) {
      return "Today";
    } else if (isTomorrow(appointmentDate)) {
      return "Tomorrow";
    } else {
      return format(appointmentDate, "MMM dd, yyyy");
    }
  };

  const upcomingAppointments = appointments.filter(apt => 
    apt.status === "booked" && isAfter(new Date(apt.date), new Date()) || 
    (apt.status === "booked" && isToday(new Date(apt.date)))
  );

  const pastAppointments = appointments.filter(apt => 
    apt.status !== "booked" || isAfter(new Date(), new Date(apt.date))
  );

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1">
            <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-14 items-center gap-4 px-6">
                <SidebarTrigger />
                <h1 className="text-lg font-semibold">My Appointments</h1>
              </div>
            </header>
            <div className="p-6 flex items-center justify-center">
              <div className="text-muted-foreground">Loading appointments...</div>
            </div>
          </main>
        </div>
      </SidebarProvider>
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
              <h1 className="text-lg font-semibold">My Appointments</h1>
            </div>
          </header>
          
          <div className="p-6 max-w-4xl">
            {upcomingAppointments.length === 0 && pastAppointments.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Appointments Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't booked any appointments yet. Find a clinic that suits your needs.
                  </p>
                  <Button onClick={() => navigate("/clinics")}>
                    Browse Clinics
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {upcomingAppointments.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
                    <div className="grid gap-4">
                      {upcomingAppointments.map((appointment) => (
                        <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <CardTitle className="text-lg">{appointment.clinic.name}</CardTitle>
                                <div className="flex items-center gap-2">
                                  {getStatusBadge(appointment.status)}
                                  <Badge variant="outline" className="capitalize">
                                    {appointment.clinic.category}
                                  </Badge>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelAppointment(appointment.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{getDateLabel(appointment.date)}</span>
                              <Clock className="h-4 w-4 text-muted-foreground ml-4" />
                              <span>{appointment.time_slot}</span>
                            </div>
                            
                            <div className="flex items-center gap-3 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{appointment.clinic.location}</span>
                            </div>
                            
                            {appointment.clinic.contact_info && (
                              <div className="flex items-center gap-3 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{appointment.clinic.contact_info}</span>
                              </div>
                            )}
                            
                            <div className="flex gap-2 pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/clinics/${appointment.clinic.id}`)}
                              >
                                View Clinic
                              </Button>
                              {appointment.clinic.map_link && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(appointment.clinic.map_link, "_blank")}
                                >
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  Directions
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {pastAppointments.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Past Appointments</h2>
                    <div className="grid gap-4">
                      {pastAppointments.map((appointment) => (
                        <Card key={appointment.id} className="opacity-75">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <CardTitle className="text-lg">{appointment.clinic.name}</CardTitle>
                                <div className="flex items-center gap-2">
                                  {getStatusBadge(appointment.status)}
                                  <Badge variant="outline" className="capitalize">
                                    {appointment.clinic.category}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{getDateLabel(appointment.date)}</span>
                              <Clock className="h-4 w-4 text-muted-foreground ml-4" />
                              <span>{appointment.time_slot}</span>
                            </div>
                            
                            <div className="flex items-center gap-3 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{appointment.clinic.location}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Appointments;
