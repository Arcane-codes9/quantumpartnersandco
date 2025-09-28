import { useMutation, useQuery } from '@tanstack/react-query';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const getAuthToken = () => {
  const match = document.cookie.match(/(?:^|; )authToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
};

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await fetch(`${API_BASE_URL}api/admin${endpoint}`, {
    ...options,
    headers,
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export function useAdminActions() {
  // Update user balance/profit
  const updateUser = useMutation({
    mutationFn: async (data: { userId: string; balance?: number; profit?: number }) =>
      apiRequest('/user/update', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  });

  // Update transaction status
  const updateTransactionStatus = useMutation({
    mutationFn: async (data: { transactionId: string; status: string }) =>
      apiRequest('/transaction/update', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  });

  // Update trade status
  const updateTradeStatus = useMutation({
    mutationFn: async (data: { tradeId: string; status: string }) =>
      apiRequest('/trade/update', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  });

  // Send notification and email
  const notifyUser = useMutation({
    mutationFn: async (data: { userId: string; title?:string; text: string; emailSubject?: string; emailBody?: string }) =>
      apiRequest('/user/notify', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  });

  // Delete user and all associated data
  const deleteUser = useMutation({
    mutationFn: async (userId: string) =>
      apiRequest(`/user/${userId}`, {
        method: 'DELETE',
      }),
  });

  // Delete a specific transaction
  const deleteTransaction = useMutation({
    mutationFn: async (transactionId: string) =>
      apiRequest(`/transaction/${transactionId}`, {
        method: 'DELETE',
      }),
  });

  // Delete a specific trade
  const deleteTrade = useMutation({
    mutationFn: async (tradeId: string) =>
      apiRequest(`/trade/${tradeId}`, {
        method: 'DELETE',
      }),
  });

  // Get all users
  const useUsers = () => {
    return useQuery({
      queryKey: ['users'],
      queryFn: async () => {
        return apiRequest('/users');
      }
    });
  };

  // Get all trades
  const useTrades = () => {
    return useQuery({
      queryKey: ['trades'],
      queryFn: async () => {
        return apiRequest('/trades');
      }
    });
  };

  // Get all transactions
  const useTransactions = () => {
    return useQuery({
      queryKey: ['transactions'],
      queryFn: async () => {
        return apiRequest('/transactions');
      }
    });
  };

  return {
    updateUser,
    updateTransactionStatus,
    updateTradeStatus,
    notifyUser,
    deleteUser,
    deleteTransaction,
    deleteTrade,
    useUsers,
    useTrades,
    useTransactions,
  };
}
