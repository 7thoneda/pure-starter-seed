import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/ui/language-selector';
import { AuthModal } from '@/components/Auth/AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X, Globe, User, LogOut } from 'lucide-react';

export function Header() {
  const { t } = useTranslation();
  const { user, signOut, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <header className="relative border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg"></div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('app.name')}
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-6">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
            </nav>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowLanguageSelector(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Globe className="w-4 h-4 mr-2" />
              Language
            </Button>
            
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.email?.split('@')[0]}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={signOut}
                  className="border-border/50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="border-border/50"
                onClick={() => setShowAuthModal(true)}
                disabled={loading}
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-4">
            <a href="#features" className="block text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="block text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#about" className="block text-muted-foreground hover:text-foreground transition-colors">About</a>
            {user ? (
              <Button variant="outline" className="w-full" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowAuthModal(true)}
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </nav>
        )}
      </div>
      
      <LanguageSelector 
        isOpen={showLanguageSelector} 
        onClose={() => setShowLanguageSelector(false)} 
      />
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </header>
  );
}