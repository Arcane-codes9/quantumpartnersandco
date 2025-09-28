import { useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, ArrowDownLeft, ArrowUpRight, TrendingUp, Search, Filter } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTrading } from '@/hooks';

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'deposit':
      return <ArrowDownLeft className="w-4 h-4 text-success" />;
    case 'withdraw':
      return <ArrowUpRight className="w-4 h-4 text-destructive" />;
    case 'trade':
      return <TrendingUp className="w-4 h-4 text-primary" />;
    default:
      return <Clock className="w-4 h-4 text-muted-foreground" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return <Badge variant="default" className="bg-success text-success-foreground">Completed</Badge>;
    case 'pending':
      return <Badge variant="secondary" className="bg-warning text-warning-foreground">Pending</Badge>;
    case 'failed':
      return <Badge variant="destructive">Failed</Badge>;
    case 'cancelled':
      return <Badge variant="destructive">Cancelled</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export default function Activities() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const { useActivities } = useTrading();
  const { data: activities, isLoading, isFetching } = useActivities({ page: 1 });

  const fetchingActivities = useMemo(() => isLoading || isFetching, [isLoading, isFetching]);
  // Filter activities based on search term and selected filters
  const filteredActivities = useMemo(() => activities?.data?.recentTransactions.filter(a => {
    const matchesSearch = a.currency.toLowerCase().includes(searchTerm.toLowerCase()) || a.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || a.type === filterType;
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  }) || [], [searchTerm, filterType, filterStatus, activities]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Activities</h1>
            <p className="text-muted-foreground">Track all your trading and transaction history</p>
          </div>
        </div>

        <Card className="crypto-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-primary" />
              <span>Transaction History</span>
            </CardTitle>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-32">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="trade">Trade</SelectItem>
                    <SelectItem value="deposit">Deposit</SelectItem>
                    <SelectItem value="withdraw">Withdraw</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Network</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>TX Hash</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities.map((activity) => (
                    <TableRow key={activity._id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getActivityIcon(activity.type)}
                          <span className="font-medium capitalize">{activity.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono">{activity.currency}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono">
                          ${activity.amount} {activity.currency}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm text-muted-foreground">
                          {activity.method}
                        </span>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(activity.status)}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{activity.createdAt}</span>
                      </TableCell>
                      <TableCell>
                        {activity.transactionId ? (
                          <Button variant="ghost" size="sm" className="font-mono text-xs p-1 h-auto">
                            {activity.transactionId}
                          </Button>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {fetchingActivities
              ? <div className="text-center py-8">
                <p className="text-muted-foreground">Loading...</p>
              </div>
              : <>
                {filteredActivities.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No activities found matching your criteria.</p>
                  </div>
                )}
              </>
            }

          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}