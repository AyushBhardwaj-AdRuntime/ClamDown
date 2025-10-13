import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Phone, User, Mail, TrendingUp, Users, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { format, isAfter, isToday, isTomorrow, parseISO } from "date-fns";

interface ClinicAppointment {
  id: string;
  date: string;
  time_slot: string;
  status: string;
  created_at: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface ClinicRegistration {
  id: string;
  clinic_name: string;
  contact_person: string;
  email: string;
  phone: string;
  category: string;
  location: string;
  address: string;
  description: string;
  website: string;
  status: string;
  created_at: string;
}

const ClinicDashboard = () => {
  const navigate = useNavigate();
  const [clinicRegistration, setClinicRegistration] = useState<ClinicRegistration | null>(null);
  const [appointments, setAppointments] = useState<ClinicAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    checkUserAndClinic();
  }, []);

  const checkUserAndClinic = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    // For demo purposes, simulate an approved clinic registration
    // In a real implementation, you would query the clinic_registrations table
    const mockClinicData: ClinicRegistration = {
      id: "clinic_approved_123",
      clinic_name: "Sharda Clinic",
      contact_person: "Ayush",
      email: "dineshkumar13311334@gmail.com",
      phone: "09798291191",
      category: "depression",
      location: "Mumbai, Maharashtra",
      address: "123 Main Street, Mumbai",
      description: "Specialized in depression treatment and mental health support",
      website: "https://shardaclinic.com",
      status: "approved",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Check if the current user's email matches the clinic email
    if (session.user.email !== mockClinicData.email) {
      toast.error("No approved clinic registration found for your email");
      navigate("/clinics/register");
      return;
    }

    setClinicRegistration(mockClinicData);
    setIsAuthorized(true);
    fetchAppointments();
  };

  const fetchAppointments = async () => {
    if (!clinicRegistration) return;

    // For demo purposes, create mock appointments
    // In a real implementation, you would query the appointments table
    const mockAppointments: ClinicAppointment[] = [
      {
        id: "1",
        date: new Date().toISOString().split('T')[0],
        time_slot: "10:00 AM",
        status: "booked",
        created_at: new Date().toISOString(),
        user: {
          id: "user1",
          name: "John Doe",
          email: "john@example.com"
        }
      },
      {
        id: "2",
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        time_slot: "02:00 PM",
        status: "booked",
        created_at: new Date().toISOString(),
        user: {
          id: "user2",
          name: "Jane Smith",
          email: "jane@example.com"
        }
      },
      {
        id: "3",
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
        time_slot: "11:30 AM",
        status: "completed",
        created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        user: {
          id: "user3",
          name: "Mike Johnson",
          email: "mike@example.com"
        }
      }
    ];

    setAppointments(mockAppointments);
    setIsLoading(false);
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    // For demo purposes, simulate status update
    // In a real implementation, you would update the appointments table
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: newStatus }
          : apt
      )
    );
    toast.success("Appointment status updated successfully");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "booked":
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Booked</Badge>;
      case "cancelled":
        return <Badge variant="secondary">Cancelled</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getDateLabel = (date: string) => {
    const appointmentDate = parseISO(date);
    if (isToday(appointmentDate)) {
      return "Today";
    } else if (isTomorrow(appointmentDate)) {
      return "Tomorrow";
    } else {
      return format(appointmentDate, "MMM dd, yyyy");
    }
  };

  const upcomingAppointments = appointments.filter(apt => 
    apt.status === "booked" && (isAfter(parseISO(apt.date), new Date()) || isToday(parseISO(apt.date)))
  );

  const pastAppointments = appointments.filter(apt => 
    apt.status !== "booked" || isAfter(new Date(), parseISO(apt.date))
  );

  const todayAppointments = appointments.filter(apt => 
    apt.status === "booked" && isToday(parseISO(apt.date))
  );

  const stats = {
    total: appointments.length,
    upcoming: upcomingAppointments.length,
    today: todayAppointments.length,
    completed: appointments.filter(apt => apt.status === "completed").length
  };

  if (!isAuthorized) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1">
            <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-14 items-center gap-4 px-6">
                <SidebarTrigger />
                <h1 className="text-lg font-semibold">Clinic Dashboard</h1>
              </div>
            </header>
            <div className="p-6 flex items-center justify-center">
              <div className="text-muted-foreground">Loading...</div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1">
            <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-14 items-center gap-4 px-6">
                <SidebarTrigger />
                <h1 className="text-lg font-semibold">Clinic Dashboard</h1>
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
              <h1 className="text-lg font-semibold">Clinic Dashboard</h1>
            </div>
          </header>
          
          <div className="p-6 max-w-7xl">
            {/* Clinic Info Header */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{clinicRegistration?.clinic_name}</CardTitle>
                    <CardDescription className="text-lg mt-2">
                      {clinicRegistration?.category.charAt(0).toUpperCase() + clinicRegistration?.category.slice(1)} • {clinicRegistration?.location}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Approved
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{clinicRegistration?.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{clinicRegistration?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{clinicRegistration?.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.total}</p>
                      <p className="text-sm text-muted-foreground">Total Appointments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.today}</p>
                      <p className="text-sm text-muted-foreground">Today's Appointments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.upcoming}</p>
                      <p className="text-sm text-muted-foreground">Upcoming</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.completed}</p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Appointments Tabs */}
            <Tabs defaultValue="upcoming" className="space-y-4">
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
                <TabsTrigger value="today">Today ({todayAppointments.length})</TabsTrigger>
                <TabsTrigger value="past">Past ({pastAppointments.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-4">
                {upcomingAppointments.length === 0 ? (
                  <Card>
                    <CardContent className="py-10 text-center">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Upcoming Appointments</h3>
                      <p className="text-muted-foreground">No upcoming appointments scheduled.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {upcomingAppointments.map((appointment) => (
                      <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <CardTitle className="text-lg flex items-center gap-2">
                                <User className="h-5 w-5" />
                                {appointment.user?.name || "Anonymous User"}
                              </CardTitle>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(appointment.status)}
                                <Badge variant="outline">
                                  {getDateLabel(appointment.date)}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateAppointmentStatus(appointment.id, "completed")}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Complete
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-3 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{format(parseISO(appointment.date), "EEEE, MMMM dd, yyyy")}</span>
                            <Clock className="h-4 w-4 text-muted-foreground ml-4" />
                            <span>{appointment.time_slot}</span>
                          </div>
                          
                          {appointment.user?.email && (
                            <div className="flex items-center gap-3 text-sm">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{appointment.user.email}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-3 text-sm">
                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                            <span>Booked on {format(parseISO(appointment.created_at), "MMM dd, yyyy 'at' h:mm a")}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="today" className="space-y-4">
                {todayAppointments.length === 0 ? (
                  <Card>
                    <CardContent className="py-10 text-center">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Appointments Today</h3>
                      <p className="text-muted-foreground">No appointments scheduled for today.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {todayAppointments.map((appointment) => (
                      <Card key={appointment.id} className="border-blue-200 bg-blue-50">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <CardTitle className="text-lg flex items-center gap-2">
                                <User className="h-5 w-5" />
                                {appointment.user?.name || "Anonymous User"}
                              </CardTitle>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(appointment.status)}
                                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                  Today
                                </Badge>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateAppointmentStatus(appointment.id, "completed")}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Complete
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-3 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{appointment.time_slot}</span>
                          </div>
                          
                          {appointment.user?.email && (
                            <div className="flex items-center gap-3 text-sm">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{appointment.user.email}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="past" className="space-y-4">
                {pastAppointments.length === 0 ? (
                  <Card>
                    <CardContent className="py-10 text-center">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Past Appointments</h3>
                      <p className="text-muted-foreground">No past appointments to display.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {pastAppointments.map((appointment) => (
                      <Card key={appointment.id} className="opacity-75">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <CardTitle className="text-lg flex items-center gap-2">
                                <User className="h-5 w-5" />
                                {appointment.user?.name || "Anonymous User"}
                              </CardTitle>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(appointment.status)}
                                <Badge variant="outline">
                                  {getDateLabel(appointment.date)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-3 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{format(parseISO(appointment.date), "EEEE, MMMM dd, yyyy")}</span>
                            <Clock className="h-4 w-4 text-muted-foreground ml-4" />
                            <span>{appointment.time_slot}</span>
                          </div>
                          
                          {appointment.user?.email && (
                            <div className="flex items-center gap-3 text-sm">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{appointment.user.email}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ClinicDashboard;
