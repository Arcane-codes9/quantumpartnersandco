import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';
import { useAdminActions } from '@/hooks/useAdminActions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UpdateTradeStatusModal } from '@/components/admin/UpdateTradeStatusModal';

const Trades = () => {
  const [pageInit, setPageInit] = useState(true);
  const { user, isLoadingUser, isAuthenticated } = useAuth();
  const { useTrades, deleteTrade } = useAdminActions();
  const { data: tradesData, isLoading: isLoadingTrades, isError: isTradesError, refetch: refetchTrades } = useTrades();

  // Modal state management
  const [updateTradeStatusOpen, setUpdateTradeStatusOpen] = useState(false);

  // Data for modals
  const [selectedTradeData, setSelectedTradeData] = useState({
    tradeId: '',
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
  const openUpdateTradeStatusModal = (tradeId: string, currentStatus: string) => {
    setSelectedTradeData({ tradeId, currentStatus });
    setUpdateTradeStatusOpen(true);
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
          <p className="text-muted-foreground">Manage your Users Trades and also Delete trades.</p>
        </div>

        <div className="grid gap-6">

          {/* Trades Table */}
          <Card>
            <CardHeader>
              <CardTitle>Trades</CardTitle>
              <CardDescription>Recent trading activities</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingTrades ? (
                <div className="text-center py-4">Loading trades...</div>
              ) : isTradesError ? (
                <div className="text-center py-4 text-red-500">Error loading trades</div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Profit</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tradesData?.trades?.map((trade: any) => (
                        <TableRow key={trade._id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{trade.userId?.username || 'N/A'}</div>
                              <div className="text-sm text-muted-foreground">{trade.userId?.email || 'N/A'}</div>
                            </div>
                          </TableCell>
                          <TableCell>{trade.type}</TableCell>
                          <TableCell>${trade.amount}</TableCell>
                          <TableCell>${trade.profit}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              className="h-auto p-0 font-normal"
                              onClick={() => openUpdateTradeStatusModal(trade._id, trade.status)}
                            >
                              {getStatusBadge(trade.status)}
                            </Button>
                          </TableCell>
                          <TableCell>{new Date(trade.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete this trade? This action cannot be undone.`)) {
                                  deleteTrade.mutate(trade._id, {
                                    onSuccess: () => {
                                      refetchTrades();
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
                  {(!tradesData || !tradesData.trades || tradesData.trades.length === 0) && (
                    <div className="text-center py-4 text-muted-foreground">No trades found</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Modals */}
          <UpdateTradeStatusModal
            open={updateTradeStatusOpen}
            onOpenChange={setUpdateTradeStatusOpen}
            tradeId={selectedTradeData.tradeId}
            currentStatus={selectedTradeData.currentStatus}
            onTradeUpdated={() => {
              // Refetch data after update
              refetchTrades();
            }}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Trades;
