import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Play, X } from 'lucide-react';
import { AdService } from '@/services/adService';
import { useToast } from '@/hooks/use-toast';

interface CallExtensionAdProps {
  currentDuration: number; // in seconds
  onTimeExtended: (additionalSeconds: number) => void;
  onClose: () => void;
  isVisible: boolean;
  extensionAmount?: number; // seconds to add
}

export function CallExtensionAd({
  currentDuration,
  onTimeExtended,
  onClose,
  isVisible,
  extensionAmount = 30
}: CallExtensionAdProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleWatchAd = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const adService = AdService.getInstance();
      const reward = await adService.showRewardedVideo('time_extension');
      
      if (reward) {
        onTimeExtended(reward.amount);
        toast({
          title: "⏰ Time Extended!",
          description: `Added ${reward.amount} seconds to your call!`,
        });
        onClose();
      }
    } catch (error) {
      console.error('Error watching ad for time extension:', error);
      toast({
        title: "Error",
        description: "Unable to load ad. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold font-poppins">Extend Your Call</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full mb-4">
              <Clock className="w-5 h-5 text-red-500" />
              <span className="text-red-700 font-medium">
                Current call time: {formatTime(currentDuration)}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Your call time is running low. Watch a short video to extend your call by {extensionAmount} seconds.
            </p>

            <div className="bg-green-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center gap-2 text-green-700">
                <Play className="w-5 h-5" />
                <span className="font-semibold">Watch Video = +{extensionAmount} seconds</span>
              </div>
              <p className="text-xs text-green-600 mt-1">Keep chatting without interruption!</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleWatchAd}
              disabled={isLoading}
              className="w-full h-12 font-poppins font-semibold rounded-xl"
              variant="gradient"
            >
              <Play className="w-5 h-5 mr-2" />
              {isLoading ? 'Loading Ad...' : `Watch Video (+${extensionAmount}s)`}
            </Button>
            
            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full h-10 font-poppins"
            >
              Continue Without Extension
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}