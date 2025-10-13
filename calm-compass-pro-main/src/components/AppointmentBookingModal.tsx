import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { format, addDays, isAfter, isToday } from "date-fns";
import { CalendarIcon, CheckCircle, XCircle, Download } from "lucide-react";

interface Clinic {
  id: string;
  name: string;
  category: string;
  location: string;
  contact_info: string;
}

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  clinic: Clinic;
  onSuccess: () => void;
}

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM"
];

export const AppointmentBookingModal = ({ isOpen, onClose, clinic, onSuccess }: AppointmentBookingModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingReceipt, setBookingReceipt] = useState<any>(null);
  const [dateAvailability, setDateAvailability] = useState<{[key: string]: boolean}>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && clinic.id) {
      checkDateAvailability();
    }
  }, [isOpen, clinic.id]);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    } else {
      setAvailableSlots([]);
      setSelectedTimeSlot("");
    }
  }, [selectedDate, clinic.id]);

  const checkDateAvailability = async () => {
    // For demo purposes, let's make most dates available
    const availability: {[key: string]: boolean} = {};
    const today = new Date();
    
    // Make the next 60 days available for demo
    for (let i = 1; i < 61; i++) {
      const checkDate = addDays(today, i);
      const dateStr = format(checkDate, "yyyy-MM-dd");
      availability[dateStr] = true;
    }
    
    // Make some dates unavailable for demo variety
    const unavailableDates = [3, 5, 8, 12, 15, 20, 25, 30, 35, 40, 45, 50];
    unavailableDates.forEach(dayOffset => {
      const date = addDays(today, dayOffset);
      const dateStr = format(date, "yyyy-MM-dd");
      availability[dateStr] = false;
    });
    
    setDateAvailability(availability);
  };

  const fetchAvailableSlots = async () => {
    if (!selectedDate) return;

    setIsLoadingSlots(true);
    
    // For demo purposes, show all time slots as available
    // In a real implementation, you would query the appointments table
    setTimeout(() => {
      setAvailableSlots(timeSlots);
      setIsLoadingSlots(false);
    }, 500);
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      toast.error("Please select both date and time slot");
      return;
    }

    setIsSubmitting(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    const dateStr = format(selectedDate, "yyyy-MM-dd");

    try {
      // For demo purposes, simulate successful booking
      // In a real implementation, you would insert into the appointments table
      const receipt = {
        appointmentId: "APPT-" + Date.now(),
        clinicName: clinic.name,
        date: format(selectedDate, "EEEE, MMMM dd, yyyy"),
        time: selectedTimeSlot,
        location: clinic.location,
        contact: clinic.contact_info,
        bookingDate: format(new Date(), "MMM dd, yyyy 'at' h:mm a"),
        status: "Confirmed"
      };
      
      setBookingReceipt(receipt);
      setBookingSuccess(true);
      toast.success("Appointment booked successfully!");
      onSuccess();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to book appointment");
    }
    
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setSelectedDate(undefined);
    setSelectedTimeSlot("");
    setAvailableSlots([]);
    setBookingSuccess(false);
    setBookingReceipt(null);
    setDateAvailability({});
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const downloadReceipt = () => {
    if (!bookingReceipt) return;
    
    const receiptText = `
APPOINTMENT CONFIRMATION
========================

Appointment ID: ${bookingReceipt.appointmentId}
Clinic: ${bookingReceipt.clinicName}
Date: ${bookingReceipt.date}
Time: ${bookingReceipt.time}
Location: ${bookingReceipt.location}
Contact: ${bookingReceipt.contact}
Booking Date: ${bookingReceipt.bookingDate}
Status: ${bookingReceipt.status}

Thank you for choosing our mental health services!
    `.trim();
    
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointment-${bookingReceipt.appointmentId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {bookingSuccess ? "Appointment Confirmed!" : "Book Appointment"}
          </DialogTitle>
          <DialogDescription>
            {bookingSuccess 
              ? "Your appointment has been successfully booked" 
              : `Schedule an appointment with ${clinic.name}`
            }
          </DialogDescription>
        </DialogHeader>
        
        {bookingSuccess && bookingReceipt ? (
          <div className="space-y-6 py-4">
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <CardTitle className="text-green-800">Appointment Confirmed</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Appointment ID:</span>
                    <span className="font-mono text-xs">{bookingReceipt.appointmentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Clinic:</span>
                    <span>{bookingReceipt.clinicName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Date:</span>
                    <span>{bookingReceipt.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Time:</span>
                    <span>{bookingReceipt.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Location:</span>
                    <span>{bookingReceipt.location}</span>
                  </div>
                  {bookingReceipt.contact && (
                    <div className="flex justify-between">
                      <span className="font-medium">Contact:</span>
                      <span>{bookingReceipt.contact}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span className="text-green-600 font-medium">{bookingReceipt.status}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex gap-3">
              <Button 
                onClick={downloadReceipt}
                variant="outline"
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </Button>
              <Button 
                onClick={handleClose}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <label className="text-sm font-medium">Select Date</label>
              <div className="border rounded-lg p-3">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={isDateDisabled}
                  className="w-full"
                  modifiers={{
                    available: (date) => {
                      const dateStr = format(date, "yyyy-MM-dd");
                      return dateAvailability[dateStr] === true;
                    },
                    unavailable: (date) => {
                      const dateStr = format(date, "yyyy-MM-dd");
                      return dateAvailability[dateStr] === false;
                    }
                  }}
                  modifiersStyles={{
                    available: {
                      backgroundColor: "#dcfce7",
                      borderColor: "#16a34a",
                      color: "#166534"
                    },
                    unavailable: {
                      backgroundColor: "#fef2f2",
                      borderColor: "#dc2626",
                      color: "#991b1b"
                    }
                  }}
                />
              </div>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-100 border border-green-600 rounded"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-100 border border-red-600 rounded"></div>
                  <span>Fully Booked</span>
                </div>
              </div>
            </div>

            {selectedDate && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Select Time Slot</label>
                {isLoadingSlots ? (
                  <div className="text-sm text-muted-foreground">Loading available slots...</div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No available slots for {format(selectedDate, "MMM dd, yyyy")}
                  </div>
                ) : (
                  <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}

            {selectedDate && selectedTimeSlot && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium">Appointment Summary</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Clinic:</strong> {clinic.name}</p>
                  <p><strong>Date:</strong> {format(selectedDate, "EEEE, MMMM dd, yyyy")}</p>
                  <p><strong>Time:</strong> {selectedTimeSlot}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {!bookingSuccess && (
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || !selectedDate || !selectedTimeSlot}
            >
              {isSubmitting ? "Booking..." : "Book Appointment"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentBookingModal;