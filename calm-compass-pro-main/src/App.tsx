import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import MoodTracker from "./pages/MoodTracker";
import Clinics from "./pages/Clinics";
import ClinicDetails from "./pages/ClinicDetails";
import ClinicRegistration from "./pages/ClinicRegistration";
import ClinicRegistrationStatus from "./pages/ClinicRegistrationStatus";
import Appointments from "./pages/Appointments";
import Progress from "./pages/Progress";
import Emergency from "./pages/Emergency";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mood" element={<MoodTracker />} />
          <Route path="/clinics" element={<Clinics />} />
          <Route path="/clinics/register" element={<ClinicRegistration />} />
          <Route path="/clinics/status" element={<ClinicRegistrationStatus />} />
          <Route path="/clinics/:id" element={<ClinicDetails />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/emergency" element={<Emergency />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
