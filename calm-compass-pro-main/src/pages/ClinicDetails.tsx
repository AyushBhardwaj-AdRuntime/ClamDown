import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, ExternalLink, ArrowLeft, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import AppointmentBookingModal from "@/components/AppointmentBookingModal";

interface Clinic {
  id: string;
  name: string;
  category: string;
  location: string;
  contact_info: string;
  map_link: string;
  created_at: string;
}

const ClinicDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    checkUser();
    if (id) {
      fetchClinicDetails();
    }
  }, [id]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchClinicDetails = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from("clinics")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      toast.error("Failed to load clinic details");
      console.error("Error fetching clinic:", error);
      navigate("/clinics");
    } else {
      setClinic(data);
    }
    setIsLoading(false);
  };

  const handleBookingSuccess = () => {
    toast.success("Appointment booked successfully!");
    // Optionally navigate to appointments page or show success message
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1">
            <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-14 items-center gap-4 px-6">
                <SidebarTrigger />
                <Button variant="ghost" size="sm" onClick={() => navigate("/clinics")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Clinics
                </Button>
              </div>
            </header>
            <div className="p-6 flex items-center justify-center">
              <div className="text-muted-foreground">Loading clinic details...</div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (!clinic) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1">
            <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-14 items-center gap-4 px-6">
                <SidebarTrigger />
                <Button variant="ghost" size="sm" onClick={() => navigate("/clinics")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Clinics
                </Button>
              </div>
            </header>
            <div className="p-6 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">Clinic Not Found</h2>
                <p className="text-muted-foreground mb-4">The clinic you're looking for doesn't exist.</p>
                <Button onClick={() => navigate("/clinics")}>
                  Browse All Clinics
                </Button>
              </div>
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
              <Button variant="ghost" size="sm" onClick={() => navigate("/clinics")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Clinics
              </Button>
            </div>
          </header>
          
          <div className="p-6 max-w-4xl">
            <div className="space-y-6">
              {/* Clinic Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl">{clinic.name}</CardTitle>
                      <Badge variant="secondary" className="capitalize">
                        {clinic.category}
                      </Badge>
                    </div>
                    <Button 
                      onClick={() => setIsBookingModalOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      Book Appointment
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">{clinic.location}</p>
                    </div>
                  </div>

                  {clinic.contact_info && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Contact</p>
                        <p className="text-muted-foreground">{clinic.contact_info}</p>
                      </div>
                    </div>
                  )}

                  {clinic.map_link && (
                    <div className="flex items-start gap-3">
                      <ExternalLink className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Get Directions</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(clinic.map_link, "_blank")}
                          className="mt-1"
                        >
                          View on Map
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Services & Information */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm">This clinic specializes in:</p>
                      <Badge variant="outline" className="capitalize">
                        {clinic.category} treatment
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-3">
                        Professional mental health services and support for {clinic.category} related concerns.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Booking Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Available Monday - Friday</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="pt-2">
                        <Button 
                          onClick={() => setIsBookingModalOpen(true)}
                          className="w-full"
                        >
                          Book Your Appointment
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Booking Modal */}
          {isBookingModalOpen && (
            <AppointmentBookingModal
              isOpen={isBookingModalOpen}
              onClose={() => setIsBookingModalOpen(false)}
              clinic={clinic}
              onSuccess={handleBookingSuccess}
            />
          )}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ClinicDetails;
