import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, X, Settings } from 'lucide-react';
import { LanguageSelector } from './language-selector';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  if (!isOpen && !showLanguageSelector) return null;

  if (showLanguageSelector) {
    return (
      <LanguageSelector 
        isOpen={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-sm bg-white rounded-3xl border-0 shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-full">
                <Settings className="w-5 h-5 text-gray-700" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">Settings</CardTitle>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <button
            onClick={() => setShowLanguageSelector(true)}
            className="w-full p-4 rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 text-left"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Language</div>
                <div className="text-sm text-gray-600">Change app language</div>
              </div>
            </div>
          </button>
        </CardContent>
      </Card>
    </div>
  );
}