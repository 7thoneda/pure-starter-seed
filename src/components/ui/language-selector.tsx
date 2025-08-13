import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, Check } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
];

interface LanguageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LanguageSelector({ isOpen, onClose }: LanguageSelectorProps) {
  const { i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language);

  const handleLanguageChange = (langCode: string) => {
    setSelectedLang(langCode);
    i18n.changeLanguage(langCode);
    localStorage.setItem('preferred-language', langCode);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-sm bg-white rounded-3xl border-0 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-full">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Choose Language</h2>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                  selectedLang === language.code
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{language.nativeName}</div>
                    <div className="text-sm text-gray-600">{language.name}</div>
                  </div>
                  {selectedLang === language.code && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 rounded-2xl border-gray-200"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}