import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, UserPlus, Users, Heart, Search, Star, MessageCircle } from "lucide-react";
import { useSimpleFriends } from "@/hooks/useSimpleFriends";
import { BannerAd } from "@/components/Ads/BannerAd";

interface FriendsScreenProps {
  onBack: () => void;
  onStartChat?: (userId: string) => void;
  onStartVideoCall?: (userId: string) => void;
}

export function FriendsScreen({ onBack, onStartChat, onStartVideoCall }: FriendsScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddFriend, setShowAddFriend] = useState(false);
  const { friends, loading, addFriend } = useSimpleFriends();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleAddFriend = async () => {
    if (searchQuery.trim()) {
      await addFriend(searchQuery);
      setShowAddFriend(false);
      setSearchQuery("");
    }
  };

  return (
    <div className="min-h-screen bg-background safe-area-top">
      {/* Header */}
      <div className="bg-gradient-primary pt-16 pb-8 px-4">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-dancing text-3xl font-bold text-white">
              Friends & Favorites
            </h1>
            <p className="text-white/90 font-poppins text-sm">Connect with people you know</p>
          </div>
          <Dialog open={showAddFriend} onOpenChange={setShowAddFriend}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-2"
              >
                <UserPlus className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Friend</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddFriend()}
                  />
                  <Button onClick={handleAddFriend}>
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <main className="pb-24 px-4 -mt-6 safe-area-bottom">
        <div className="max-w-lg mx-auto space-y-4">
          {/* Add Friend Button */}
          <Button className="w-full bg-gradient-primary text-white" onClick={() => setShowAddFriend(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Friend
          </Button>

          {/* Friends List */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading friends...</p>
            </div>
          ) : friends.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No friends yet</p>
                <p className="text-sm text-muted-foreground mt-1">Add friends to start connecting</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {friends.map((friend) => (
                <Card key={friend.id} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                              {friend.profile?.display_name?.charAt(0) || friend.profile?.username?.charAt(0) || 'F'}
                            </span>
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(friend.profile?.status || 'offline')}`}></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{friend.profile?.display_name || friend.profile?.username || 'Friend'}</p>
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          </div>
                          <p className="text-sm text-muted-foreground">@{friend.profile?.username}</p>
                          <p className="text-xs text-muted-foreground capitalize">{friend.profile?.status || 'offline'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="p-2"
                        >
                          <Heart className="w-4 h-4 text-red-500 fill-current" />
                        </Button>
                        {onStartChat && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onStartChat(friend.friend_id)}
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Banner Ad */}
      <BannerAd position="bottom" size="banner" />
    </div>
  );
}