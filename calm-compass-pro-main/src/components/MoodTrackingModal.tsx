import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Bot, Sparkles } from "lucide-react";

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
  onAIGuidance?: () => void;
}

const MoodTrackingModal = ({ isOpen, onClose, selectedMood, onSuccess, onAIGuidance }: MoodTrackingModalProps) => {
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

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex gap-2 w-full sm:w-auto">
            {(selectedMood.mood === 'stressed' || selectedMood.mood === 'anxious' || selectedMood.mood === 'sad' || selectedMood.mood === 'angry') && onAIGuidance && (
              <Button 
                variant="outline" 
                onClick={() => {
                  onClose();
                  onAIGuidance();
                }}
                className="flex-1 sm:flex-none"
              >
                <Bot className="mr-2 h-4 w-4" />
                Get AI Help
              </Button>
            )}
            <Button variant="outline" onClick={handleCancel} disabled={isSubmitting} className="flex-1 sm:flex-none">
              Cancel
            </Button>
          </div>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoodTrackingModal;
