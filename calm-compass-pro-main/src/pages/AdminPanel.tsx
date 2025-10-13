import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Building2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail, 
  Phone, 
  MapPin, 
  Globe,
  FileText,
  Users,
  Calendar,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

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
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  rejection_reason?: string;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<ClinicRegistration[]>([]);
  const [selectedRegistration, setSelectedRegistration] = useState<ClinicRegistration | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock admin email - in production, you'd check against an admin users table
  const ADMIN_EMAIL = "admin@mindcare.com";

  useEffect(() => {
    checkAdminAccess();
    fetchRegistrations();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    // For demo purposes, allow access for any authenticated user
    // In production, you'd check if the user is an admin
    if (session.user.email !== ADMIN_EMAIL) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/dashboard");
      return;
    }
  };

  const fetchRegistrations = async () => {
    try {
      // Mock data - in production, you'd fetch from clinic_registrations table
      const mockRegistrations: ClinicRegistration[] = [
        {
          id: "clinic_1234567890",
          clinic_name: "Sharda Clinic",
          contact_person: "Ayush",
          email: "dineshkumar13311334@gmail.com",
          phone: "09798291191",
          category: "depression",
          location: "Mumbai, Maharashtra",
          address: "123 Main Street, Mumbai",
          description: "Specialized in depression treatment and mental health support. We provide comprehensive mental health services including counseling, therapy, and medication management.",
          website: "https://shardaclinic.com",
          status: "pending",
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          updated_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: "clinic_2345678901",
          clinic_name: "Wellness Center Mumbai",
          contact_person: "Dr. Priya Sharma",
          email: "priya@wellnesscenter.com",
          phone: "09876543210",
          category: "anxiety",
          location: "Delhi, Delhi",
          address: "456 Health Plaza, Delhi",
          description: "Leading anxiety treatment center with experienced psychologists and psychiatrists.",
          website: "https://wellnesscenter.com",
          status: "pending",
          created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          updated_at: new Date(Date.now() - 172800000).toISOString()
        },
        {
          id: "clinic_3456789012",
          clinic_name: "Mental Health Hub",
          contact_person: "Dr. Rajesh Kumar",
          email: "rajesh@mentalhealthhub.com",
          phone: "08765432109",
          category: "general",
          location: "Bangalore, Karnataka",
          address: "789 Wellness Street, Bangalore",
          description: "Comprehensive mental health services for all age groups.",
          website: "https://mentalhealthhub.com",
          status: "approved",
          created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          updated_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];

      setRegistrations(mockRegistrations);
    } catch (error) {
      console.error("Error fetching registrations:", error);
      toast.error("Failed to load clinic registrations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (registrationId: string) => {
    setIsProcessing(true);
    try {
      // In production, you would update the database
      setRegistrations(prev => 
        prev.map(reg => 
          reg.id === registrationId 
            ? { ...reg, status: "approved", updated_at: new Date().toISOString() }
            : reg
        )
      );
      
      toast.success("Clinic registration approved successfully!");
      setIsReviewModalOpen(false);
      setSelectedRegistration(null);
    } catch (error) {
      toast.error("Failed to approve registration");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (registrationId: string) => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setIsProcessing(true);
    try {
      // In production, you would update the database
      setRegistrations(prev => 
        prev.map(reg => 
          reg.id === registrationId 
            ? { 
                ...reg, 
                status: "rejected", 
                rejection_reason: rejectionReason,
                updated_at: new Date().toISOString() 
              }
            : reg
        )
      );
      
      toast.success("Clinic registration rejected");
      setIsReviewModalOpen(false);
      setSelectedRegistration(null);
      setRejectionReason("");
    } catch (error) {
      toast.error("Failed to reject registration");
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const pendingRegistrations = registrations.filter(reg => reg.status === "pending");
  const approvedRegistrations = registrations.filter(reg => reg.status === "approved");
  const rejectedRegistrations = registrations.filter(reg => reg.status === "rejected");

  const stats = {
    total: registrations.length,
    pending: pendingRegistrations.length,
    approved: approvedRegistrations.length,
    rejected: rejectedRegistrations.length
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
                <h1 className="text-lg font-semibold">Admin Panel</h1>
              </div>
            </header>
            <div className="p-6 flex items-center justify-center">
              <div className="text-muted-foreground">Loading admin panel...</div>
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
              <h1 className="text-lg font-semibold">Admin Panel - Clinic Management</h1>
            </div>
          </header>
          
          <div className="p-6 max-w-7xl">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.total}</p>
                      <p className="text-sm text-muted-foreground">Total Registrations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.pending}</p>
                      <p className="text-sm text-muted-foreground">Pending Review</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.approved}</p>
                      <p className="text-sm text-muted-foreground">Approved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.rejected}</p>
                      <p className="text-sm text-muted-foreground">Rejected</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Registrations Tabs */}
            <Tabs defaultValue="pending" className="space-y-4">
              <TabsList>
                <TabsTrigger value="pending">
                  Pending Review ({pendingRegistrations.length})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Approved ({approvedRegistrations.length})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected ({rejectedRegistrations.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                {pendingRegistrations.length === 0 ? (
                  <Card>
                    <CardContent className="py-10 text-center">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Pending Registrations</h3>
                      <p className="text-muted-foreground">All clinic registrations have been reviewed.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {pendingRegistrations.map((registration) => (
                      <Card key={registration.id} className="hover:shadow-md transition-shadow border-yellow-200">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <CardTitle className="text-xl flex items-center gap-2">
                                <Building2 className="h-6 w-6" />
                                {registration.clinic_name}
                              </CardTitle>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(registration.status)}
                                {getStatusBadge(registration.status)}
                                <Badge variant="outline" className="capitalize">
                                  {registration.category}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right text-sm text-muted-foreground">
                              <p>Submitted: {format(new Date(registration.created_at), "MMM dd, yyyy 'at' h:mm a")}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Users className="h-4 w-4 text-muted-foreground" />
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
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Location:</span>
                                <span>{registration.location}</span>
                              </div>
                              {registration.website && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Globe className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">Website:</span>
                                  <a href={registration.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {registration.website}
                                  </a>
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

                          {registration.address && (
                            <div className="text-sm">
                              <span className="font-medium">Address:</span>
                              <p className="mt-1 text-muted-foreground">{registration.address}</p>
                            </div>
                          )}

                          <div className="flex gap-2 pt-4">
                            <Button
                              onClick={() => {
                                setSelectedRegistration(registration);
                                setIsReviewModalOpen(true);
                              }}
                              className="flex-1"
                            >
                              Review Application
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="approved" className="space-y-4">
                {approvedRegistrations.length === 0 ? (
                  <Card>
                    <CardContent className="py-10 text-center">
                      <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Approved Registrations</h3>
                      <p className="text-muted-foreground">No clinic registrations have been approved yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {approvedRegistrations.map((registration) => (
                      <Card key={registration.id} className="border-green-200 bg-green-50">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <CardTitle className="text-xl flex items-center gap-2">
                                <Building2 className="h-6 w-6" />
                                {registration.clinic_name}
                              </CardTitle>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(registration.status)}
                                {getStatusBadge(registration.status)}
                                <Badge variant="outline" className="capitalize">
                                  {registration.category}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right text-sm text-muted-foreground">
                              <p>Approved: {format(new Date(registration.updated_at), "MMM dd, yyyy")}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid gap-4 md:grid-cols-2 text-sm">
                            <div>
                              <span className="font-medium">Contact:</span> {registration.contact_person}
                            </div>
                            <div>
                              <span className="font-medium">Email:</span> {registration.email}
                            </div>
                            <div>
                              <span className="font-medium">Phone:</span> {registration.phone}
                            </div>
                            <div>
                              <span className="font-medium">Location:</span> {registration.location}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="rejected" className="space-y-4">
                {rejectedRegistrations.length === 0 ? (
                  <Card>
                    <CardContent className="py-10 text-center">
                      <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Rejected Registrations</h3>
                      <p className="text-muted-foreground">No clinic registrations have been rejected yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {rejectedRegistrations.map((registration) => (
                      <Card key={registration.id} className="border-red-200 bg-red-50">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <CardTitle className="text-xl flex items-center gap-2">
                                <Building2 className="h-6 w-6" />
                                {registration.clinic_name}
                              </CardTitle>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(registration.status)}
                                {getStatusBadge(registration.status)}
                                <Badge variant="outline" className="capitalize">
                                  {registration.category}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right text-sm text-muted-foreground">
                              <p>Rejected: {format(new Date(registration.updated_at), "MMM dd, yyyy")}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid gap-4 md:grid-cols-2 text-sm">
                            <div>
                              <span className="font-medium">Contact:</span> {registration.contact_person}
                            </div>
                            <div>
                              <span className="font-medium">Email:</span> {registration.email}
                            </div>
                            <div>
                              <span className="font-medium">Phone:</span> {registration.phone}
                            </div>
                            <div>
                              <span className="font-medium">Location:</span> {registration.location}
                            </div>
                          </div>
                          {registration.rejection_reason && (
                            <div className="text-sm">
                              <span className="font-medium">Rejection Reason:</span>
                              <p className="mt-1 text-muted-foreground">{registration.rejection_reason}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Review Modal */}
            <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Review Clinic Registration</DialogTitle>
                  <DialogDescription>
                    Review the clinic application and make a decision
                  </DialogDescription>
                </DialogHeader>
                
                {selectedRegistration && (
                  <div className="space-y-4 py-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="font-medium">Clinic Name</h4>
                        <p className="text-sm text-muted-foreground">{selectedRegistration.clinic_name}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Category</h4>
                        <p className="text-sm text-muted-foreground capitalize">{selectedRegistration.category}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Contact Person</h4>
                        <p className="text-sm text-muted-foreground">{selectedRegistration.contact_person}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Email</h4>
                        <p className="text-sm text-muted-foreground">{selectedRegistration.email}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Phone</h4>
                        <p className="text-sm text-muted-foreground">{selectedRegistration.phone}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Location</h4>
                        <p className="text-sm text-muted-foreground">{selectedRegistration.location}</p>
                      </div>
                    </div>
                    
                    {selectedRegistration.description && (
                      <div>
                        <h4 className="font-medium">Description</h4>
                        <p className="text-sm text-muted-foreground">{selectedRegistration.description}</p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="rejection-reason">Rejection Reason (if rejecting)</Label>
                      <Textarea
                        id="rejection-reason"
                        placeholder="Provide a clear reason for rejection..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={() => handleApprove(selectedRegistration.id)}
                        disabled={isProcessing}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(selectedRegistration.id)}
                        disabled={isProcessing}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminPanel;
