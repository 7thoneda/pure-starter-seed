/**
 * Security utility functions for the application
 */

/**
 * Sets additional security headers dynamically
 */
export const setSecurityHeaders = () => {
  // Add security-related meta tags dynamically if not already present
  const metaTags = [
    { 
      name: 'referrer', 
      content: 'strict-origin-when-cross-origin' 
    },
    { 
      httpEquiv: 'X-Content-Type-Options', 
      content: 'nosniff' 
    },
    { 
      httpEquiv: 'X-Frame-Options', 
      content: 'DENY' 
    },
    { 
      httpEquiv: 'X-XSS-Protection', 
      content: '1; mode=block' 
    }
  ];

  metaTags.forEach(({ name, httpEquiv, content }) => {
    const selector = name ? `meta[name="${name}"]` : `meta[http-equiv="${httpEquiv}"]`;
    if (!document.querySelector(selector)) {
      const meta = document.createElement('meta');
      if (name) meta.setAttribute('name', name);
      if (httpEquiv) meta.setAttribute('http-equiv', httpEquiv);
      meta.setAttribute('content', content);
      document.head.appendChild(meta);
    }
  });
};

/**
 * Content Security Policy configuration
 */
export const CSP_POLICY = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://js.razorpay.com", "https://*.supabase.co"],
  'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  'font-src': ["'self'", "https://fonts.gstatic.com"],
  'img-src': ["'self'", "data:", "https:", "blob:"],
  'media-src': ["'self'", "blob:", "https:"],
  'connect-src': ["'self'", "https://*.supabase.co", "wss://*.supabase.co", "https://api.razorpay.com"],
  'frame-src': ["'self'", "https://api.razorpay.com"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'upgrade-insecure-requests': []
};

/**
 * Generate CSP header string
 */
export const generateCSPHeader = (): string => {
  return Object.entries(CSP_POLICY)
    .map(([directive, values]) => `${directive} ${values.join(' ')}`)
    .join('; ');
};