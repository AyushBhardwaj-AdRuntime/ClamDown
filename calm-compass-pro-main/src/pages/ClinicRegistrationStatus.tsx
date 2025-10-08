import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, Clock, XCircle, FileText, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface RegistrationData {
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
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

const ClinicRegistrationStatus = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();
    fetchRegistrations();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from("clinic_registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching registrations:", error);
        toast.error("Failed to load registration status");
      } else {
        setRegistrations(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load registration status");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Under Review</Badge>;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'approved':
        return "Congratulations! Your clinic has been approved and is now live on our platform.";
      case 'rejected':
        return "Unfortunately, your registration was not approved. Please contact support for more information.";
      default:
        return "Your registration is currently under review. We'll notify you once it's processed.";
    }
  };

  const getNextSteps = (status: string) => {
    switch (status) {
      case 'approved':
        return [
          "Your clinic is now visible to users",
          "You can manage your profile and appointments",
          "Check your email for login credentials"
        ];
      case 'rejected':
        return [
          "Review the rejection reason in your email",
          "Make necessary corrections",
          "Submit a new registration"
        ];
      default:
        return [
          "We'll review your information within 2-3 business days",
          "Check your email for updates",
          "Contact us if you have any questions"
        ];
    }
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
              <div className="text-muted-foreground">Loading registration status...</div>
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
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Clinic Registration Status</h1>
              <p className="text-muted-foreground mt-1">Track your clinic registration progress</p>
            </div>

            {registrations.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Registrations Found</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't submitted any clinic registrations yet.
                  </p>
                  <Button onClick={() => navigate("/clinics/register")}>
                    Register Your Clinic
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {registrations.map((registration) => (
                  <Card key={registration.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-xl">{registration.clinic_name}</CardTitle>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(registration.status)}
                            {getStatusBadge(registration.status)}
                            <Badge variant="outline" className="capitalize">
                              {registration.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <p>Submitted: {format(new Date(registration.created_at), "MMM dd, yyyy")}</p>
                          {registration.updated_at !== registration.created_at && (
                            <p>Updated: {format(new Date(registration.updated_at), "MMM dd, yyyy")}</p>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Contact:</span>
                            <span>{registration.contact_person}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Email:</span>
                            <span>{registration.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Phone:</span>
                            <span>{registration.phone}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium">Location:</span>
                            <p>{registration.location}</p>
                          </div>
                          {registration.address && (
                            <div className="text-sm">
                              <span className="font-medium">Address:</span>
                              <p>{registration.address}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {registration.description && (
                        <div className="text-sm">
                          <span className="font-medium">Description:</span>
                          <p className="mt-1 text-muted-foreground">{registration.description}</p>
                        </div>
                      )}

                      <div className="border-t pt-4">
                        <div className="space-y-3">
                          <div className="text-sm">
                            <span className="font-medium">Status:</span>
                            <p className="mt-1">{getStatusMessage(registration.status)}</p>
                          </div>
                          
                          <div className="text-sm">
                            <span className="font-medium">Next Steps:</span>
                            <ul className="mt-1 list-disc list-inside space-y-1">
                              {getNextSteps(registration.status).map((step, index) => (
                                <li key={index} className="text-muted-foreground">{step}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {registration.status === 'rejected' && (
                        <div className="flex gap-3 pt-4">
                          <Button 
                            variant="outline"
                            onClick={() => navigate("/clinics/register")}
                          >
                            Submit New Registration
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ClinicRegistrationStatus;
