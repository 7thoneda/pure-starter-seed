import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";

export type ChatPreview = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar?: string;
  unread?: number;
};

interface ChatListScreenProps {
  chats: ChatPreview[];
  onOpenChat: (chatId: string) => void;
  onBack?: () => void;
}

export function ChatListScreen({ chats, onOpenChat, onBack }: ChatListScreenProps) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => chats.filter(c => c.name.toLowerCase().includes(query.toLowerCase())),
    [chats, query]
  );

  return (
    <div className="min-h-screen bg-background safe-area-top">
      {/* Clean Header */}
      <div className="relative bg-gradient-to-br from-primary to-primary/80 pt-16 pb-8 px-6">
        <div className="flex items-center justify-between mb-6">
          {onBack && (
            <Button 
              onClick={onBack}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full w-10 h-10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold text-white">
              Messages
            </h1>
          </div>
          <div className="w-10" />
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
          <Input
            placeholder="Search conversations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 pl-10 pr-4 rounded-full bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 focus:border-white/50 backdrop-blur-sm"
          />
        </div>
      </div>

      <main className="pb-24 px-4 -mt-6 safe-area-bottom">
        <div className="max-w-md mx-auto">
          {/* Chat List */}
          <div className="space-y-2">
            {filtered.map((chat) => (
              <Card
                key={chat.id}
                className="bg-card border-0 cursor-pointer hover:bg-accent/50 transition-colors duration-200 rounded-2xl overflow-hidden"
                onClick={() => onOpenChat(chat.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {/* Profile Picture */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center text-sm font-semibold">
                        {chat.name.slice(0,1)}
                      </div>
                      {/* Online indicator */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                      
                      {/* Unread Badge */}
                      {chat.unread && (
                        <div className="absolute -top-1 -right-1">
                          <Badge className="bg-destructive hover:bg-destructive text-destructive-foreground border-0 text-xs min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                            {chat.unread}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Chat Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-base text-foreground truncate">
                          {chat.name}
                        </h3>
                        <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                          {chat.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Empty State */}
            {filtered.length === 0 && (
              <div className="text-center mt-16 px-8">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {query ? "No chats found" : "No conversations yet"}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {query 
                    ? "Try searching with a different name" 
                    : "Start a video call to begin your first conversation"
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}