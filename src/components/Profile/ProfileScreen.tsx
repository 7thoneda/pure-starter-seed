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
  age?: number;
}

interface ProfileScreenProps {
  profile: UserProfile;
  onEdit?: () => void;
  onUpdateProfile?: (updatedProfile: UserProfile) => void;
  onBack?: () => void;
  onViewBlurredProfiles?: () => void;
}

export function ProfileScreen({ profile, onEdit, onUpdateProfile, onBack, onViewBlurredProfiles }: ProfileScreenProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 safe-area-top safe-area-bottom">
      {/* Modern Floating Header */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-black/20 backdrop-blur-xl px-6 py-4 pt-16">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {onBack && (
            <Button 
              onClick={onBack}
              variant="ghost"
              size="icon"
              className="rounded-full bg-black/30 hover:bg-black/50 shadow-lg border border-white/20 backdrop-blur-sm text-white hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="flex items-center gap-3">
            <Button
              onClick={onEdit}
              variant="ghost"
              size="icon"
              className="rounded-full bg-black/30 hover:bg-black/50 shadow-lg border border-white/20 backdrop-blur-sm text-white hover:text-white"
            >
              <Edit className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-black/30 hover:bg-black/50 shadow-lg border border-white/20 backdrop-blur-sm text-white hover:text-white"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tinder-style Full Screen Photo Gallery */}
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
              <div className="h-full bg-black relative overflow-hidden">
                <img 
                  src={photo} 
                  alt={`${username} photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Tinder-style gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                
                {/* Profile info overlay on first photo */}
                {index === 0 && (
                  <div className="absolute bottom-20 left-6 right-6 text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                      <span className="text-sm font-medium opacity-90">Recently Active</span>
                    </div>
                    <h1 className="text-5xl font-bold mb-2 font-poppins">
                      {username}
                    </h1>
                    <p className="text-2xl font-light mb-4 opacity-90">{age}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <MapPin className="w-4 h-4" />
                        <span>2 km away</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <Star className="w-4 h-4 fill-current text-yellow-400" />
                        <span>4.8</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Add Photo Card */}
          {photos.length < 6 && (
            <div className="w-full flex-shrink-0 snap-start h-full">
              <label className="h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-dashed border-white/30 cursor-pointer hover:border-white/50 transition-all duration-300 hover:bg-primary/10 group">
                <div className="text-center text-white">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Camera className="w-12 h-12" />
                  </div>
                  <p className="text-xl font-semibold font-poppins mb-2">Add Photo</p>
                  <p className="text-sm opacity-80 font-poppins">Show more of yourself</p>
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
        
        {/* Tinder-style Photo Indicators */}
        {photos.length > 1 && (
          <div className="absolute top-20 left-0 right-0 flex justify-center space-x-2 px-6">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => handlePhotoIndicatorClick(index)}
                className={`h-1 flex-1 max-w-16 rounded-full transition-all duration-300 ${
                  index === currentPhotoIndex 
                    ? 'bg-white shadow-lg' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Tinder-style Action Buttons */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-6">
          <Button
            size="icon"
            className="w-16 h-16 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-gray-800 shadow-2xl hover:scale-110 transition-all duration-300"
          >
            <MessageCircle className="w-8 h-8" />
          </Button>
          <Button
            size="icon"
            className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white shadow-2xl hover:scale-110 transition-all duration-300"
          >
            <Heart className="w-10 h-10 fill-current" />
          </Button>
          <Button
            size="icon"
            className="w-16 h-16 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-gray-800 shadow-2xl hover:scale-110 transition-all duration-300"
          >
            <Gift className="w-8 h-8" />
          </Button>
        </div>
      </div>

      <div className="px-6 pb-32 space-y-6 max-w-4xl mx-auto bg-white rounded-t-3xl -mt-8 relative z-10 pt-8">

        {/* Secret Admirers - Tinder-style */}
        {onViewBlurredProfiles && (
          <Card className="bg-gradient-to-r from-pink-50 to-red-50 border border-pink-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-7 h-7 text-white fill-current" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-poppins text-gray-800">3 Likes</h3>
                    <p className="text-sm text-gray-600 font-poppins">See who likes you</p>
                  </div>
                </div>
                <Button 
                  onClick={onViewBlurredProfiles}
                  className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-poppins rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  See Likes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* About Me - Tinder-style minimal */}
        <Card className="bg-white border-0 rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold font-poppins text-gray-800 mb-4">About {username}</h3>
            <p className="text-gray-700 leading-relaxed font-poppins text-lg">{bio}</p>
          </CardContent>
        </Card>

        {/* Interests - Tinder-style clean layout */}
        <Card className="bg-white border-0 rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold font-poppins text-gray-800 mb-4">Interests</h3>
            <div className="flex flex-wrap gap-3">
              {interests.map((interest, index) => (
                <Badge 
                  key={index}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 border-0 font-poppins px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Basic Info - Tinder-style simple cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white border-0 rounded-2xl shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <p className="text-lg font-bold font-poppins text-gray-800">2 km</p>
              <p className="text-sm text-gray-600 font-poppins">Distance</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-0 rounded-2xl shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="w-5 h-5 text-white fill-current" />
              </div>
              <p className="text-lg font-bold font-poppins text-gray-800">4.8</p>
              <p className="text-sm text-gray-600 font-poppins">Rating</p>
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