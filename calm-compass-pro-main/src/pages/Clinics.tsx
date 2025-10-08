import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, ExternalLink, Building2 } from "lucide-react";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "anxiety", label: "Anxiety" },
  { value: "depression", label: "Depression" },
  { value: "stress", label: "Stress" },
  { value: "trauma", label: "Trauma" },
  { value: "addiction", label: "Addiction" },
  { value: "general", label: "General" },
];

const Clinics = () => {
  const navigate = useNavigate();
  const [clinics, setClinics] = useState<any[]>([]);
  const [filteredClinics, setFilteredClinics] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();
    fetchClinics();
  }, []);

  useEffect(() => {
    filterClinics();
  }, [searchQuery, selectedCategory, clinics]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchClinics = async () => {
    const { data, error } = await supabase
      .from("clinics")
      .select("*")
      .order("name");

    if (!error && data) {
      setClinics(data);
    }
    setIsLoading(false);
  };

  const filterClinics = () => {
    let filtered = clinics;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((clinic) => clinic.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (clinic) =>
          clinic.name.toLowerCase().includes(query) ||
          clinic.location.toLowerCase().includes(query)
      );
    }

    setFilteredClinics(filtered);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">
          <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center gap-4 px-6">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold">Find Clinics</h1>
            </div>
          </header>
          
          <div className="p-6">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Search for Mental Health Support</CardTitle>
                    <CardDescription>Find clinics and professionals near you</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate("/clinics/register")}
                      className="flex items-center gap-2"
                    >
                      <Building2 className="h-4 w-4" />
                      Register Clinic
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => navigate("/clinics/status")}
                      className="flex items-center gap-2"
                    >
                      Check Status
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Input
                    placeholder="Search by name or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="sm:w-[200px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {isLoading ? (
              <div className="text-center text-muted-foreground">Loading clinics...</div>
            ) : filteredClinics.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center text-muted-foreground">
                  No clinics found matching your criteria.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredClinics.map((clinic) => (
                  <Card key={clinic.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{clinic.name}</CardTitle>
                      <CardDescription className="capitalize">
                        {clinic.category}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="text-muted-foreground">{clinic.location}</span>
                      </div>
                      
                      {clinic.contact_info && (
                        <div className="flex items-start gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span className="text-muted-foreground">{clinic.contact_info}</span>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button
                          variant="default"
                          className="flex-1"
                          onClick={() => navigate(`/clinics/${clinic.id}`)}
                        >
                          View Details
                        </Button>
                        {clinic.map_link && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(clinic.map_link, "_blank")}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
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

export default Clinics;
