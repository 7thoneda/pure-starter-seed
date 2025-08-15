import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { SplashScreen } from "@/components/Onboarding/SplashScreen";
import { AuthScreen } from "@/components/Auth/AuthScreen";
import { useAuth } from "@/hooks/useAuth";
import { OnboardingScreen } from "@/components/Onboarding/OnboardingScreen";
import { ProfileScreen } from "@/components/Profile/ProfileScreen";
import HomeScreen from "@/components/Home/HomeScreen";
import { VideoCallScreen } from "@/components/VideoChat/VideoCallScreen";
import { PostCallProfileScreen } from "@/components/VideoChat/PostCallProfileScreen";
import { MatchScreen } from "@/components/Match/MatchScreen";
import { ChatListScreen, ChatPreview } from "@/components/Chat/ChatListScreen";
import { ChatDetailScreen, ChatData, Message } from "@/components/Chat/ChatDetailScreen";
import { PremiumModal } from "@/components/Premium/PremiumModal";
import { CoinPurchaseModal } from "@/components/Coins/CoinPurchaseModal";
import { VoiceCallScreen } from "@/components/VoiceCall/VoiceCallScreen";
import { VoiceCallActiveScreen } from "@/components/VoiceCall/VoiceCallActiveScreen";
import { SpinWheelScreen } from "@/components/SpinWheel/SpinWheelScreen";
import { LoginStreakModal } from "@/components/Rewards/LoginStreakModal";
import { MysteryBoxModal } from "@/components/Rewards/MysteryBoxModal";
import { BlurredProfilesScreen } from "@/components/Profile/BlurredProfilesScreen";
import { BottomNav } from "@/components/Layout/BottomNav";
import { SettingsModal } from "@/components/ui/settings-modal";
import { useLoginStreak } from "@/hooks/useLoginStreak";
import { useMysteryBox } from "@/hooks/useMysteryBox";
import { useBlurredProfiles } from "@/hooks/useBlurredProfiles";
import { useToast } from "@/hooks/use-toast";
import { useMatching } from "@/hooks/useMatching";
import { CoinsScreen } from "@/components/Coins/CoinsScreen";
import { PremiumScreen } from "@/components/Premium/PremiumScreen";
import { EarnCoinsScreen } from "@/components/Coins/EarnCoinsScreen";
import { Video, Gem, Phone, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SocialScreen } from "@/components/Social/SocialScreen";
import { RoomsScreen } from "@/components/Rooms/RoomsScreen";
import { GroupCallScreen } from "@/components/Groups/GroupCallScreen";
import { useRoomInvites } from "@/hooks/useRoomInvites";
import { ReferralScreen } from "@/components/Referrals/ReferralScreen";
import { useReferrals } from "@/hooks/useReferrals";
import heroBackground from "/placeholder.svg";

interface UserProfile {
  username: string;
  photos: string[];
  bio: string;
  interests: string[];
  matchPreference: "anyone" | "men" | "women";
  gender: "male" | "female" | "other";
}

const Index = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
    
    // Listen for voice navigation event
    const handleVoiceNavigation = () => {
      setActiveTab("voice");
    };
    
    window.addEventListener('navigate-to-voice', handleVoiceNavigation);
    
    return () => {
      window.removeEventListener('navigate-to-voice', handleVoiceNavigation);
    };
  }, [i18n]);
  // ALL HOOKS MUST BE CALLED AT THE TOP - NO CONDITIONAL HOOKS
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [appState, setAppState] = useState<"splash" | "onboarding" | "main" | "spin-wheel" | "auth">("splash");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentScreen, setCurrentScreen] = useState<"home" | "call" | "voice-call" | "post-call" | "chat-detail" | "blurred-profiles" | "premium" | "earn-coins" | "social" | "room-call" | "referrals">("home");
  const [activeTab, setActiveTab] = useState("home");
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [hasUnlimitedCalls, setHasUnlimitedCalls] = useState(false);
  const [unlimitedCallsExpiry, setUnlimitedCallsExpiry] = useState<Date | null>(null);
  const [autoRenewEnabled, setAutoRenewEnabled] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [activeRoomType, setActiveRoomType] = useState<'video' | 'voice' | 'chat' | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [coinBalance, setCoinBalance] = useState(100);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  // Login streak and mystery box hooks
  const { streakData, claimReward } = useLoginStreak();
  const { profiles: blurredProfiles, unlockProfile } = useBlurredProfiles();
  const { 
    showMysteryBox, 
    currentReward, 
    triggerMysteryBox, 
    openMysteryBox, 
    closeMysteryBox 
  } = useMysteryBox();
  
  // Matching hook
  const matching = useMatching({
    userGender: userProfile?.gender || 'male',
    userId: 'user-' + Date.now(),
    isPremium
  });
  
  
  // Room invites hook
  useRoomInvites();
  
  // Referrals hook
  const { useReferralCode } = useReferrals();
  
  const { toast } = useToast();
  
  // Mock data - these can stay here as they're not hooks
  const mockCallPartnerProfile = {
    username: "Shafa Asadel",
    age: 20,
    photos: [
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
      "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg"
    ],
    bio: "Music enthusiast, always on the lookout for new tunes and ready to share playlists. Let's discover new sounds and enjoy the rhythm of life! ❤️",
    distance: "2 km away",
    commonInterests: 4,
    aboutMe: {
      gender: "Woman",
      religion: "Muslims",
      drinking: "Sometimes",
      smoking: "Never"
    },
    interests: ["🎵 Pop Punk", "☕ Coffee", "🥊 Boxing", "🎮 Fifa Mobile", "⚽ Real Madrid"]
  };
  
  const [chats, setChats] = useState<ChatPreview[]>([
    { id: "1", name: "Sarah", lastMessage: "Hey there! 👋", time: "2m", unread: 2 },
    { id: "2", name: "Mike", lastMessage: "Nice talking to you!", time: "1h" },
    { id: "3", name: "Emma", lastMessage: "See you later", time: "3h" },
    { id: "4", name: "Alex", lastMessage: "That was fun! 😄", time: "5h", unread: 1 },
    { id: "5", name: "Maria", lastMessage: "Thanks for the chat", time: "1d" },
    { id: "6", name: "David", lastMessage: "Great conversation!", time: "2d" },
  ]);
  
  const [chatData, setChatData] = useState<Record<string, ChatData>>({
    "1": {
      id: "1",
      name: "Sarah",
      messages: [
        { id: "1", sender: "them", text: "Hey there! 👋", time: "10:30" },
        { id: "2", sender: "me", text: "Hello! How are you?", time: "10:32" },
        { id: "3", sender: "them", text: "I'm doing great! Thanks for asking", time: "10:33" },
        { id: "4", sender: "me", text: "That's awesome! What do you like to do for fun?", time: "10:35" },
        { id: "5", sender: "them", text: "I love hiking and photography! The mountains here are beautiful 📸", time: "10:37" },
      ]
    },
    "2": {
      id: "2",
      name: "Mike",
      messages: [
        { id: "1", sender: "them", text: "Hi! How's your day going?", time: "9:15" },
        { id: "2", sender: "me", text: "Pretty good! Just relaxing. You?", time: "9:18" },
        { id: "3", sender: "them", text: "Same here! Working from home today", time: "9:20" },
        { id: "4", sender: "me", text: "Nice! What kind of work do you do?", time: "9:22" },
        { id: "5", sender: "them", text: "I'm a software developer. Really enjoy it!", time: "9:25" },
        { id: "6", sender: "me", text: "That's cool! I'm interested in tech too", time: "9:27" },
        { id: "7", sender: "them", text: "Nice talking to you!", time: "9:30" },
      ]
    },
    "3": {
      id: "3",
      name: "Emma",
      messages: [
        { id: "1", sender: "them", text: "Hello! Nice to meet you", time: "Yesterday" },
        { id: "2", sender: "me", text: "Hi Emma! Nice to meet you too", time: "Yesterday" },
        { id: "3", sender: "them", text: "See you later", time: "Yesterday" },
      ]
    },
    "4": {
      id: "4",
      name: "Alex",
      messages: [
        { id: "1", sender: "them", text: "Great video call earlier!", time: "5:20" },
        { id: "2", sender: "me", text: "Yeah, that was really fun!", time: "5:22" },
        { id: "3", sender: "them", text: "We should chat again soon", time: "5:25" },
        { id: "4", sender: "me", text: "Definitely! 😊", time: "5:27" },
        { id: "5", sender: "them", text: "That was fun! 😄", time: "5:30" },
      ]
    },
    "5": {
      id: "5",
      name: "Maria",
      messages: [
        { id: "1", sender: "me", text: "Hey Maria! How are you?", time: "Yesterday" },
        { id: "2", sender: "them", text: "Hi! I'm doing well, thanks", time: "Yesterday" },
        { id: "3", sender: "them", text: "Thanks for the chat", time: "Yesterday" },
      ]
    },
    "6": {
      id: "6",
      name: "David",
      messages: [
        { id: "1", sender: "them", text: "Hello! Nice meeting you in the video chat", time: "2 days ago" },
        { id: "2", sender: "me", text: "Hey David! Great meeting you too", time: "2 days ago" },
        { id: "3", sender: "them", text: "Great conversation!", time: "2 days ago" },
      ]
    }
  });

  // Listen for room join events from invites
  useEffect(() => {
    const handleJoinRoom = (event: any) => {
      const { roomId } = event.detail;
      setActiveRoomId(roomId);
      setActiveRoomType('video'); // Default to video
      setCurrentScreen('room-call');
      setActiveTab('rooms');
    };

    window.addEventListener('joinRoom', handleJoinRoom);
    return () => window.removeEventListener('joinRoom', handleJoinRoom);
  }, []);

  // Handle coin balance click to navigate to coins tab
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#coins') {
        setActiveTab('coins');
        window.location.hash = '';
      } else if (window.location.hash === '#recent-activity') {
        setCurrentScreen('blurred-profiles');
        window.location.hash = '';
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check on mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Check for referral code in URL on app load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode && isAuthenticated) {
      // Auto-apply referral code if user is authenticated
      useReferralCode(refCode).then((success) => {
        if (success) {
          // Clear URL parameter after successful application
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        }
      });
    }
  }, [isAuthenticated, useReferralCode]);

  // Event handlers
  const handleStartMatch = () => {
    if (userProfile) {
      // Show matching explanation toast
      const explanation = matching.getMatchingExplanation();
      toast({
        title: explanation.title,
        description: explanation.description,
      });
      
      // Start the matching process
      matching.startMatching(userProfile.matchPreference).then((result) => {
        if (result) {
          setCurrentScreen("call");
        }
      });
    }
  };

  const handleStartVoiceCall = () => {
    if (userProfile) {
      // Show matching explanation toast
      const explanation = matching.getMatchingExplanation();
      toast({
        title: explanation.title + " (Voice)",
        description: explanation.description,
      });
      
      // Start the matching process
      matching.startMatching(userProfile.matchPreference).then((result) => {
        if (result) {
          setCurrentScreen("voice-call");
        }
      });
    }
  };

  const handleBuyCoins = () => {
    setShowCoinModal(true);
  };

  const handleUpgradePremium = () => {
    setCurrentScreen("premium");
  };

  const handleCoinPurchase = (pack: string) => {
    // This is called after successful payment - no action needed here
  };

  const handleCoinPurchaseSuccess = (pack: string, coins: number) => {
    // Add coins to balance after successful payment
    setCoinBalance(prev => prev + coins);
    
    toast({
      title: "Coins Added Successfully! 💰",
      description: `${coins} coins have been credited to your account.`,
    });
  };

  const handleSubscription = (plan: string, autoRenew: boolean) => {
    if (plan === 'daily-unlimited') {
      setHasUnlimitedCalls(true);
      setAutoRenewEnabled(autoRenew);
      
      // Set expiry to 24 hours from now
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 24);
      setUnlimitedCallsExpiry(expiry);
      
      toast({
        title: "Unlimited Calls Activated! 🎉",
        description: `Payment successful! You now have unlimited voice calls for 24 hours. ${autoRenew ? 'Auto-renew is enabled.' : ''}`,
      });
    }
  };
  
  const handlePremiumSubscribe = (plan: string) => {
    // Only activate premium after successful payment
    setIsPremium(true);
    setCurrentScreen("home");
    
    toast({
      title: "Premium Activated! 👑",
      description: "Payment successful! You now have access to all premium features.",
    });
  };

  const handleStreakRewardClaim = (day: number, reward: { type: 'coins' | 'premium'; amount?: number }) => {
    claimReward(day);
    
    if (reward.type === 'coins' && reward.amount) {
      setCoinBalance(prev => prev + reward.amount!);
      toast({
        title: "Streak Reward Claimed!",
        description: `You earned ${reward.amount} coins for your ${day}-day streak!`,
      });
    } else if (reward.type === 'premium') {
      setIsPremium(true);
      toast({
        title: "Premium Boost Activated!",
        description: "You've unlocked premium features for reaching a 30-day streak!",
      });
    }
  };

  const handleMysteryBoxReward = () => {
    if (currentReward) {
      if (currentReward.type === 'coins' && currentReward.amount) {
        setCoinBalance(prev => prev + currentReward.amount!);
      }
      
      toast({
        title: "Mystery Box Opened! 🎉",
        description: currentReward.description,
      });
    }
  };

  const handleOpenSpinWheel = () => {
    setAppState("spin-wheel");
  };

  const handleSpinWheelBack = () => {
    setAppState("main");
  };

  const handleCoinsEarned = (amount: number) => {
    setCoinBalance(prev => prev + amount);
  };

  const handleSpendCoins = (amount: number) => {
    setCoinBalance(prev => Math.max(0, prev - amount));
    toast({
      title: "Coins spent",
      description: `${amount} coins used for voice call.`,
    });
  };

  // Show loading during auth check
  if (authLoading) {
    return <SplashScreen onComplete={() => {}} />;
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated && appState !== "splash" && appState !== "auth") {
    return <AuthScreen onSuccess={() => setAppState("main")} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Conditional rendering based on app state */}
      {appState === "splash" && (
        <SplashScreen onComplete={() => setAppState(isAuthenticated ? (userProfile ? "main" : "onboarding") : "auth")} />
      )}

      {appState === "auth" && (
        <AuthScreen onSuccess={() => setAppState(userProfile ? "main" : "onboarding")} />
      )}


      {(appState === "onboarding" || isEditingProfile) && (
        <OnboardingScreen
          initialProfile={isEditingProfile ? userProfile : undefined}
          isPremium={isPremium}
          onRequestUpgrade={() => setShowPremiumModal(true)}
          onComplete={(profile) => {
            setUserProfile(profile);
            if (isEditingProfile) {
              setIsEditingProfile(false);
            } else {
              setAppState("main");
            }
          }}
          onSkip={() => {
            if (isEditingProfile) {
              setIsEditingProfile(false);
            } else {
              // Create a minimal default profile for skipped onboarding
              const defaultProfile: UserProfile = {
                username: "User",
                photos: [],
                bio: "",
                interests: [],
                matchPreference: "anyone",
                gender: "male"
              };
              setUserProfile(defaultProfile);
              setAppState("main");
            }
          }}
        />
      )}

      {appState === "spin-wheel" && (
        <SpinWheelScreen
          onBack={handleSpinWheelBack}
          onCoinsEarned={handleCoinsEarned}
        />
      )}

      {appState === "main" && (
        <>
          {currentScreen === "call" && (
            <VideoCallScreen
              onEndCall={() => {
                setCurrentScreen("post-call");
                // Trigger mystery box chance after ending call
                setTimeout(() => {
                  triggerMysteryBox();
                }, 1000);
              }}
              onReconnect={() => {
                toast({
                  title: "Reconnecting...",
                  description: "Looking for your previous chat partner.",
                });
              }}
              onReport={() => {
                toast({
                  title: "Report submitted",
                  description: "Thank you for keeping our community safe.",
                });
              }}
              onBlock={() => {
                toast({
                  title: "User blocked",
                  description: "You won't be matched with this user again.",
                });
              }}
              coinBalance={coinBalance}
              onSpendCoins={(amount) => {
                setCoinBalance(prev => Math.max(0, prev - amount));
              }}
              userProfile={userProfile ? {
                ...userProfile,
                userId: 'user-' + Date.now()
              } : undefined}
              isPremium={isPremium}
            />
          )}

          {currentScreen === "voice-call" && (
            <VoiceCallActiveScreen
              onEndCall={() => {
                setCurrentScreen("post-call");
                // Trigger mystery box chance after ending call
                setTimeout(() => {
                  triggerMysteryBox();
                }, 1000);
              }}
              onReconnect={() => {
                toast({
                  title: "Reconnecting...",
                  description: "Looking for your previous chat partner.",
                });
              }}
              onReport={() => {
                toast({
                  title: "Report submitted",
                  description: "Thank you for keeping our community safe.",
                });
              }}
              onBlock={() => {
                toast({
                  title: "User blocked",
                  description: "You won't be matched with this user again.",
                });
              }}
              coinBalance={coinBalance}
              onSpendCoins={(amount) => {
                setCoinBalance(prev => Math.max(0, prev - amount));
              }}
            />
          )}

          {currentScreen === "post-call" && (
            <PostCallProfileScreen
              profile={mockCallPartnerProfile}
              onReject={() => {
                setCurrentScreen("home");
              }}
              onAccept={() => {
                setCurrentScreen("home");
                setActiveTab("chat");
              }}
            />
          )}

          {currentScreen === "chat-detail" && activeChatId && (() => {
            const chat = chatData[activeChatId];
            if (!chat) {
              setCurrentScreen("home");
              setActiveTab("chat");
              return null;
            }
            
            return (
              <ChatDetailScreen
                chat={chat}
                onBack={() => {
                  setCurrentScreen("home");
                  setActiveTab("chat");
                }}
                onSend={(text) => {
                  if (!activeChatId) return;
                  
                  const newMessage: Message = {
                    id: Date.now().toString(),
                    sender: "me",
                    text: text,
                    time: new Date().toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })
                  };
                  
                  // Update chat data
                  setChatData(prev => ({
                    ...prev,
                    [activeChatId]: {
                      ...prev[activeChatId],
                      messages: [...prev[activeChatId].messages, newMessage]
                    }
                  }));
                  
                  // Update chat preview
                  setChats(prev => prev.map(chat => 
                    chat.id === activeChatId 
                      ? { ...chat, lastMessage: text, time: "now" }
                      : chat
                  ));
                  
                  // Simulate a response after a delay (optional)
                  setTimeout(() => {
                    const responses = [
                      "That's interesting! 😊",
                      "Cool! Tell me more",
                      "Haha, nice! 😄", 
                      "I agree!",
                      "Sounds good!",
                      "Thanks for sharing!"
                    ];
                    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                    
                    const responseMessage: Message = {
                      id: (Date.now() + 1).toString(),
                      sender: "them",
                      text: randomResponse,
                      time: new Date().toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })
                    };
                    
                    setChatData(prev => ({
                      ...prev,
                      [activeChatId]: {
                        ...prev[activeChatId],
                        messages: [...prev[activeChatId].messages, responseMessage]
                      }
                    }));
                    
                    setChats(prev => prev.map(chat => 
                      chat.id === activeChatId 
                        ? { ...chat, lastMessage: randomResponse, time: "now" }
                        : chat
                    ));
                   }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
                }}
              />
            );
          })()}

          
          {currentScreen === "room-call" && activeRoomId && activeRoomType && (
            <GroupCallScreen
              roomId={activeRoomId}
              roomType={activeRoomType}
              onLeave={() => {
                setCurrentScreen("home");
                setActiveRoomId(null);
                setActiveRoomType(null);
                setActiveTab("rooms");
              }}
              onBack={() => {
                setCurrentScreen("home");
                setActiveRoomId(null);
                setActiveRoomType(null);
                setActiveTab("rooms");
              }}
            />
          )}
          
          {currentScreen === "blurred-profiles" && (
            <BlurredProfilesScreen
              profiles={blurredProfiles}
              coinBalance={coinBalance}
              onBack={() => {
                setCurrentScreen("home");
                setActiveTab("profile");
              }}
              onUnlockProfile={(profileId, cost) => {
                unlockProfile(profileId);
                setCoinBalance(prev => prev - cost);
              }}
              onBuyCoins={handleBuyCoins}
            />
          )}

          {currentScreen === "premium" && (
            <PremiumScreen
              onBack={() => setCurrentScreen("home")}
              onSubscribe={handlePremiumSubscribe}
            />
          )}

          {currentScreen === "earn-coins" && (
            <EarnCoinsScreen
              onBack={() => {
                setCurrentScreen("home");
                setActiveTab("coins");
              }}
            />
          )}

          {currentScreen === "referrals" && (
            <ReferralScreen />
          )}
          {currentScreen === "home" && (
            <>
              {/* Hero Background */}
              <div 
                className="fixed inset-0 opacity-5 pointer-events-none"
                style={{
                  backgroundImage: `url(${heroBackground})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              
              {/* Main Content */}
              <div className="relative z-10">
                {activeTab === "home" && (
                  <HomeScreen
                    onStartMatch={handleStartMatch}
                    onBuyCoins={handleBuyCoins}
                    onUpgradePremium={handleUpgradePremium}
                    onOpenSpinWheel={handleOpenSpinWheel}
                    matchPreference={userProfile?.matchPreference || "anyone"}
                    onChangePreference={(pref) => {
                      if (userProfile) {
                        setUserProfile({...userProfile, matchPreference: pref});
                      }
                    }}
                    isPremium={isPremium}
                    hasUnlimitedCalls={hasUnlimitedCalls}
                    onRequestUpgrade={() => setShowPremiumModal(true)}
                    onOpenReferrals={() => setCurrentScreen("referrals")}
                  />
                )}
                
                {activeTab === "match" && userProfile && (
                  <MatchScreen
                    onStartMatch={handleStartMatch}
                    isPremium={isPremium}
                    matchPreference={userProfile.matchPreference}
                    onChangePreference={(pref) => {
                      setUserProfile({...userProfile, matchPreference: pref});
                    }}
                    onRequestUpgrade={() => setCurrentScreen("premium")}
                    onBuyCoins={handleBuyCoins}
                  />
                )}
                
                {activeTab === "voice" && userProfile && (
                  <VoiceCallScreen
                    onStartCall={handleStartVoiceCall}
                    isPremium={isPremium}
                    hasUnlimitedCalls={hasUnlimitedCalls}
                    coinBalance={coinBalance}
                    matchPreference={userProfile.matchPreference}
                    onChangePreference={(pref) => {
                      setUserProfile({...userProfile, matchPreference: pref});
                    }}
                    onRequestUpgrade={() => setCurrentScreen("premium")}
                    onBuyCoins={handleBuyCoins}
                    onSpendCoins={handleSpendCoins}
                  />
                )}
                
                {activeTab === "coins" && (
                  <CoinsScreen
                    coinBalance={coinBalance}
                    streakData={streakData}
                    hasUnlimitedCalls={hasUnlimitedCalls}
                    unlimitedCallsExpiry={unlimitedCallsExpiry}
                    autoRenewEnabled={autoRenewEnabled}
                    onBuyCoins={handleBuyCoins}
                    onOpenStreakModal={() => setShowStreakModal(true)}
                    onOpenSpinWheel={handleOpenSpinWheel}
                    onManageSubscription={() => {
                      toast({
                        title: "Subscription Management",
                        description: "You can cancel auto-renew anytime in your account settings.",
                      });
                    }}
                    onOpenEarnCoins={() => setCurrentScreen("earn-coins")}
                  />
                )}
                
                {activeTab === "rooms" && (
                  <RoomsScreen
                    onBack={() => setActiveTab("home")}
                    onJoinRoom={(roomId, roomType) => {
                      setActiveRoomId(roomId);
                      setActiveRoomType(roomType);
                      setCurrentScreen("room-call");
                    }}
                  />
                )}
                
                {activeTab === "friends" && (
                  <SocialScreen
                    onBack={() => setActiveTab("home")}
                    onStartChat={(userId) => {
                      toast({
                        title: "Chat Started",
                        description: "Opening chat with your friend",
                      });
                      setActiveTab("groups");
                    }}
                    onStartVideoCall={(userId) => {
                      setCurrentScreen("call");
                    }}
                  />
                )}
                
                {activeTab === "groups" && (
                  <ChatListScreen
                    chats={chats}
                    onOpenChat={(chatId) => {
                      setActiveChatId(chatId);
                      setCurrentScreen("chat-detail");
                    }}
                  />
                )}
                
                {activeTab === "profile" && userProfile && (
                  <ProfileScreen
                    profile={userProfile}
                    onEdit={() => setIsEditingProfile(true)}
                    onUpdateProfile={(updatedProfile) => setUserProfile(updatedProfile)}
                    onViewBlurredProfiles={() => setCurrentScreen("blurred-profiles")}
                    onOpenSettings={() => setShowSettingsModal(true)}
                  />
                )}
              </div>

              {/* Bottom Navigation */}
              <BottomNav 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
              />
            </>
          )}
        </>
      )}

      {/* Modals - These should always be rendered */}
      <CoinPurchaseModal
        isOpen={showCoinModal}
        onClose={() => setShowCoinModal(false)}
        onPurchase={handleCoinPurchaseSuccess}
        onSubscribe={handleSubscription}
        userInfo={{
          name: userProfile?.username,
          email: undefined, // Add email if available
          phone: undefined  // Add phone if available
        }}
      />
      
      <LoginStreakModal
        isOpen={showStreakModal}
        onClose={() => setShowStreakModal(false)}
        currentStreak={streakData.currentStreak}
        claimedDays={streakData.claimedDays}
        onClaimReward={handleStreakRewardClaim}
      />
      
      <MysteryBoxModal
        isOpen={showMysteryBox}
        onClose={() => {
          handleMysteryBoxReward();
          closeMysteryBox();
        }}
        onOpenBox={openMysteryBox}
        reward={currentReward}
      />
      
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </div>
  );
};

export default Index;