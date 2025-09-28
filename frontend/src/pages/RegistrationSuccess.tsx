import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Mail, ArrowRight, Clock, Shield, Zap, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedTranslation } from '@/hooks/use-translation';
import { useAuth } from '@/hooks/useAuth';

const RegistrationSuccess = () => {
  const { getTranslation } = useEnhancedTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { requestActivationKey, isRequestingActivation, requestActivationError, requestActivationKeyMutation } = useAuth();
  const [email, setEmail] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);

  // Get email from URL params or localStorage
  useEffect(() => {
    const emailFromParams = searchParams.get('email');
    const emailFromStorage = localStorage.getItem('pendingActivationEmail');
    
    if (emailFromParams) {
      setEmail(emailFromParams);
      localStorage.setItem('pendingActivationEmail', emailFromParams);
    } else if (emailFromStorage) {
      setEmail(emailFromStorage);
    } else {
      // If no email found, redirect to register
      navigate('/register');
    }
  }, [searchParams, navigate]);

  // Handle activation request errors
  useEffect(() => {
    if (requestActivationError) {
      toast({
        title: getTranslation('activation.error.title', 'Activation Request Failed'),
        description: requestActivationError.message || getTranslation('activation.error.description', 'Failed to send activation email. Please try again.'),
        variant: 'destructive',
      });
    }
  }, [requestActivationError]);

  const handleRequestActivation = () => {
    if (!email) {
      toast({
        title: getTranslation('activation.error.title', 'Activation Request Failed'),
        description: getTranslation('activation.error.no_email', 'Email address not found. Please register again.'),
        variant: 'destructive',
      });
      return;
    }

    setIsRequesting(true);
    requestActivationKeyMutation.mutate(email, {
      onSuccess: () => {
        toast({
          title: getTranslation('activation.success.title', 'Activation Email Sent'),
          description: getTranslation('activation.success.description', 'Please check your email and click the activation link.'),
          variant: 'default',
        });
        setIsRequesting(false);
      },
      onError: () => {
        setIsRequesting(false);
      }
    });
  };



  const benefits = [
    {
      icon: Shield,
      title: getTranslation('registration_success.benefits.security.title', 'Secure Trading'),
      description: getTranslation('registration_success.benefits.security.description', 'Bank-level security with multi-factor authentication')
    },
    {
      icon: Zap,
      title: getTranslation('registration_success.benefits.speed.title', 'Instant Execution'),
      description: getTranslation('registration_success.benefits.speed.description', 'Real-time trading with lightning-fast order execution')
    },
    {
      icon: TrendingUp,
      title: getTranslation('registration_success.benefits.analytics.title', 'Advanced Analytics'),
      description: getTranslation('registration_success.benefits.analytics.description', 'Professional tools and insights for better trading')
    }
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
                  {getTranslation('registration_success.title', 'Account Created Successfully!')}
                </CardTitle>
                <p className="text-muted-foreground">
                  {getTranslation('registration_success.subtitle', 'Your account has been created. Please activate it to start trading.')}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{email}</span>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-900 dark:text-blue-100">
                          {getTranslation('registration_success.activation.title', 'Activation Required')}
                        </p>
                        <p className="text-blue-700 dark:text-blue-300 mt-1">
                          {getTranslation('registration_success.activation.description', 'We\'ve sent an activation email to your inbox. Please check your email and click the activation link to complete your registration.')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Button 
                      onClick={handleRequestActivation}
                      disabled={isRequesting || isRequestingActivation}
                      className="w-full"
                      size="lg"
                    >
                      {isRequesting || isRequestingActivation ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {getTranslation('registration_success.resend.sending', 'Sending...')}
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          {getTranslation('registration_success.resend.button', 'Resend Activation Email')}
                        </>
                      )}
                    </Button>

                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/login')}
                      className="w-full"
                    >
                      {getTranslation('registration_success.login.button', 'Go to Login')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    <p>
                      {getTranslation('registration_success.help.text', 'Didn\'t receive the email?')}{' '}
                      <button
                        onClick={handleRequestActivation}
                        disabled={isRequesting || isRequestingActivation}
                        className="text-primary hover:underline font-medium disabled:opacity-50"
                      >
                        {getTranslation('registration_success.help.resend', 'Resend activation email')}
                      </button>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="text-center lg:text-left">
              <Badge variant="secondary" className="mb-4">
                {getTranslation('registration_success.benefits.badge', 'Welcome to Our Platform')}
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {getTranslation('registration_success.benefits.title', 'Your Trading Journey Starts Here')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-lg">
                {getTranslation('registration_success.benefits.description', 'Once activated, you\'ll have access to professional trading tools, real-time analytics, and secure cryptocurrency trading.')}
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <benefit.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
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

export default RegistrationSuccess;
