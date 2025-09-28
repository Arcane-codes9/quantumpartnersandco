import { Clock, ArrowDownLeft, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTrading } from '@/hooks';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

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
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export function ActivityFeed() {
  const { useActivities } = useTrading();
  const { data: activities, isLoading, isFetching } = useActivities({ page: 1 });
  const nav = useNavigate();

  const fetchingActivities = useMemo(() => isLoading || isFetching, [isLoading, isFetching]);
  // Filter activities based on search term and selected filters
  const filteredActivities = useMemo(() => activities?.data?.recentTransactions || [], [activities]);

  return (
    <Card className="crypto-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-primary" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredActivities.slice(0, 4).map((activity) => (
            <div key={activity._id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium capitalize">{activity.type}</span>
                    <span className="font-mono text-sm text-muted-foreground">{activity.currency}</span>
                  </div>
                  {/* <div className="text-sm text-muted-foreground flex items-center space-x-2">
                    <span>{activity.createdAt}</span>
                    <span className="text-xs">Network: {activity.method}</span>
                  </div> */}
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono font-medium">
                  <span>{activity.amount} {activity.currency}</span>
                </div>
                <div className="mt-1">
                  {getStatusBadge(activity.status)}
                </div>
              </div>
            </div>
          ))}

          <div className="text-center pt-4">
            <button className="text-sm text-primary hover:text-primary/80 transition-colors" onClick={() => nav('/activities')}>
              View All Activity →
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}