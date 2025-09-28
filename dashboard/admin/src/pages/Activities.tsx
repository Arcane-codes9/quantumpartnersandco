import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';
import { useAdminActions } from '@/hooks/useAdminActions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UpdateTransactionStatusModal } from '@/components/admin/UpdateTransactionStatusModal';

const Activities = () => {
  const [pageInit, setPageInit] = useState(true);
  const { user, isLoadingUser, isAuthenticated } = useAuth();
  const { useTransactions, deleteTransaction } = useAdminActions();
  const { data: transactionsData, isLoading: isLoadingTransactions, isError: isTransactionsError, refetch: refetchTransactions } = useTransactions();

  // Modal state management
  const [updateTransactionStatusOpen, setUpdateTransactionStatusOpen] = useState(false);

  // Data for modals
  const [selectedTransactionData, setSelectedTransactionData] = useState({
    transactionId: '',
    currentStatus: ''
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-success text-success-foreground">Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-warning text-warning-foreground">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'cancelled':
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Modal handlers
  const openUpdateTransactionStatusModal = (transactionId: string, currentStatus: string) => {
    setSelectedTransactionData({ transactionId, currentStatus });
    setUpdateTransactionStatusOpen(true);
  };

  useEffect(() => {
    if (pageInit === false) {
      if (isLoadingUser === false) {
        if (isAuthenticated === false && !user) {
          // Redirect to login if not authenticated
          window.location.href = `${import.meta.env.VITE_SITE_URL}login`;
        }
      }
    }
    setPageInit(false);
  }, [isAuthenticated, isLoadingUser, pageInit, user]);

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin</h1>
          <p className="text-muted-foreground">Manage your Users Activities and also Delete Activities.</p>
        </div>

        <div className="grid gap-6">
          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>Recent deposit and withdrawal activities</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingTransactions ? (
                <div className="text-center py-4">Loading transactions...</div>
              ) : isTransactionsError ? (
                <div className="text-center py-4 text-red-500">Error loading transactions</div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactionsData?.transactions?.map((transaction: any) => (
                        <TableRow key={transaction._id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{transaction.userId?.username || 'N/A'}</div>
                              <div className="text-sm text-muted-foreground">{transaction.userId?.email || 'N/A'}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={transaction.type === 'deposit' ? 'default' : 'destructive'}>
                              {transaction.type}
                            </Badge>
                          </TableCell>
                          <TableCell>${transaction.amount}</TableCell>
                          <TableCell>{transaction.method}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              className="h-auto p-0 font-normal"
                              onClick={() => openUpdateTransactionStatusModal(transaction._id, transaction.status)}
                            >
                              {getStatusBadge(transaction.status)}
                            </Button>
                          </TableCell>
                          <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete this transaction? This action cannot be undone.`)) {
                                  deleteTransaction.mutate(transaction._id, {
                                    onSuccess: () => {
                                      refetchTransactions();
                                    }
                                  });
                                }
                              }}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {(!transactionsData || !transactionsData.transactions || transactionsData.transactions.length === 0) && (
                    <div className="text-center py-4 text-muted-foreground">No transactions found</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Modals */}
          <UpdateTransactionStatusModal
            open={updateTransactionStatusOpen}
            onOpenChange={setUpdateTransactionStatusOpen}
            transactionId={selectedTransactionData.transactionId}
            currentStatus={selectedTransactionData.currentStatus}
            onTransactionUpdated={() => {
              // Refetch data after update
              refetchTransactions();
            }}
          />

        </div>
      </div>
    </DashboardLayout>
  );
};

export default Activities;