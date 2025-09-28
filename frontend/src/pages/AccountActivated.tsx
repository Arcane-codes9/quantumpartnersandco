import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, ArrowRight, Shield, Zap, TrendingUp, Users, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedTranslation } from '@/hooks/use-translation';
import { useAuth } from '@/hooks/useAuth';

const AccountActivated = () => {
  const { getTranslation } = useEnhancedTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { activate, isActivating, activateError } = useAuth();

  useEffect(() => {
    // Check if user came from activation process
    const activationKey = searchParams.get('key');
    const email = searchParams.get('email');

    if (!activationKey || !email) {
      // If no activation parameters, redirect to login
      navigate('/login');
      return;
    }

    // Call backend to activate account
    activate(activationKey, {
      onSuccess: () => {
        toast({
          title: getTranslation('account_activated.success.title', 'Account Activated Successfully!'),
          description: getTranslation('account_activated.success.description', 'Your account is now active and ready for trading.'),
          variant: 'default',
        });
        // Clear pending activation email from localStorage
        localStorage.removeItem('pendingActivationEmail');
      },
      onError: (error: any) => {
        toast({
          title: getTranslation('account_activated.error.title', 'Activation Failed'),
          description: error?.message || getTranslation('account_activated.error.description', 'There was a problem activating your account.'),
          variant: 'destructive',
        });
        // Optionally redirect to login or show retry
      }
    });
  }, [searchParams]);

  const features = [
    {
      icon: Shield,
      title: getTranslation('account_activated.features.security.title', 'Secure Trading'),
      description: getTranslation('account_activated.features.security.description', 'Bank-level security with multi-factor authentication')
    },
    {
      icon: Zap,
      title: getTranslation('account_activated.features.speed.title', 'Instant Execution'),
      description: getTranslation('account_activated.features.speed.description', 'Real-time trading with lightning-fast order execution')
    },
    {
      icon: TrendingUp,
      title: getTranslation('account_activated.features.analytics.title', 'Advanced Analytics'),
      description: getTranslation('account_activated.features.analytics.description', 'Professional tools and insights for better trading')
    },
    {
      icon: Users,
      title: getTranslation('account_activated.features.community.title', 'Trading Community'),
      description: getTranslation('account_activated.features.community.description', 'Connect with fellow traders and share insights')
    }
  ];

  const nextSteps = [
    getTranslation('account_activated.steps.verify', 'Complete your profile verification'),
    getTranslation('account_activated.steps.deposit', 'Make your first deposit'),
    getTranslation('account_activated.steps.explore', 'Explore trading instruments'),
    getTranslation('account_activated.steps.start', 'Start your first trade')
  ];

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Success Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-elegant max-w-md mx-auto">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  {getTranslation('account_activated.title', 'Account Activated Successfully!')}
                </CardTitle>
                <p className="text-muted-foreground">
                  {getTranslation('account_activated.subtitle', 'Welcome to Em24Investment! Your account is now active and ready for trading.')}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Award className="h-5 w-5 text-green-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-green-900 dark:text-green-100">
                          {getTranslation('account_activated.welcome.title', 'Welcome to the Platform!')}
                        </p>
                        <p className="text-green-700 dark:text-green-300 mt-1">
                          {getTranslation('account_activated.welcome.description', 'You now have full access to all trading features and tools.')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Button 
                      onClick={() => navigate('/login')}
                      className="w-full"
                      size="lg"
                    >
                      {getTranslation('account_activated.dashboard.button', 'Go to Sign In')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>                    
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    <p>
                      {getTranslation('account_activated.help.text', 'Need help getting started?')}{' '}
                      <button
                        onClick={() => navigate('/contact')}
                        className="text-primary hover:underline font-medium"
                      >
                        {getTranslation('account_activated.help.contact', 'Contact our support team')}
                      </button>
                    </p>
                  </div>
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
                {getTranslation('account_activated.features.badge', 'Your Account is Ready')}
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {getTranslation('account_activated.features.title', 'Start Your Trading Journey')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-lg">
                {getTranslation('account_activated.features.description', 'You now have access to all the professional trading tools and features.')}
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

            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-4">
                {getTranslation('account_activated.next_steps.title', 'Next Steps')}
              </h3>
              <div className="space-y-2">
                {nextSteps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-sm text-muted-foreground">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AccountActivated;
