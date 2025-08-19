interface LocationData {
  country_code: string;
  country_name: string;
  currency: string;
}

interface CurrencyConfig {
  code: string;
  symbol: string;
  country: string;
}

const CURRENCY_CONFIGS: Record<string, CurrencyConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    country: 'India'
  },
  USD: {
    code: 'USD', 
    symbol: '$',
    country: 'United States'
  }
};

const PRICING_CONFIG = {
  premium_monthly: {
    INR: 599,
    USD: 7.99
  },
  voice_call_cost: {
    INR: 20,
    USD: 0.25
  },
  coin_packages: {
    small: {
      INR: { amount: 199, coins: 1000 },
      USD: { amount: 2.99, coins: 1000 }
    },
    medium: {
      INR: { amount: 499, coins: 2500 },
      USD: { amount: 6.99, coins: 2500 }
    },
    large: {
      INR: { amount: 999, coins: 5500 },
      USD: { amount: 12.99, coins: 5500 }
    }
  }
};

class CurrencyService {
  private currentCurrency: string = 'USD';
  private isDetecting: boolean = false;

  async detectCurrency(): Promise<string> {
    if (this.isDetecting) {
      return this.currentCurrency;
    }

    this.isDetecting = true;

    try {
      // Check if we have cached currency
      const cached = localStorage.getItem('app_currency');
      if (cached && CURRENCY_CONFIGS[cached]) {
        this.currentCurrency = cached;
        this.isDetecting = false;
        return cached;
      }

      // Use ipapi.co free tier (1000 requests/month)
      const response = await fetch('https://ipapi.co/json/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }

      const data: LocationData = await response.json();
      
      // Determine currency based on country
      let detectedCurrency = 'USD'; // Default fallback
      
      if (data.country_code === 'IN') {
        detectedCurrency = 'INR';
      } else {
        detectedCurrency = 'USD';
      }

      // Cache the detected currency
      localStorage.setItem('app_currency', detectedCurrency);
      this.currentCurrency = detectedCurrency;

      console.log(`Currency detected: ${detectedCurrency} for country: ${data.country_name}`);
      
      this.isDetecting = false;
      return detectedCurrency;

    } catch (error) {
      console.error('Currency detection failed:', error);
      // Fallback to USD on error
      this.currentCurrency = 'USD';
      localStorage.setItem('app_currency', 'USD');
      this.isDetecting = false;
      return 'USD';
    }
  }

  getCurrentCurrency(): string {
    return this.currentCurrency;
  }

  getCurrencyConfig(currency?: string): CurrencyConfig {
    const curr = currency || this.currentCurrency;
    return CURRENCY_CONFIGS[curr] || CURRENCY_CONFIGS.USD;
  }

  formatPrice(amount: number, currency?: string): string {
    const curr = currency || this.currentCurrency;
    const config = this.getCurrencyConfig(curr);
    
    if (curr === 'INR') {
      return `${config.symbol}${amount}`;
    } else {
      return `${config.symbol}${amount.toFixed(2)}`;
    }
  }

  getPricing(item: keyof typeof PRICING_CONFIG, currency?: string): any {
    const curr = currency || this.currentCurrency;
    const itemPricing = PRICING_CONFIG[item];
    
    if (!itemPricing) {
      console.error(`No pricing config found for item: ${item}`);
      return item === 'coin_packages' ? PRICING_CONFIG.coin_packages : PRICING_CONFIG.premium_monthly.USD;
    }
    
    if (item === 'coin_packages') {
      // Return the entire coin_packages structure, not just currency-specific data
      return itemPricing;
    }
    
    const currencyPricing = (itemPricing as any)[curr as 'INR' | 'USD'];
    return currencyPricing || (itemPricing as any).USD;
  }

  setCurrency(currency: string) {
    if (CURRENCY_CONFIGS[currency]) {
      this.currentCurrency = currency;
      localStorage.setItem('app_currency', currency);
    }
  }

  // Get formatted pricing for UI display
  getFormattedPricing() {
    const currency = this.currentCurrency;
    const coinPackages = this.getPricing('coin_packages');
    
    // Get currency-specific packages
    const currencyPackages = (coinPackages as any)[currency as 'INR' | 'USD'] || (coinPackages as any).USD;
    
    if (!currencyPackages || !currencyPackages.small || !currencyPackages.medium || !currencyPackages.large) {
      console.error('Invalid coin packages data for currency:', currency, coinPackages);
      // Return fallback data with USD pricing
      const fallbackPackages = PRICING_CONFIG.coin_packages;
      return {
        premium_monthly: {
          price: this.getPricing('premium_monthly', currency),
          formatted: this.formatPrice(this.getPricing('premium_monthly', currency), currency)
        },
        voice_call: {
          price: this.getPricing('voice_call_cost', currency),
          formatted: this.formatPrice(this.getPricing('voice_call_cost', currency), currency)
        },
        coin_packages: {
          small: {
            amount: fallbackPackages.small.USD.amount,
            coins: fallbackPackages.small.USD.coins,
            formatted: this.formatPrice(fallbackPackages.small.USD.amount, currency)
          },
          medium: {
            amount: fallbackPackages.medium.USD.amount,
            coins: fallbackPackages.medium.USD.coins,
            formatted: this.formatPrice(fallbackPackages.medium.USD.amount, currency)
          },
          large: {
            amount: fallbackPackages.large.USD.amount,
            coins: fallbackPackages.large.USD.coins,
            formatted: this.formatPrice(fallbackPackages.large.USD.amount, currency)
          }
        }
      };
    }
    
    return {
      premium_monthly: {
        price: this.getPricing('premium_monthly', currency),
        formatted: this.formatPrice(this.getPricing('premium_monthly', currency), currency)
      },
      voice_call: {
        price: this.getPricing('voice_call_cost', currency),
        formatted: this.formatPrice(this.getPricing('voice_call_cost', currency), currency)
      },
      coin_packages: {
        small: {
          amount: currencyPackages.small.amount,
          coins: currencyPackages.small.coins,
          formatted: this.formatPrice(currencyPackages.small.amount, currency)
        },
        medium: {
          amount: currencyPackages.medium.amount,
          coins: currencyPackages.medium.coins,
          formatted: this.formatPrice(currencyPackages.medium.amount, currency)
        },
        large: {
          amount: currencyPackages.large.amount,
          coins: currencyPackages.large.coins,
          formatted: this.formatPrice(currencyPackages.large.amount, currency)
        }
      }
    };
  }
}

// Export singleton instance
export const currencyService = new CurrencyService();
export { PRICING_CONFIG, CURRENCY_CONFIGS };
export type { CurrencyConfig };