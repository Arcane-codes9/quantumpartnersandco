import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';


// Types
export interface Notification {
  _id: string;
  type: string;
  message: string;
  date: string;
  read: boolean;
  [key: string]: any;
}

interface User {
  _id: string;
  balance: string;
  username: string;
  email: string;
  fullname: string;
  phone?: string;
  nationality?: string;
  isActivated: boolean;
  createdAt: string;
  updatedAt: string;
  notifications?: Notification[];
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
const SITE_URL = import.meta.env.VITE_SITE_URL;

// Helper function to set auth token
const setAuthToken = (token: string) => {
  document.cookie = `authToken=${encodeURIComponent(token)}; path=/; max-age=604800`; // 7 days expiry
};

// Helper function to get auth token from cookies
const getAuthToken = () => {
  const urlAuthToken = new URLSearchParams(window.location.search).get('authToken');
  if (urlAuthToken) {
    setAuthToken(decodeURIComponent(urlAuthToken));
    return decodeURIComponent(urlAuthToken);
  }
  const match = document.cookie.match(/(?:^|; )authToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
};

// Helper function to set auth token from cookies
function setCookieUser(user: User) {
  document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400`; // 1 day expiry
}

// Helper function to remove auth token from cookies
const removeAuthToken = () => {
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

  const response = await fetch(`${API_URL}api/${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

function getCookieUser(): User | null {
  const match = document.cookie.match(/(?:^|; )user=([^;]*)/);
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

function clearCookieUser() {
  document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}


export const useAuth = () => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>();

  // Request activation key mutation
  const requestActivationKeyMutation = useMutation({
    mutationFn: async (email: string) => {
      return apiRequest('/auth/request-activation', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      return apiRequest('/auth/forgot-password', {
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

  // Update password mutation (authenticated)
  const updatePasswordMutation = useMutation({
    mutationFn: async (data: PasswordData) => {
      return apiRequest('auth/updatepwd', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  // Update user info mutation
  const updateInfoMutation = useMutation({
    mutationFn: async (data: UpdateInfoData): Promise<AuthResponse> => {
      return apiRequest('auth/updateinfo', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      setUser(data.data.user);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  // Delete a single notification by ID
  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`auth/notifications/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: (data) => {
      setUser(data.data.user);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  // Clear all notifications
  const clearNotificationsMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('auth/notifications/clear', {
        method: 'POST',
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
      const response = await apiRequest('auth/me');
      setUser(response.data.user);
      return response.data.user;
    },
    enabled: !!getAuthToken(),
    retry: false,
  });

  // Logout function
  const logout = () => {
    removeAuthToken();
    setUser(null);
    clearCookieUser();
    queryClient.clear();
    window.location.href = `${SITE_URL}login?authState=false`;
  };

  // Check if user is authenticated
  const isAuthenticated = !!getAuthToken() && !!user;

  return {
    // State
    user: user || currentUser,
    isLoadingUser,
    isAuthenticated,

    requestActivationKey: requestActivationKeyMutation.mutate,
    requestActivationKeyAsync: requestActivationKeyMutation.mutateAsync,
    isRequestingActivation: requestActivationKeyMutation.isPending,

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

    // Actions
    logout,
    deleteNotification: deleteNotificationMutation.mutate,
    deleteNotificationAsync: deleteNotificationMutation.mutateAsync,
    isDeletingNotification: deleteNotificationMutation.isPending,
    clearNotifications: clearNotificationsMutation.mutate,
    clearNotificationsAsync: clearNotificationsMutation.mutateAsync,
    isClearingNotifications: clearNotificationsMutation.isPending,

    // Error states
    requestActivationError: requestActivationKeyMutation.error,
    forgotPasswordError: forgotPasswordMutation.error,
    changePasswordError: changePasswordMutation.error,
    updatePasswordError: updatePasswordMutation.error,
    updateInfoError: updateInfoMutation.error,
    deleteNotificationError: deleteNotificationMutation.error,
    clearNotificationsError: clearNotificationsMutation.error,
  };
};