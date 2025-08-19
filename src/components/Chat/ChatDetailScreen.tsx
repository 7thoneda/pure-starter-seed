import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";

export type Message = {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
};

export interface ChatData {
  id: string;
  name: string;
  messages: Message[];
}

interface ChatDetailScreenProps {
  chat: ChatData;
  onBack: () => void;
  onSend: (text: string) => void;
}

export function ChatDetailScreen({ chat, onBack, onSend }: ChatDetailScreenProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-16 safe-area-top safe-area-bottom">
      <header className="px-4 py-3 flex items-center gap-3 border-b bg-card/95 backdrop-blur-md sticky top-16 z-10">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center text-xs font-semibold">
            {chat.name.slice(0,1)}
          </div>
          <div>
            <h2 className="font-semibold leading-tight">{chat.name}</h2>
            <p className="text-xs text-muted-foreground">online</p>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-3 space-y-3 overflow-y-auto">
        {chat.messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                m.sender === "me"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-muted text-foreground rounded-bl-md"
              }`}
            >
              <p>{m.text}</p>
              <p className="mt-1 text-xs opacity-70 text-right">{m.time}</p>
            </div>
          </div>
        ))}
      </main>

      <footer className="p-4 border-t bg-card/95 backdrop-blur-md sticky bottom-0">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="h-11 rounded-full flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <Button onClick={handleSend} size="icon" className="h-11 w-11 rounded-full">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </Button>
        </div>
      </footer>
    </div>
  );
}
