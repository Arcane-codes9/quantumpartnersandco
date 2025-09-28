import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Types
export interface Trade {
  _id: string;
  userId: string;
  type: string;
  amount: number;
  price: number;
  invoice: string;
  fee: number
  transactionId: string;
  status: 'pending' | 'completed' | 'cancelled';
  totalValue: number;
  notes?: string;
  duration: string;
  fees: number;
  createdAt: string;
  updatedAt: string;
  maturity_date: string;
  profit: number,
  summary: { invoice: string, amount: number, profit: number, totalValue: number }
}

interface Transaction {
  _id: string;
  userId: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  method: string;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  walletAddress?: string;
  reference?: string;
  createdAt: string;
  updatedAt: string;
}

interface Notification {
  _id: string;
  type: string;
  message: string;
  isRead: boolean;
  date: string;
}

interface TradingStats {
  totalTrades: number;
  totalVolume: number;
  totalProfit: number;
  winRate: number;
  averageTradeSize: number;
}

interface TransactionStats {
  totalDeposits: number;
  totalWithdrawals: number;
  totalVolume: number;
  pendingTransactions: number;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface TradesResponse {
  message: string;
  data: {
    trades: Trade[];
    pagination: PaginationInfo;
    stats: TradingStats;
  };
}

interface ActivitiesResponse {
  message: string;
  data: {
    notifications: Notification[];
    recentTrades: Trade[];
    recentTransactions: Transaction[];
    transactionStats: TransactionStats;
    pagination: PaginationInfo;
  };
}

interface TradingStatsResponse {
  message: string;
  data: {
    trades: TradingStats;
    transactions: TransactionStats;
  };
}

// API base URL - adjust this to match your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  const match = document.cookie.match(/(?:^|; )authToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
};

// API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}api/${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const useTrading = () => {
  const queryClient = useQueryClient();

  // Initiate trade mutation (updated to match backend requirements)
  const initiateTradeMutation = useMutation({
    mutationFn: async (data: {
      type: string;
      amount: number;
      fee: number;
      duration: string;
      maturity_amount: number;
      maturity_date: string | Date;
      profit: number;
      date: string | Date;
      invoice: string;
      notes?: string;
    }) => {
      return apiRequest('trading/inittrade', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      queryClient.invalidateQueries({ queryKey: ['tradingStats'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });

  // Create deposit mutation
  const createDepositMutation = useMutation({
    mutationFn: async (data: {
      amount: number;
      method: string;
      currency?: string;
      walletAddress?: string;
      reference?: string;
    }) => {
      return apiRequest('trading/deposit', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['tradingStats'] });
    },
  });

  // Create withdrawal mutation
  const createWithdrawalMutation = useMutation({
    mutationFn: async (data: {
      amount: number;
      usdAmount: number;
      method: string;
      accountType?: string;
      currency?: string;
      walletAddress?: string;
      reference?: string;
    }) => {
      return apiRequest('trading/withdraw', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['tradingStats'] });
    },
  });

  // Mark notifications as read mutation
  const markNotificationsAsReadMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/trading/mark-notifications-read', {
        method: 'POST',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });

  // Get trades query
  const useTrades = (params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.type) searchParams.append('type', params.type);

    return useQuery({
      queryKey: ['trades', params],
      queryFn: async (): Promise<TradesResponse> => {
        const queryString = searchParams.toString();
        const endpoint = `trading/trades${queryString ? `?${queryString}` : ''}`;
        return apiRequest(endpoint);
      },
      enabled: !!getAuthToken(),
    });
  };

  // Get activities query
  const useActivities = (params?: {
    page?: number;
    limit?: number;
    type?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.type) searchParams.append('type', params.type);

    return useQuery({
      queryKey: ['activities', params],
      queryFn: async (): Promise<ActivitiesResponse> => {
        const queryString = searchParams.toString();
        const endpoint = `trading/activities${queryString ? `?${queryString}` : ''}`;
        return apiRequest(endpoint);
      },
      enabled: !!getAuthToken(),
    });
  };

  // Get trading stats query
  const useTradingStats = () => {
    return useQuery({
      queryKey: ['tradingStats'],
      queryFn: async (): Promise<TradingStatsResponse> => {
        return apiRequest('trading/stats');
      },
      enabled: !!getAuthToken(),
    });
  };

  return {
    // Mutations
    initiateTrade: initiateTradeMutation.mutate,
    initiateTradeAsync: initiateTradeMutation.mutateAsync,
    isInitiatingTrade: initiateTradeMutation.isPending,

    createDeposit: createDepositMutation.mutate,
    createDepositAsync: createDepositMutation.mutateAsync,
    isCreatingDeposit: createDepositMutation.isPending,

    createWithdrawal: createWithdrawalMutation.mutate,
    createWithdrawalAsync: createWithdrawalMutation.mutateAsync,
    isCreatingWithdrawal: createWithdrawalMutation.isPending,

    markNotificationsAsRead: markNotificationsAsReadMutation.mutate,
    markNotificationsAsReadAsync: markNotificationsAsReadMutation.mutateAsync,
    isMarkingNotificationsAsRead: markNotificationsAsReadMutation.isPending,

    // Queries
    useTrades,
    useActivities,
    useTradingStats,

    // Error states
    initiateTradeError: initiateTradeMutation.error,
    createDepositError: createDepositMutation.error,
    createWithdrawalError: createWithdrawalMutation.error,
    markNotificationsAsReadError: markNotificationsAsReadMutation.error,
  };
}; 