// Razorpay configuration - PRODUCTION READY
// Live Razorpay key configured for production
export const RAZORPAY_KEY_ID = "rzp_live_4Ud6wv8v2YJvbw"; // Live production key
// IMPORTANT: RAZORPAY_SECRET_KEY should NEVER be in frontend code
// It must be kept secure in Supabase secrets for payment verification

// Payment configuration - UPDATE FOR YOUR BRAND
export const PAYMENT_CONFIG = {
  currency: 'INR',
  company: {
    name: 'AjnabiCam', // Update with your company name
    description: 'Connect & Chat Platform', // Update with your description
    logo: '/favicon.ico', // Update with your logo URL
    theme: {
      color: 'hsl(var(--primary))' // Uses your design system primary color
    }
  }
};

// Coin packages
export const COIN_PACKAGES = {
  small: { coins: 30, price: 29, originalPrice: 49, id: 'coins_30' },
  medium: { coins: 100, price: 99, originalPrice: 149, id: 'coins_100' },
  large: { coins: 350, price: 299, originalPrice: 499, id: 'coins_350' }
};

// Premium plans with new Indian pricing
export const PREMIUM_PLANS = {
  day: { duration: '1 Day', price: 19, originalPrice: 29, id: 'premium_1d' },
  week: { duration: '1 Week', price: 99, originalPrice: 149, id: 'premium_7d' },
  month: { duration: '1 Month', price: 499, originalPrice: 699, id: 'premium_30d' },
  lifetime: { duration: 'Lifetime', price: 899, originalPrice: 1999, id: 'premium_lifetime' }
};

// Unlimited calls subscription
export const UNLIMITED_CALLS_PLAN = {
  price: 19,
  duration: '24 hours',
  id: 'unlimited_calls_24h'
};
