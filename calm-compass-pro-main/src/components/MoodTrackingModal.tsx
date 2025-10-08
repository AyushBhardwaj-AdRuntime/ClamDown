import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface MoodTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMood: {
    mood: string;
    emoji: string;
    label: string;
    color: string;
  };
  onSuccess: () => void;
}

const MoodTrackingModal = ({ isOpen, onClose, selectedMood, onSuccess }: MoodTrackingModalProps) => {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    const { error } = await supabase.from("mood_logs").insert({
      user_id: session.user.id,
      mood: selectedMood.mood,
      notes: notes.trim() || null,
    });

    if (error) {
      toast.error("Failed to log mood");
      console.error("Error logging mood:", error);
    } else {
      toast.success("Mood logged successfully!");
      setNotes("");
      onSuccess();
      onClose();
    }
    
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    setNotes("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Your Mood</DialogTitle>
          <DialogDescription>
            You selected: <span className={`font-medium ${selectedMood.color}`}>
              {selectedMood.emoji} {selectedMood.label}
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Write your feelings...</label>
            <Textarea
              placeholder="What's on your mind? Any thoughts or reflections..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoodTrackingModal;
