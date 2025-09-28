import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Load English translations synchronously
const loadEnglishTranslations = () => {
  try {
    // For now, let's include the English translations directly
    const enTranslations = {
      "nav": {
        "home": "Home",
        "about": "About",
        "features": "Features",
        "contact": "Contact",
        "history": "History",
        "faq": "FAQ",
        "privacy": "Privacy Policy"
      },
      "language": {
        "select": "Language",
        "en": "English",
        "fr": "Français",
        "es": "Español",
        "de": "Deutsch"
      },
      "hero": {
        "title": "Secure Crypto Trading",
        "subtitle": "for the Future",
        "description": "QuantumPartnersandCo provides professional cryptocurrency trading services with advanced security, real-time analytics, and AI-powered trading bots.",
        "cta_primary": "Login",
        "cta_secondary": "Register"
      },
      "services": {
        "title": "Our Services",
        "crypto_trading": {
          "title": "Crypto Trading",
          "description": "Advanced trading platform with real-time market data"
        },
        "secure_wallets": {
          "title": "Secure Wallets",
          "description": "Cold storage solutions for maximum security"
        },
        "daily_insights": {
          "title": "Daily Insights",
          "description": "Professional market analysis and trading signals"
        }
      },
      "features": {
        "title": "Advanced Features",
        "real_time": {
          "title": "Real-time Trading",
          "description": "Execute trades instantly with our lightning-fast platform"
        },
        "analytics": {
          "title": "Advanced Analytics",
          "description": "Comprehensive market analysis tools and charts"
        },
        "ai_bots": {
          "title": "AI Trading Bots",
          "description": "Automated trading with intelligent algorithms"
        },
        "cold_storage": {
          "title": "Cold Wallet Storage",
          "description": "Maximum security for your digital assets"
        }
      },
      "about": {
        "title": "About QuantumPartnersandCo",
        "mission": "Our mission is to provide secure, professional cryptocurrency trading services to investors worldwide.",
        "vision": "To become the leading trusted platform for cryptocurrency trading and investment.",
        "values": {
          "security": "Security First",
          "transparency": "Full Transparency",
          "innovation": "Continuous Innovation"
        },
        "stats": {
          "clients": "Active Clients",
          "volume": "Trading Volume",
          "countries": "Countries Served",
          "uptime": "Platform Uptime"
        }
      },
      "contact": {
        "title": "Contact Us",
        "form": {
          "name": "Full Name",
          "email": "Email Address",
          "subject": "Subject",
          "message": "Message",
          "submit": "Send Message"
        },
        "info": {
          "address": "123 Financial District, New York, NY 10004",
          "phone": "+1 (555) 123-4567",
          "email": "support@QuantumPartnersandCo.com",
          "hours": "24/7 Support Available"
        }
      },
      "login": {
        "title": "Welcome Back",
        "subtitle": "Sign in to your QuantumPartnersandCo account",
        "success": {
          "title": "Login Successful",
          "description": "Welcome back to QuantumPartnersandCo!"
        },
        "form": {
          "email": {
            "label": "Email Address",
            "placeholder": "Enter your email"
          },
          "password": {
            "label": "Password",
            "placeholder": "Enter your password",
            "show": "Show password",
            "hide": "Hide password"
          },
          "remember": {
            "label": "Remember me"
          },
          "forgot_password": "Forgot password?",
          "submit": "Sign In",
          "or": "Or continue with",
          "no_account": "Don't have an account?",
          "sign_up": "Sign up"
        },
        "social": {
          "google": "Google",
          "twitter": "Twitter"
        },
        "features": {
          "badge": "Secure Trading Platform",
          "title": "Access Your Trading Dashboard",
          "description": "Sign in to access your portfolio, execute trades, and monitor your investments with our advanced trading platform.",
          "security": {
            "title": "Advanced Security",
            "description": "Multi-factor authentication and encryption"
          },
          "speed": {
            "title": "Lightning Fast",
            "description": "Real-time trading with instant execution"
          }
        }
      },
      "faq": {
        "title": "Frequently Asked Questions",
        "categories": {
          "accounts": "Account Management",
          "trading": "Trading",
          "security": "Security",
          "withdrawals": "Withdrawals"
        }
      },
      "footer": {
        "description": "Professional cryptocurrency trading platform with advanced security and analytics.",
        "links": {
          "company": "Company",
          "support": "Support",
          "legal": "Legal"
        },
        "copyright": "© 2024 QuantumPartnersandCo. All rights reserved."
      }
    };
    
    return enTranslations;
  } catch (error) {
    console.error('Failed to load English translations:', error);
    return {};
  }
};

// Load other translations dynamically
const loadOtherTranslations = async () => {
  const languages = ['fr', 'es', 'de'];
  
  for (const lang of languages) {
    try {
      const response = await fetch(`/locales/${lang}/translation.json`);
      const translations = await response.json();
      i18n.addResourceBundle(lang, 'translation', translations);
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error);
    }
  }
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    resources: {
      en: {
        translation: loadEnglishTranslations()
      },
      fr: {
        translation: {}
      },
      es: {
        translation: {}
      },
      de: {
        translation: {}
      }
    }
  });

// Load other translations after initialization
loadOtherTranslations();

export default i18n;