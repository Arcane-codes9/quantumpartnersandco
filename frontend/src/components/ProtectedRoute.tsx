import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireUnauth?: boolean;
  requirePendingActivation?: boolean;
  requireActivationSuccess?: boolean;
  redirectTo?: string;
}

const ProtectedRoute = ({
  children,
  requireAuth = false,
  requireUnauth = false,
  requirePendingActivation = false,
  requireActivationSuccess = false,
  redirectTo = '/login'
}: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is authenticated
    if (requireAuth && !isAuthenticated) {
      navigate(redirectTo, { replace: true });
      return;
    }

    // Check if user is not authenticated (for login/register pages)
    if (requireUnauth && isAuthenticated) {
      navigate('/dashboard', { replace: true });
      return;
    }

    // Check if user has pending activation (for registration success page)
    if (requirePendingActivation) {
      const pendingEmail = localStorage.getItem('pendingActivationEmail');
      if (!pendingEmail) {
        navigate('/register', { replace: true });
        return;
      }
    }

    // Check if user came from activation process (for account activated page)
    if (requireActivationSuccess) {
      const urlParams = new URLSearchParams(location.search);
      const activationKey = urlParams.get('key');
      const email = urlParams.get('email');
      
      if (!activationKey || !email) {
        navigate('/login', { replace: true });
        return;
      }
    }
  }, [isAuthenticated, user, navigate, location, requireAuth, requireUnauth, requirePendingActivation, requireActivationSuccess, redirectTo]);

  // Show loading or children based on conditions
  if (requireAuth && !isAuthenticated) {
    return null; // Will redirect
  }

  if (requireUnauth && isAuthenticated) {
    return null; // Will redirect
  }

  if (requirePendingActivation) {
    const pendingEmail = localStorage.getItem('pendingActivationEmail');
    if (!pendingEmail) {
      return null; // Will redirect
    }
  }

  if (requireActivationSuccess) {
    const urlParams = new URLSearchParams(location.search);
    const activationKey = urlParams.get('key');
    const email = urlParams.get('email');
    
    if (!activationKey || !email) {
      return null; // Will redirect
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
