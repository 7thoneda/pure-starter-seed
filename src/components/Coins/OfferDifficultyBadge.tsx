import { Badge } from "@/components/ui/badge";
import { Flame, Zap, Clock } from "lucide-react";

interface OfferDifficultyBadgeProps {
  estimatedTime: string;
  reward: number;
}

export function OfferDifficultyBadge({ estimatedTime, reward }: OfferDifficultyBadgeProps) {
  const getDifficulty = () => {
    if (reward >= 300) return { level: 'Hard', icon: Flame, color: 'bg-red-100 text-red-700 border-red-200' };
    if (reward >= 100) return { level: 'Medium', icon: Zap, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
    return { level: 'Easy', icon: Clock, color: 'bg-green-100 text-green-700 border-green-200' };
  };

  const { level, icon: Icon, color } = getDifficulty();

  return (
    <Badge variant="outline" className={`text-xs font-poppins ${color} flex items-center gap-1`}>
      <Icon className="w-3 h-3" />
      {level}
    </Badge>
  );
}