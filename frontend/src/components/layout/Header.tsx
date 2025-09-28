import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEnhancedTranslation } from '@/hooks/use-translation';

const Header = () => {
  const [loading, setLoading] = useState(true)
  const { getTranslation, i18n } = useEnhancedTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: getTranslation('nav.home', 'Home'), href: '/' },
    { name: getTranslation('nav.about', 'About'), href: '/about' },
    { name: getTranslation('nav.features', 'Features'), href: '/features' },
    { name: getTranslation('nav.contact', 'Contact'), href: '/contact' }
  ];

  const languages = [
    { code: 'en', name: getTranslation('language.en', 'English'), flag: '🇺🇸' },
    { code: 'fr', name: getTranslation('language.fr', 'Français'), flag: '🇫🇷' },
    { code: 'es', name: getTranslation('language.es', 'Español'), flag: '🇪🇸' },
    { code: 'de', name: getTranslation('language.de', 'Deutsch'), flag: '🇩🇪' },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    // Set initial language if not already set
    if (!i18n.language) {
      changeLanguage('en')
    }
    setLoading(false)
  }, [])

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                {getTranslation('header.logo', 'Em24Investment')}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === item.href
                  ? 'text-primary'
                  : 'text-muted-foreground'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Language Selector & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Globe className="h-4 w-4" />
                  {languages.find(lang => lang.code === i18n.language)?.flag}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border border-border">
                {languages.map((language) => (
                  <DropdownMenuItem
                    key={language.code}
                    onClick={() => changeLanguage(language.code)}
                    className="flex items-center gap-2 cursor-pointer hover:bg-muted"
                  >
                    <span>{language.flag}</span>
                    <span>{language.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="hero" size="sm" asChild>
              <Link to="/login">
                {getTranslation('hero.cta_primary', 'Login')}
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4 animate-fade-in">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors hover:text-primary ${location.pathname === item.href
                    ? 'text-primary bg-muted rounded-md'
                    : 'text-muted-foreground'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="pt-4 border-t border-border flex flex-col space-y-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 w-full justify-start">
                    <Globe className="h-4 w-4" />
                    {languages.find(lang => lang.code === i18n.language)?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="bg-background border border-border">
                  {languages.map((language) => (
                    <DropdownMenuItem
                      key={language.code}
                      onClick={() => changeLanguage(language.code)}
                      className="flex items-center gap-2 cursor-pointer hover:bg-muted"
                    >
                      <span>{language.flag}</span>
                      <span>{language.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="premium" size="sm" className="group" asChild>
                <Link to="/login">
                  {getTranslation('hero.cta_primary', 'Login')}
                </Link>
              </Button>
              <Button variant="hero" size="sm" className="w-full" asChild>
                <Link to="/register">
                  {getTranslation('hero.cta_secondary', 'Register')}
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;