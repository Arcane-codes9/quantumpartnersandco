import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedTranslation } from '@/hooks/use-translation';
import { getAuthToken, removeAuthToken, useAuth } from '@/hooks/useAuth';
import { use } from 'i18next';

const Login = () => {
  const [searchParams] = useSearchParams();
  const authState = searchParams.get('authState');
  const { getTranslation } = useEnhancedTranslation();
  const { toast } = useToast();
  const { login, user, isLoggingIn, loginError, isAuthenticated } = useAuth();
  const [pageInit, setPageInit] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });

  useEffect(() => {
    if (pageInit === false) {
      // Redirect if already authenticated
      if (isAuthenticated === true && user?.isAdmin === false) {
        window.location.href = `${import.meta.env.VITE_CLIENT_URL}?authToken=${encodeURIComponent(getAuthToken())}`;
      }
      if (user?.isAdmin === true) {
        window.location.href = `${import.meta.env.VITE_ADMIN_URL}?authToken=${encodeURIComponent(getAuthToken())}`;
      }
    }
    setPageInit(false);
  }, [isAuthenticated, pageInit, user]);

  // Handle login errors
  useEffect(() => {
    if (loginError) {
      toast({
        title: getTranslation('login.error.title', 'Login Failed'),
        description: loginError.message || getTranslation('login.error.description', 'Invalid credentials. Please try again.'),
        variant: 'destructive',
      });
    }
  }, [loginError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast({
        title: getTranslation('login.error.title', 'Login Failed'),
        description: getTranslation('login.error.missing_fields', 'Please fill in all required fields.'),
        variant: 'destructive',
      });
      return;
    }

    if (authState === 'false') {
      window.location.href = `${import.meta.env.VITE_SITE_URL}login`;
      return;
    }

    // Call the login function from useAuth hook
    login({
      identifier: formData.email, // Can be email or username
      password: formData.password
    });
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const features = [
    {
      icon: Shield,
      title: getTranslation('login.features.security.title', 'Advanced Security'),
      description: getTranslation('login.features.security.description', 'Multi-factor authentication and encryption')
    },
    {
      icon: Zap,
      title: getTranslation('login.features.speed.title', 'Lightning Fast'),
      description: getTranslation('login.features.speed.description', 'Real-time trading with instant execution')
    }
  ];

  if (authState === 'false') {
    removeAuthToken();
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-elegant max-w-md mx-auto">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground font-bold text-lg">E</span>
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  {getTranslation('login.title', 'Welcome Back')}
                </CardTitle>
                <p className="text-muted-foreground">
                  {getTranslation('login.subtitle', 'Sign in to your QuantumPartnersandCo account')}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      {getTranslation('login.form.email.label', 'Email Address')}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder={getTranslation('login.form.email.placeholder', 'Enter your email')}
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10"
                        required
                        disabled={isLoggingIn}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">
                      {getTranslation('login.form.password.label', 'Password')}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={getTranslation('login.form.password.placeholder', 'Enter your password')}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="pl-10 pr-10"
                        required
                        disabled={isLoggingIn}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground disabled:opacity-50"
                        aria-label={showPassword ?
                          getTranslation('login.form.password.hide', 'Hide password') :
                          getTranslation('login.form.password.show', 'Show password')
                        }
                        disabled={isLoggingIn}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={formData.rememberMe}
                        onCheckedChange={(checked) => handleInputChange('rememberMe', checked as boolean)}
                        disabled={isLoggingIn}
                      />
                      <Label htmlFor="remember" className="text-sm">
                        {getTranslation('login.form.remember.label', 'Remember me')}
                      </Label>
                    </div>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:underline disabled:opacity-50"
                    >
                      {getTranslation('login.form.forgot_password', 'Forgot password?')}
                    </Link>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoggingIn}>
                    {isLoggingIn ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {getTranslation('login.form.submitting', 'Signing In...')}
                      </>
                    ) : (
                      <>
                        {getTranslation('login.form.submit', 'Sign In')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      {getTranslation('login.form.or', 'Or continue with')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full" disabled={isLoggingIn}>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    {getTranslation('login.social.google', 'Google')}
                  </Button>
                  <Button variant="outline" className="w-full" disabled={isLoggingIn}>
                    <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                    {getTranslation('login.social.twitter', 'Twitter')}
                  </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  {getTranslation('login.form.no_account', 'Don\'t have an account?')} {' '}
                  <Link to="/register" className="text-primary hover:underline font-medium">
                    {getTranslation('login.form.sign_up', 'Sign up')}
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="text-center lg:text-left">
              <Badge variant="secondary" className="mb-4">
                {getTranslation('login.features.badge', 'Secure Trading Platform')}
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {getTranslation('login.features.title', 'Access Your Trading Dashboard')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-lg">
                {getTranslation('login.features.description', 'Sign in to access your portfolio, execute trades, and monitor your investments with our advanced trading platform.')}
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login; 