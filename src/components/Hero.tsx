import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowRight, Crown } from 'lucide-react';
import { PremiumModal } from './PremiumModal';

export function Hero() {
  const { t } = useTranslation();
  const [showPremium, setShowPremium] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: `url(/placeholder.svg)` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
      
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-in slide-in-from-bottom-8 duration-1000">
            {t('app.tagline')}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 animate-in slide-in-from-bottom-8 duration-1000 delay-200">
            {t('home.peopleOnline')} - discover meaningful connections through video and voice chat
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-bottom-8 duration-1000 delay-300 justify-center">
            <Button size="lg" className="text-lg px-8 py-6 shadow-elegant hover:shadow-glow transition-all">
              {t('home.startMatching')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="premium" 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => setShowPremium(true)}
            >
              <Crown className="mr-2 h-5 w-5" />
              {t('premium.title')}
            </Button>
          </div>
        </div>
      </div>
      
      <PremiumModal isOpen={showPremium} onClose={() => setShowPremium(false)} />
    </section>
  );
}