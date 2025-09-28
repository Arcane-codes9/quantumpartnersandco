import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Mail, ArrowLeft, Shield, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedTranslation } from '@/hooks/use-translation';
import { useAuth } from '@/hooks/useAuth';

const ForgotPassword = () => {
  const { getTranslation } = useEnhancedTranslation();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPassword(email, {
      onSuccess: () => {
        setIsSubmitted(true);
        toast({
          title: getTranslation('forgot_password.success.title', 'Reset Link Sent'),
          description: getTranslation('forgot_password.success.description', 'We\'ve sent a password reset link to your email address.'),
        });
      },
      onError: (error: any) => {
        toast({
          title: getTranslation('forgot_password.error.title', 'Reset Failed'),
          description: error?.message || getTranslation('forgot_password.error.description', 'There was a problem sending the reset link.'),
          variant: 'destructive',
        });
      }
    });
  };

  const handleBackToLogin = () => {
    setIsSubmitted(false);
    setEmail('');
  };

  const features = [
    {
      icon: Shield,
      title: getTranslation('forgot_password.features.security.title', 'Secure Reset Process'),
      description: getTranslation('forgot_password.features.security.description', 'Bank-level security for password recovery')
    },
    {
      icon: CheckCircle,
      title: getTranslation('forgot_password.features.quick.title', 'Quick Recovery'),
      description: getTranslation('forgot_password.features.quick.description', 'Get back to trading in minutes, not hours')
    }
  ];

  if (isSubmitted) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="shadow-elegant">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {getTranslation('forgot_password.success.check_email.title', 'Check Your Email')}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    {getTranslation('forgot_password.success.check_email.description', 'We\'ve sent a password reset link to')} <strong>{email}</strong>
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">
                      {getTranslation('forgot_password.success.next_steps.title', 'What\'s next?')}
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• {getTranslation('forgot_password.success.next_steps.check_email', 'Check your email inbox')}</li>
                      <li>• {getTranslation('forgot_password.success.next_steps.click_link', 'Click the reset link in the email')}</li>
                      <li>• {getTranslation('forgot_password.success.next_steps.create_password', 'Create a new password')}</li>
                      <li>• {getTranslation('forgot_password.success.next_steps.sign_in', 'Sign in with your new password')}</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <Button onClick={handleBackToLogin} variant="outline" className="w-full">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      {getTranslation('forgot_password.success.back_to_login', 'Back to Login')}
                    </Button>
                    <div className="text-center text-sm text-muted-foreground">
                      {getTranslation('forgot_password.success.no_email', 'Didn\'t receive the email?')}{' '}
                      <button
                        onClick={handleBackToLogin}
                        className="text-primary hover:underline font-medium"
                      >
                        {getTranslation('forgot_password.success.try_again', 'Try again')}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Forgot Password Form */}
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
                  {getTranslation('forgot_password.title', 'Forgot Password?')}
                </CardTitle>
                <p className="text-muted-foreground">
                  {getTranslation('forgot_password.subtitle', 'No worries! Enter your email and we\'ll send you reset instructions.')}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      {getTranslation('forgot_password.form.email.label', 'Email Address')}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder={getTranslation('forgot_password.form.email.placeholder', 'Enter your email address')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    {getTranslation('forgot_password.form.submit', 'Send Reset Link')}
                    <Mail className="ml-2 h-4 w-4" />
                  </Button>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                  {getTranslation('forgot_password.form.remember_password', 'Remember your password?')}{' '}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    {getTranslation('forgot_password.form.back_to_login', 'Back to login')}
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
                {getTranslation('forgot_password.features.badge', 'Password Recovery')}
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {getTranslation('forgot_password.features.title', 'Get Back to Trading')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-lg">
                {getTranslation('forgot_password.features.description', 'We\'ll help you regain access to your account quickly and securely. Our password reset process is designed to get you back to trading in minutes.')}
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-muted/30 rounded-lg p-6"
            >
              <h4 className="font-semibold text-foreground mb-3">
                {getTranslation('forgot_password.security_tips.title', 'Security Tips')}
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• {getTranslation('forgot_password.security_tips.strong_password', 'Use a strong, unique password')}</li>
                <li>• {getTranslation('forgot_password.security_tips.two_factor', 'Enable two-factor authentication')}</li>
                <li>• {getTranslation('forgot_password.security_tips.credentials', 'Never share your login credentials')}</li>
                <li>• {getTranslation('forgot_password.security_tips.email_secure', 'Keep your email address secure')}</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 