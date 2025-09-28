import { useMutation, useQuery } from '@tanstack/react-query';

// Types
interface EmailTemplate {
  name: string;
  description: string;
  requiredFields: string[];
  optionalFields: string[];
}

interface EmailResponse {
  message: string;
  data: {
    recipient?: string;
    type: string;
    [key: string]: any;
  };
}

interface PromotionalEmailData {
  to: string;
  userName: string;
  customData?: Record<string, any>;
}

interface WithdrawalEmailData {
  to: string;
  userName: string;
  transactionId: string;
  amount: number;
  currency: string;
  date: string;
  status: string;
}

interface DepositEmailData {
  to: string;
  userName: string;
  amount: number;
  currency: string;
  walletId: string;
  date: string;
}

interface PasswordAlertData {
  to: string;
  userName: string;
  ipAddress: string;
  timestamp: string;
  deviceInfo?: string;
}

interface ActivationEmailData {
  to: string;
  userName: string;
  activationKey: string;
}

interface CustomEmailData {
  to: string;
  subject: string;
  html: string;
  attachments?: any[];
}

interface BulkEmailRecipient {
  email: string;
  userName?: string;
}

interface BulkPromotionalData {
  recipients: BulkEmailRecipient[];
  customData?: Record<string, any>;
}

interface BulkEmailResponse {
  message: string;
  data: {
    total: number;
    sent: number;
    failed: number;
    results: Array<{ email: string; status: string }>;
    errors: Array<{ email: string; error: string }>;
  };
}

interface EmailTemplatesResponse {
  message: string;
  data: {
    templates: EmailTemplate[];
  };
}

// API base URL - adjust this to match your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => localStorage.getItem('authToken');

// API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const useEmail = () => {
  // Send promotional email mutation
  const sendPromotionalMutation = useMutation({
    mutationFn: async (data: PromotionalEmailData): Promise<EmailResponse> => {
      return apiRequest('/email/promotional', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  });

  // Send withdrawal notification mutation
  const sendWithdrawalNoticeMutation = useMutation({
    mutationFn: async (data: WithdrawalEmailData): Promise<EmailResponse> => {
      return apiRequest('/email/withdrawal-notice', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  });

  // Send deposit confirmation mutation
  const sendDepositNoticeMutation = useMutation({
    mutationFn: async (data: DepositEmailData): Promise<EmailResponse> => {
      return apiRequest('/email/deposit-notice', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  });

  // Send password change alert mutation
  const sendPasswordAlertMutation = useMutation({
    mutationFn: async (data: PasswordAlertData): Promise<EmailResponse> => {
      return apiRequest('/email/password-alert', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  });

  // Send activation email mutation
  const sendActivationNoticeMutation = useMutation({
    mutationFn: async (data: ActivationEmailData): Promise<EmailResponse> => {
      return apiRequest('/email/activation-notice', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  });

  // Send custom email mutation
  const sendCustomEmailMutation = useMutation({
    mutationFn: async (data: CustomEmailData): Promise<EmailResponse> => {
      return apiRequest('/email/custom', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  });

  // Send bulk promotional emails mutation
  const sendBulkPromotionalMutation = useMutation({
    mutationFn: async (data: BulkPromotionalData): Promise<BulkEmailResponse> => {
      return apiRequest('/email/bulk-promotional', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  });

  // Get email templates query
  const useEmailTemplates = () => {
    return useQuery({
      queryKey: ['emailTemplates'],
      queryFn: async (): Promise<EmailTemplatesResponse> => {
        return apiRequest('/email/templates');
      },
      enabled: !!getAuthToken(),
    });
  };

  return {
    // Mutations
    sendPromotional: sendPromotionalMutation.mutate,
    sendPromotionalAsync: sendPromotionalMutation.mutateAsync,
    isSendingPromotional: sendPromotionalMutation.isPending,

    sendWithdrawalNotice: sendWithdrawalNoticeMutation.mutate,
    sendWithdrawalNoticeAsync: sendWithdrawalNoticeMutation.mutateAsync,
    isSendingWithdrawalNotice: sendWithdrawalNoticeMutation.isPending,

    sendDepositNotice: sendDepositNoticeMutation.mutate,
    sendDepositNoticeAsync: sendDepositNoticeMutation.mutateAsync,
    isSendingDepositNotice: sendDepositNoticeMutation.isPending,

    sendPasswordAlert: sendPasswordAlertMutation.mutate,
    sendPasswordAlertAsync: sendPasswordAlertMutation.mutateAsync,
    isSendingPasswordAlert: sendPasswordAlertMutation.isPending,

    sendActivationNotice: sendActivationNoticeMutation.mutate,
    sendActivationNoticeAsync: sendActivationNoticeMutation.mutateAsync,
    isSendingActivationNotice: sendActivationNoticeMutation.isPending,

    sendCustomEmail: sendCustomEmailMutation.mutate,
    sendCustomEmailAsync: sendCustomEmailMutation.mutateAsync,
    isSendingCustomEmail: sendCustomEmailMutation.isPending,

    sendBulkPromotional: sendBulkPromotionalMutation.mutate,
    sendBulkPromotionalAsync: sendBulkPromotionalMutation.mutateAsync,
    isSendingBulkPromotional: sendBulkPromotionalMutation.isPending,

    // Queries
    useEmailTemplates,

    // Error states
    sendPromotionalError: sendPromotionalMutation.error,
    sendWithdrawalNoticeError: sendWithdrawalNoticeMutation.error,
    sendDepositNoticeError: sendDepositNoticeMutation.error,
    sendPasswordAlertError: sendPasswordAlertMutation.error,
    sendActivationNoticeError: sendActivationNoticeMutation.error,
    sendCustomEmailError: sendCustomEmailMutation.error,
    sendBulkPromotionalError: sendBulkPromotionalMutation.error,
  };
}; 