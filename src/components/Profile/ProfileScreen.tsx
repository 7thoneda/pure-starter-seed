import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageCropModal } from "@/components/Onboarding/ImageCropModal";
import { MapPin, Zap, Heart, Edit, Camera, ArrowLeft, Settings, Sparkles, Star, MessageCircle, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  username: string;
  photos: string[];
  bio: string;
  interests: string[];
  matchPreference: "anyone" | "men" | "women";
  gender: "male" | "female" | "other";
  age?: number;
}

interface ProfileScreenProps {
  profile: UserProfile;
  onEdit?: () => void;
  onUpdateProfile?: (updatedProfile: UserProfile) => void;
  onBack?: () => void;
  onViewBlurredProfiles?: () => void;
  onOpenSettings?: () => void;
}

export function ProfileScreen({ profile, onEdit, onUpdateProfile, onBack, onViewBlurredProfiles, onOpenSettings }: ProfileScreenProps) {
  const { username, photos, bio, interests, age = 20 } = profile;
  const [showCropModal, setShowCropModal] = useState(false);
  const [pendingImageUrl, setPendingImageUrl] = useState<string>("");
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && photos.length < 6) {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setPendingImageUrl(result);
          setShowCropModal(true);
        };
        reader.readAsDataURL(file);
      }
    } else if (photos.length >= 6) {
      toast({
        title: "Maximum photos reached",
        description: "You can upload a maximum of 6 photos.",
        variant: "destructive"
      });
    }
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    const updatedProfile = {
      ...profile,
      photos: [...photos, croppedImageUrl]
    };
    
    onUpdateProfile?.(updatedProfile);
    setPendingImageUrl("");
    setShowCropModal(false);
    
    toast({
      title: "Photo added successfully!",
      description: "Your new photo has been added to your profile.",
    });
  };

  const handleCropCancel = () => {
    setPendingImageUrl("");
    setShowCropModal(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex(prev => prev + 1);
      scrollToPhoto(currentPhotoIndex + 1);
    }
    
    if (isRightSwipe && currentPhotoIndex > 0) {
      setCurrentPhotoIndex(prev => prev - 1);
      scrollToPhoto(currentPhotoIndex - 1);
    }
  };

  const scrollToPhoto = (index: number) => {
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.scrollWidth;
      const clientWidth = scrollRef.current.clientWidth;
      const scrollPosition = (scrollWidth / photos.length) * index;
      scrollRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  };

  const handlePhotoIndicatorClick = (index: number) => {
    setCurrentPhotoIndex(index);
    scrollToPhoto(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Sophisticated Floating Header */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-xl px-4 py-3 pt-14 border-b border-border/20">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {onBack && (
            <Button 
              onClick={onBack}
              variant="ghost"
              size="icon"
              className="rounded-full bg-card/80 hover:bg-card shadow-elegant border border-border/30 backdrop-blur-sm text-foreground hover:text-foreground hover-scale"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            <Button
              onClick={onEdit}
              variant="ghost"
              size="icon"
              className="rounded-full bg-card/80 hover:bg-card shadow-elegant border border-border/30 backdrop-blur-sm text-foreground hover:text-foreground hover-scale"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              onClick={onOpenSettings}
              variant="ghost"
              size="icon"
              className="rounded-full bg-card/80 hover:bg-card shadow-elegant border border-border/30 backdrop-blur-sm text-foreground hover:text-foreground hover-scale"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Elegant Full Screen Photo Gallery */}
      <div className="relative h-screen">
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {photos.map((photo, index) => (
            <div key={index} className="w-full flex-shrink-0 snap-start relative h-full">
              <div className="h-full bg-card relative overflow-hidden">
                <img 
                  src={photo} 
                  alt={`${username} photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Sophisticated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/20" />
                
                {/* Profile info overlay on first photo */}
                {index === 0 && (
                  <div className="absolute bottom-20 left-6 right-6 text-foreground">
                    <div className="flex items-center gap-3 mb-6 animate-fade-in">
                      <div className="w-3 h-3 bg-accent rounded-full animate-pulse shadow-glow"></div>
                      <span className="text-sm font-medium text-muted-foreground">Recently Active</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-2 text-foreground animate-fade-in">
                      {username}
                    </h1>
                    <p className="text-xl font-light mb-6 text-muted-foreground animate-fade-in">{age}</p>
                    <div className="flex items-center gap-3 text-sm animate-fade-in">
                      <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border/20 shadow-elegant">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-foreground font-medium">2 km away</span>
                      </div>
                      <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border/20 shadow-elegant">
                        <Star className="w-4 h-4 fill-current text-accent" />
                        <span className="text-foreground font-medium">4.8</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Elegant Add Photo Card */}
          {photos.length < 6 && (
            <div className="w-full flex-shrink-0 snap-start h-full">
              <label className="h-full bg-gradient-subtle flex items-center justify-center border-2 border-dashed border-border/50 cursor-pointer hover:border-primary/50 transition-all duration-300 group">
                <div className="text-center text-foreground">
                  <div className="w-24 h-24 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-elegant border border-border/20">
                    <Camera className="w-10 h-10 text-primary" />
                  </div>
                  <p className="text-xl font-semibold mb-2">Add Photo</p>
                  <p className="text-sm text-muted-foreground">Show more of yourself</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>
        
        {/* Elegant Photo Indicators */}
        {photos.length > 1 && (
          <div className="absolute top-20 left-0 right-0 flex justify-center space-x-2 px-6">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => handlePhotoIndicatorClick(index)}
                className={`h-1 flex-1 max-w-16 rounded-full transition-all duration-300 ${
                  index === currentPhotoIndex 
                    ? 'bg-primary shadow-glow' 
                    : 'bg-muted-foreground/40 hover:bg-muted-foreground/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Sophisticated Action Buttons */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
          <Button
            size="icon"
            className="w-14 h-14 rounded-full bg-card/90 hover:bg-card text-foreground shadow-elegant hover-scale border border-border/20"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
          <Button
            size="icon"
            className="w-16 h-16 rounded-full bg-gradient-primary text-white shadow-2xl hover-scale"
          >
            <Heart className="w-8 h-8 fill-current" />
          </Button>
          <Button
            size="icon"
            className="w-14 h-14 rounded-full bg-card/90 hover:bg-card text-foreground shadow-elegant hover-scale border border-border/20"
          >
            <Gift className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <div className="px-4 pb-32 space-y-6 max-w-4xl mx-auto bg-card/95 backdrop-blur-lg rounded-t-3xl -mt-8 relative z-10 pt-8 border-t border-border/20">

        {/* Sophisticated Admirers Card */}
        {onViewBlurredProfiles && (
          <Card className="bg-gradient-subtle border border-border/30 rounded-2xl shadow-elegant hover:shadow-2xl transition-all duration-300 group overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-7 h-7 text-white fill-current" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">3 Likes</h3>
                    <p className="text-sm text-muted-foreground">See who likes you</p>
                  </div>
                </div>
                <Button 
                  onClick={onViewBlurredProfiles}
                  variant="gradient"
                  className="rounded-full px-6 py-2 shadow-glow hover-scale"
                >
                  See Likes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Elegant About Section */}
        <Card className="bg-card/80 backdrop-blur-sm border border-border/30 rounded-2xl shadow-elegant">
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              About {username}
            </h3>
            <p className="text-foreground/90 leading-relaxed text-base">{bio}</p>
          </CardContent>
        </Card>

        {/* Sophisticated Interests */}
        <Card className="bg-card/80 backdrop-blur-sm border border-border/30 rounded-2xl shadow-elegant">
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-primary" />
              Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="hover:bg-primary/20 hover:text-primary border border-border/30 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 hover-scale"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Modern Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card/80 backdrop-blur-sm border border-border/30 rounded-2xl shadow-elegant hover-scale">
            <CardContent className="p-5 text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3 shadow-glow">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <p className="text-lg font-bold text-foreground">2 km</p>
              <p className="text-sm text-muted-foreground">Distance</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur-sm border border-border/30 rounded-2xl shadow-elegant hover-scale">
            <CardContent className="p-5 text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3 shadow-glow">
                <Star className="w-6 h-6 text-white fill-current" />
              </div>
              <p className="text-lg font-bold text-foreground">4.8</p>
              <p className="text-sm text-muted-foreground">Rating</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Image Crop Modal */}
      <ImageCropModal
        isOpen={showCropModal}
        onClose={handleCropCancel}
        onCropComplete={handleCropComplete}
        imageUrl={pendingImageUrl}
      />
    </div>
  );
}