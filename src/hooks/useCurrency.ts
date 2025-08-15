import { useState, useEffect } from 'react';
import { currencyService } from '@/services/currencyService';
import type { CurrencyConfig } from '@/services/currencyService';

export function useCurrency() {
  const [currency, setCurrency] = useState<string>('USD');
  const [isLoading, setIsLoading] = useState(true);
  const [currencyConfig, setCurrencyConfig] = useState<CurrencyConfig>(
    currencyService.getCurrencyConfig('USD')
  );

  useEffect(() => {
    const detectCurrency = async () => {
      setIsLoading(true);
      try {
        const detectedCurrency = await currencyService.detectCurrency();
        setCurrency(detectedCurrency);
        setCurrencyConfig(currencyService.getCurrencyConfig(detectedCurrency));
      } catch (error) {
        console.error('Failed to detect currency:', error);
        // Fallback to USD
        setCurrency('USD');
        setCurrencyConfig(currencyService.getCurrencyConfig('USD'));
      } finally {
        setIsLoading(false);
      }
    };

    detectCurrency();
  }, []);

  const formatPrice = (amount: number, targetCurrency?: string) => {
    return currencyService.formatPrice(amount, targetCurrency || currency);
  };

  const getPricing = (item: 'premium_monthly' | 'voice_call_cost' | 'coin_packages') => {
    return currencyService.getPricing(item, currency);
  };

  const getFormattedPricing = () => {
    return currencyService.getFormattedPricing();
  };

  const changeCurrency = (newCurrency: string) => {
    currencyService.setCurrency(newCurrency);
    setCurrency(newCurrency);
    setCurrencyConfig(currencyService.getCurrencyConfig(newCurrency));
  };

  return {
    currency,
    currencyConfig,
    isLoading,
    formatPrice,
    getPricing,
    getFormattedPricing,
    changeCurrency
  };
}