import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Lock, ArrowLeft, Shield, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedTranslation } from '@/hooks/use-translation';
import { useAuth } from '@/hooks/useAuth';

const ResetPassword = () => {
  const { getTranslation } = useEnhancedTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updatePassword, isUpdatingPassword, updatePasswordError } = useAuth();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !email) {
      toast({
        title: getTranslation('reset_password.error.title', 'Invalid Link'),
        description: getTranslation('reset_password.error.description', 'The reset link is invalid or expired.'),
        variant: 'destructive',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({
        title: getTranslation('reset_password.error.title', 'Passwords Do Not Match'),
        description: getTranslation('reset_password.error.description', 'Please make sure both passwords match.'),
        variant: 'destructive',
      });
      return;
    }
    updatePassword({ token, newPassword }, {
      onSuccess: () => {
        setIsSubmitted(true);
        toast({
          title: getTranslation('reset_password.success.title', 'Password Reset Successful'),
          description: getTranslation('reset_password.success.description', 'You can now log in with your new password.'),
        });
        setTimeout(() => navigate('/login'), 2000);
      },
      onError: (error: any) => {
        toast({
          title: getTranslation('reset_password.error.title', 'Reset Failed'),
          description: error?.message || getTranslation('reset_password.error.description', 'There was a problem resetting your password.'),
          variant: 'destructive',
        });
      }
    });
  };

  const features = [
    {
      icon: Shield,
      title: getTranslation('reset_password.features.security.title', 'Secure Reset'),
      description: getTranslation('reset_password.features.security.description', 'Bank-level security for password changes')
    },
    {
      icon: CheckCircle,
      title: getTranslation('reset_password.features.success.title', 'Success Guaranteed'),
      description: getTranslation('reset_password.features.success.description', 'Reset your password and get back to trading')
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
                    {getTranslation('reset_password.success.title', 'Password Reset Successful')}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    {getTranslation('reset_password.success.description', 'You can now log in with your new password.')}
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Button asChild className="w-full" variant="outline">
                    <Link to="/login">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      {getTranslation('reset_password.success.back_to_login', 'Back to Login')}
                    </Link>
                  </Button>
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
          {/* Reset Password Form */}
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
                  {getTranslation('reset_password.title', 'Reset Your Password')}
                </CardTitle>
                <p className="text-muted-foreground">
                  {getTranslation('reset_password.subtitle', 'Enter your new password below.')}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">
                      {getTranslation('reset_password.form.new_password.label', 'New Password')}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      {getTranslation('reset_password.form.confirm_password.label', 'Confirm New Password')}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={isUpdatingPassword}>
                    {getTranslation('reset_password.form.submit', 'Reset Password')}
                  </Button>
                </form>
                <div className="text-center text-sm text-muted-foreground">
                  {getTranslation('reset_password.form.remember_password', 'Remember your password?')}{' '}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    {getTranslation('reset_password.form.back_to_login', 'Back to login')}
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
                {getTranslation('reset_password.features.badge', 'Password Reset')}
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {getTranslation('reset_password.features.title', 'Set a New Password')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-lg">
                {getTranslation('reset_password.features.description', 'Create a strong new password to secure your account.')}
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

export default ResetPassword;
