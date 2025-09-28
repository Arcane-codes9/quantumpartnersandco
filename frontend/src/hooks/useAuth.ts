import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Types
interface User {
  _id: string;
  username: string;
  email: string;
  fullname: string;
  phone?: string;
  nationality?: string;
  isActivated: boolean;
  createdAt: string;
  updatedAt: string;
  isAdmin?: boolean;
}

interface AuthResponse {
  message: string;
  data: {
    user: User;
    token?: string;
  };
}

interface RegisterData {
  username: string;
  email: string;
  phone?: string;
  nationality?: string;
  fullname: string;
  password: string;
}

interface LoginData {
  identifier: string; // email or username
  password: string;
}

interface PasswordData {
  currentPassword?: string;
  newPassword: string;
  token?: string; // for password reset
}

interface UpdateInfoData {
  phone?: string;
  nationality?: string;
  fullname?: string;
}

// API base URL - adjust this to match your backend URL
const API_URL = import.meta.env.VITE_API_URL;

// Helper function to get auth token from localStorage or URL
export const getAuthToken = () => {
  const match = document.cookie.match(/(?:^|; )authToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
};

// Helper function to set auth token
const setAuthToken = (token: string) => {
  document.cookie = `authToken=${encodeURIComponent(token)}; path=/; max-age=604800`; // 7 days expiry
};

export const removeAuthToken = () => {
  document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

// API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}api${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

function setCookieUser(user: User) {
  document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400`; // 1 day expiry
}

export const useAuth = () => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData): Promise<AuthResponse> => {
      console.log('Registering user with data:', data);
      return apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      // Don't set token on register, user needs to activate account first
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: LoginData): Promise<AuthResponse> => {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (response.data.token) {
        setAuthToken(response.data.token);
        setUser(response.data.user);        
      }

      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  // Activate account mutation
  const activateMutation = useMutation({
    mutationFn: async (activationKey: string): Promise<AuthResponse> => {
      return apiRequest('/auth/activate', {
        method: 'POST',
        body: JSON.stringify({ activationKey }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  // Request activation key mutation
  const requestActivationKeyMutation = useMutation({
    mutationFn: async (email: string) => {
      return apiRequest('/auth/actkeyrequest', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      return apiRequest('/auth/forgotpwd', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },
  });

  // Change password mutation (with reset token)
  const changePasswordMutation = useMutation({
    mutationFn: async (data: { token: string; newPassword: string }) => {
      return apiRequest('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  });

  // Update password mutation (handles both reset and authenticated session)
  const updatePasswordMutation = useMutation({
    mutationFn: async (data: PasswordData) => {
      if (data.token) {
        // Password reset via token (from email)
        return apiRequest('/auth/changepwd', {
          method: 'POST',
          body: JSON.stringify({ token: data.token, newPassword: data.newPassword }),
        });
      } else {
        // Authenticated password change
        const body = {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        };
        return apiRequest('/auth/updatepwd', {
          method: 'POST',
          body: JSON.stringify(body),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  // Update user info mutation
  const updateInfoMutation = useMutation({
    mutationFn: async (data: UpdateInfoData): Promise<AuthResponse> => {
      return apiRequest('/auth/update-info', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      setUser(data.data.user);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  // Get current user query
  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: async (): Promise<User> => {
      const response = await apiRequest('/auth/me');
      setUser(response.data.user);
      return response.data.user;
    },
    enabled: !!getAuthToken(),
    retry: false,
  });

  // Check if user is authenticated
  const isAuthenticated = !!getAuthToken() && !!user;

  return {
    // State
    user: user || currentUser,
    isLoadingUser,
    isAuthenticated,

    // Mutations
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerMutation,

    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,

    activate: activateMutation.mutate,
    activateAsync: activateMutation.mutateAsync,
    isActivating: activateMutation.isPending,

    requestActivationKey: requestActivationKeyMutation.mutate,
    requestActivationKeyAsync: requestActivationKeyMutation.mutateAsync,
    isRequestingActivation: requestActivationKeyMutation.isPending,
    requestActivationKeyMutation,

    forgotPassword: forgotPasswordMutation.mutate,
    forgotPasswordAsync: forgotPasswordMutation.mutateAsync,
    isRequestingPasswordReset: forgotPasswordMutation.isPending,

    changePassword: changePasswordMutation.mutate,
    changePasswordAsync: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,

    updatePassword: updatePasswordMutation.mutate,
    updatePasswordAsync: updatePasswordMutation.mutateAsync,
    isUpdatingPassword: updatePasswordMutation.isPending,

    updateInfo: updateInfoMutation.mutate,
    updateInfoAsync: updateInfoMutation.mutateAsync,
    isUpdatingInfo: updateInfoMutation.isPending,

    // Error states
    registerError: registerMutation.error,
    loginError: loginMutation.error,
    activateError: activateMutation.error,
    requestActivationError: requestActivationKeyMutation.error,
    forgotPasswordError: forgotPasswordMutation.error,
    changePasswordError: changePasswordMutation.error,
    updatePasswordError: updatePasswordMutation.error,
    updateInfoError: updateInfoMutation.error,
  };
};
