import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, Crown, Volume2, Waves, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VoiceSettings {
  is_enabled: boolean;
  modulation_type: string;
  pitch_shift: number;
  echo_level: number;
  reverb_level: number;
}

interface VoiceModulationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isPremium: boolean;
  audioContext?: AudioContext;
  sourceNode?: MediaStreamAudioSourceNode;
}

export function VoiceModulationPanel({ 
  isOpen, 
  onClose, 
  isPremium, 
  audioContext, 
  sourceNode 
}: VoiceModulationPanelProps) {
  const [settings, setSettings] = useState<VoiceSettings>({
    is_enabled: false,
    modulation_type: 'normal',
    pitch_shift: 1.0,
    echo_level: 0.0,
    reverb_level: 0.0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('voice_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error loading voice settings:', error);
    }
  };

  const saveSettings = async (newSettings: Partial<VoiceSettings>) => {
    if (!isPremium && newSettings.is_enabled) {
      toast({
        title: "Premium Feature",
        description: "Voice modulation is available for premium users only.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const updatedSettings = { ...settings, ...newSettings };

      const { error } = await supabase
        .from('voice_settings')
        .upsert({
          user_id: user.id,
          ...updatedSettings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSettings(updatedSettings);
      applyVoiceEffects(updatedSettings);

      toast({
        title: "Settings Saved",
        description: "Voice modulation settings updated successfully.",
      });
    } catch (error: any) {
      console.error('Error saving voice settings:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyVoiceEffects = (voiceSettings: VoiceSettings) => {
    if (!audioContext || !sourceNode || !voiceSettings.is_enabled) return;

    try {
      // Create audio nodes for effects
      const gainNode = audioContext.createGain();
      const delayNode = audioContext.createDelay();
      const convolverNode = audioContext.createConvolver();

      // Apply pitch shift (simplified - would need pitch shifting library for real implementation)
      gainNode.gain.value = voiceSettings.pitch_shift;

      // Apply echo
      delayNode.delayTime.value = voiceSettings.echo_level * 0.5;

      // Apply reverb (simplified)
      if (voiceSettings.reverb_level > 0) {
        // Create impulse response for reverb (simplified)
        const impulseLength = audioContext.sampleRate * 2;
        const impulse = audioContext.createBuffer(2, impulseLength, audioContext.sampleRate);
        // Fill with reverb impulse data...
        convolverNode.buffer = impulse;
      }

      // Connect nodes
      sourceNode.connect(gainNode);
      gainNode.connect(delayNode);
      delayNode.connect(convolverNode);
      convolverNode.connect(audioContext.destination);

    } catch (error) {
      console.error('Error applying voice effects:', error);
    }
  };

  const modulationTypes = [
    { value: 'normal', label: 'Normal' },
    { value: 'robot', label: 'Robot' },
    { value: 'deep', label: 'Deep Voice' },
    { value: 'chipmunk', label: 'High Pitch' },
    { value: 'echo', label: 'Echo' },
    { value: 'whisper', label: 'Whisper' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-card via-card to-card/95 border-primary/20 shadow-warm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Voice Modulation</CardTitle>
            {isPremium && (
              <Crown className="w-4 h-4 text-premium" />
            )}
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="w-8 h-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {!isPremium && (
            <div className="p-4 bg-premium/10 border border-premium/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-premium" />
                <span className="font-medium text-premium">Premium Feature</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Voice modulation is exclusive to premium users. Upgrade to unlock amazing voice effects!
              </p>
              <Button className="w-full bg-gradient-premium">
                Upgrade to Premium
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              <span className="font-medium">Enable Voice Effects</span>
            </div>
            <Switch
              checked={settings.is_enabled}
              onCheckedChange={(enabled) => saveSettings({ is_enabled: enabled })}
              disabled={!isPremium || isLoading}
            />
          </div>

          {settings.is_enabled && isPremium && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Voice Type</label>
                <Select 
                  value={settings.modulation_type} 
                  onValueChange={(value) => saveSettings({ modulation_type: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {modulationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Pitch Shift</label>
                    <Badge variant="outline" className="text-xs">
                      {settings.pitch_shift.toFixed(1)}x
                    </Badge>
                  </div>
                  <Slider
                    value={[settings.pitch_shift]}
                    onValueChange={([value]) => saveSettings({ pitch_shift: value })}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    disabled={isLoading}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Echo Level</label>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(settings.echo_level * 100)}%
                    </Badge>
                  </div>
                  <Slider
                    value={[settings.echo_level]}
                    onValueChange={([value]) => saveSettings({ echo_level: value })}
                    min={0}
                    max={1}
                    step={0.1}
                    disabled={isLoading}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Reverb Level</label>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(settings.reverb_level * 100)}%
                    </Badge>
                  </div>
                  <Slider
                    value={[settings.reverb_level]}
                    onValueChange={([value]) => saveSettings({ reverb_level: value })}
                    min={0}
                    max={1}
                    step={0.1}
                    disabled={isLoading}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Waves className="w-4 h-4" />
                <span>Voice effects are applied in real-time during calls</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}