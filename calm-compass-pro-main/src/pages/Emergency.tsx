import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, AlertCircle, Mail } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Emergency = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();
    fetchEmergencyContacts();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchEmergencyContacts = async () => {
    const { data, error } = await supabase
      .from("emergency_contacts")
      .select("*")
      .order("type");

    if (!error && data) {
      setContacts(data);
    }
    setIsLoading(false);
  };

  const groupedContacts = {
    national: contacts.filter((c) => c.type === "national"),
    campus: contacts.filter((c) => c.type === "campus"),
    online: contacts.filter((c) => c.type === "online"),
  };

  const typeLabels = {
    national: "National Hotlines",
    campus: "Campus Services",
    online: "Online Support",
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">
          <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center gap-4 px-6">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold">Emergency Resources</h1>
            </div>
          </header>
          
          <div className="p-6 max-w-4xl">
            <Alert className="mb-6 border-destructive/50 bg-destructive/5">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertTitle className="text-destructive">Crisis Support Available 24/7</AlertTitle>
              <AlertDescription>
                If you're experiencing a mental health emergency, please reach out to any of the
                resources below. You're not alone, and help is available.
              </AlertDescription>
            </Alert>

            <Card className="mb-6 border-destructive/30">
              <CardHeader className="bg-destructive/5">
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Phone className="h-5 w-5" />
                  Get Immediate Help
                </CardTitle>
                <CardDescription>For urgent mental health support</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  If you or someone you know is in immediate danger, please call emergency services
                  or visit your nearest emergency room.
                </p>
                <Button variant="destructive" size="lg" className="w-full" asChild>
                  <a href="tel:112">Call Emergency Services (112)</a>
                </Button>
              </CardContent>
            </Card>

            {isLoading ? (
              <div className="text-center text-muted-foreground">Loading resources...</div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedContacts).map(([type, contactList]) =>
                  contactList.length > 0 ? (
                    <Card key={type}>
                      <CardHeader>
                        <CardTitle>{typeLabels[type as keyof typeof typeLabels]}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {contactList.map((contact) => (
                          <div
                            key={contact.id}
                            className="rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                          >
                            <h4 className="font-semibold mb-1">{contact.name}</h4>
                            {contact.description && (
                              <p className="text-sm text-muted-foreground mb-3">
                                {contact.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2">
                              {contact.phone.includes("@") ? (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={`mailto:${contact.phone}`}>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Email
                                  </a>
                                </Button>
                              ) : (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={`tel:${contact.phone}`}>
                                    <Phone className="mr-2 h-4 w-4" />
                                    {contact.phone}
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ) : null
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Emergency;
