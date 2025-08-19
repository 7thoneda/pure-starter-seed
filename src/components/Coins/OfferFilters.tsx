import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Play, UserPlus, CreditCard, BarChart3, Zap } from "lucide-react";

interface OfferFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function OfferFilters({ activeFilter, onFilterChange }: OfferFiltersProps) {
  const filters = [
    { id: 'all', label: 'All Offers', icon: BarChart3 },
    { id: 'quick', label: 'Quick Earn', icon: Zap },
    { id: 'app_install', label: 'Apps', icon: Download },
    { id: 'video', label: 'Videos', icon: Play },
    { id: 'signup', label: 'Sign Ups', icon: UserPlus },
    { id: 'purchase', label: 'Purchases', icon: CreditCard },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = activeFilter === filter.id;
        
        return (
          <Button
            key={filter.id}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(filter.id)}
            className={`
              flex items-center gap-1 whitespace-nowrap font-poppins text-xs transition-all duration-300
              ${isActive ? 'shadow-md scale-105' : 'hover:scale-105'}
            `}
          >
            <Icon className="w-3 h-3" />
            {filter.label}
          </Button>
        );
      })}
    </div>
  );
}