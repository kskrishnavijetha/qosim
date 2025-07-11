import { useState } from 'react';
import { MessageSquare, Send, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { trackEvent } from '@/lib/analytics';

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!feedback.trim()) return;
    
    setIsSubmitting(true);
    try {
      // Track feedback submission
      trackEvent('feedback_submitted', { 
        rating: rating || undefined, 
        feedback: feedback.substring(0, 100) // First 100 chars for privacy
      });
      
      // Here you could also send to your backend or email service
      
      toast({
        title: "Feedback submitted!",
        description: "Thank you for helping us improve QOSim.",
      });
      
      setFeedback('');
      setRating(null);
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Failed to submit feedback",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating feedback button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 bg-quantum-glow hover:bg-quantum-glow/90 text-black shadow-lg"
          size="lg"
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      )}

      {/* Feedback panel */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-80 quantum-panel border-quantum-glow/30 shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-quantum-glow">
                What can we improve?
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Rating stars */}
            <div className="space-y-2">
              <label className="text-sm font-medium">How would you rate QOSim?</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= (rating || 0)
                          ? 'fill-quantum-glow text-quantum-glow'
                          : 'text-muted-foreground hover:text-quantum-glow/70'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback text */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Your feedback</label>
              <Textarea
                placeholder="Tell us what you think could be better..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="neon-border min-h-[80px] resize-none"
                maxLength={500}
              />
              <div className="text-xs text-muted-foreground text-right">
                {feedback.length}/500
              </div>
            </div>

            {/* Submit button */}
            <Button
              onClick={handleSubmit}
              disabled={!feedback.trim() || isSubmitting}
              className="w-full neon-border"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Feedback
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
}