# 🚀 Production Setup Guide

Your AjnabiCam app is **technically ready for production**! Follow this checklist to complete the final preparation.

## ✅ Security Hardening (COMPLETED)
- [x] Database function security settings updated
- [ ] **MANUAL STEP**: Configure OTP expiry in Supabase Dashboard
- [ ] **MANUAL STEP**: Enable password leak protection in Supabase Dashboard

### Remaining Security Steps (Manual Configuration)

#### 1. Configure OTP Expiry
- Go to [Supabase Auth Settings](https://supabase.com/dashboard/project/ahpsoolwxfcpczwvyfzc/auth/providers)
- Set OTP expiry to recommended 10 minutes or less
- This reduces security risk from long-lived OTP codes

#### 2. Enable Password Leak Protection
- Go to [Supabase Auth Settings](https://supabase.com/dashboard/project/ahpsoolwxfcpczwvyfzc/auth/providers)
- Enable "Leaked Password Protection"
- This prevents users from using commonly compromised passwords

## 📋 Production Configuration Checklist

### 1. Payment Configuration (5 mins)
- [ ] **Replace Razorpay test key with live key**
  - Current: `rzp_test_WQBAQbslF30m1w`
  - Update to: `rzp_live_[YOUR_LIVE_KEY]` in `src/config/payments.ts`
- [ ] **Update Razorpay secret key in Supabase**
  - Go to [Edge Functions Secrets](https://supabase.com/dashboard/project/ahpsoolwxfcpczwvyfzc/settings/functions)
  - Update `RAZORPAY_SECRET_KEY` with your live secret key

### 2. Supabase Auth Configuration (5 mins)
- [ ] **Set Site URL**
  - Go to [Auth URL Configuration](https://supabase.com/dashboard/project/ahpsoolwxfcpczwvyfzc/auth/url-configuration)
  - Set to your production domain (e.g., `https://yourdomain.com`)
- [ ] **Configure Redirect URLs**
  - Add your production domain as an allowed redirect URL
  - Keep preview URL for testing if needed

### 3. Branding & Content (10 mins)
- [ ] **Update company information** in `src/config/payments.ts`:
  - Company name
  - Description
  - Logo URL
- [ ] **Custom favicon/app icon**
  - Replace `/favicon.ico` with your branded icon
  - Update `index.html` if using different formats

### 4. Performance Optimization (Optional)
- [ ] **Image optimization**
  - Ensure all images are optimized for web
  - Consider WebP format for better compression
- [ ] **Test on various devices**
  - Mobile phones (iOS/Android)
  - Tablets
  - Desktop browsers

## 🧪 Final Testing Checklist (15 mins)

### Authentication Flow
- [ ] User registration works
- [ ] Email verification (if enabled)
- [ ] Login/logout functionality
- [ ] Password reset

### Payment Processing
- [ ] Coin package purchases
- [ ] Premium subscriptions
- [ ] Unlimited calls subscription
- [ ] Payment verification and coin/premium activation

### Core Features
- [ ] User matching system
- [ ] Video calling functionality
- [ ] Voice calling functionality
- [ ] Chat system
- [ ] Profile management

### Mobile Experience
- [ ] Responsive design on mobile
- [ ] Touch interactions work properly
- [ ] Video/audio permissions on mobile browsers

## 🔐 Security Notes

Your app already includes:
- ✅ Row Level Security (RLS) policies
- ✅ Secure authentication with Supabase
- ✅ Payment verification through edge functions
- ✅ API key protection (stored in Supabase secrets)
- ✅ CORS configuration for edge functions

## 🚀 Deployment

Once you complete this checklist:
1. Click the **Publish** button in Lovable
2. Your app will be live and production-ready!

## 📞 Support

If you encounter any issues during production setup:
- Check the [Supabase Documentation](https://supabase.com/docs)
- Review [Razorpay Integration Guide](https://razorpay.com/docs/)
- Test in staging environment before going live

---

**Current Status**: 🟡 Ready for final configuration steps
**Next Step**: Complete manual security configuration in Supabase Dashboard