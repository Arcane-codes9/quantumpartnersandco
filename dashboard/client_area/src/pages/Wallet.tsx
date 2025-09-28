import { useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DepositModal } from '@/components/trading/DepositModal';
import { WithdrawModal } from '@/components/trading/WithdrawModal';
import {
  Search,
  Wallet as WalletIcon,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '@/hooks';
import { useRate } from '@/hooks/useRate';
import { Trade, useTrading } from '@/hooks/useTrading';
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function CountdownText({ target }) {
  const now = dayjs();
  const targetDate = dayjs(target);

  // Get "in X days" and make it "X days left"
  const timeLeft = targetDate.from(now).replace("in ", "") + " left";

  return <span>{timeLeft}</span>;
}

const Wallet = () => {
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [hideSmallBalances, setHideSmallBalances] = useState(false);
  const [hideBalances, setHideBalances] = useState(false);
  const { user } = useAuth();
  const { data: rates, isLoading } = useRate();
  // Fetch trades from backend
  const { useTrades } = useTrading();
  const { data: tradesData } = useTrades({ page: 1 });
  // Calculate total value and 24h change using USDT rate (user.balance is in USD/USDT)
  const usdt = useMemo(() => rates?.USDT, [rates]);
  const btc = useMemo(() => rates?.BTC, [rates]);
  const totalValue = useMemo(() => +user?.balance, [user?.balance]);
  const usdtPrice = useMemo(() => !isLoading ? +usdt?.price : 1, [isLoading, usdt]);
  const usdtChange24h = useMemo(() => !isLoading ? +usdt?.change24h : 0, [isLoading, usdt]);
  const usdtChangePercent = useMemo(() => !isLoading ? +usdt?.changePercent : 0, [isLoading, usdt]);
  const totalChange24h = useMemo(() => usdtPrice !== 0 ? usdtChange24h * totalValue / usdtPrice : 0, [usdtPrice, usdtChange24h, totalValue]);
  const totalChangePercent = useMemo(() => usdtChangePercent, [usdtChangePercent]);

  const filteredAssets: Trade[] = useMemo(() => (tradesData && tradesData.data && Array.isArray(tradesData.data.trades)) ? tradesData.data.trades : [], [tradesData]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Wallet</h1>
            <p className="text-muted-foreground">Manage your cryptocurrency holdings</p>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={() => setDepositModalOpen(true)}
              className="glow-primary trading-button"
            >
              <ArrowDownLeft className="w-4 h-4 mr-2" />
              Deposit
            </Button>
            <Button
              variant="outline"
              onClick={() => setWithdrawModalOpen(true)}
              className="trading-button"
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Withdraw
            </Button>
          </div>
        </div>

        {/* Portfolio Summary */}
        <Card className="crypto-card glow-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <WalletIcon className="w-6 h-6 text-primary" />
                  <span className="text-lg font-semibold">Total Portfolio Value</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setHideBalances(!hideBalances)}
                  >
                    {hideBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="text-4xl font-bold font-mono">
                  {hideBalances ? '••••••' : `$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </div>
                <div className={`${totalChangePercent > 0 ? 'text-success' : 'text-destructive'} text-lg font-medium mt-1`}>
                  {
                    isLoading
                      ? '...'
                      : `${totalChangePercent >= 0 ? '+' : ''}$
                    ${totalChange24h.toLocaleString(undefined, { maximumFractionDigits: 2 })} (${totalChangePercent >= 0 ? '+' : ''}
                    ${totalChangePercent.toFixed(2)}%)`
                  } 24h
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-2">Rates</div>
                <div className="text-2xl font-bold">${btc?.price.toLocaleString()} (BTC)</div>
                <div className="text-sm text-muted-foreground">cryptocurrencies</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant={hideSmallBalances ? "default" : "outline"}
            onClick={() => setHideSmallBalances(!hideSmallBalances)}
          >
            Hide Small Balances
          </Button>
        </div>

        {/* Assets Table */}
        <Card className="crypto-card">
          <CardHeader>
            <CardTitle>Your Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 text-sm text-muted-foreground pb-2 border-b border-border">
                <div className="col-span-3">Invoice / Type</div>
                <div className="col-span-2 text-right">Capital (USD)</div>
                <div className="col-span-2 text-right">Profit (USD)</div>
                <div className="col-span-2 text-right">Duration</div>
                <div className="col-span-2 text-right">Status</div>
              </div>

              {/* Asset Rows */}
              {filteredAssets
                .filter((order) => String(order.amount).includes(searchTerm) || String(order.duration).includes(searchTerm) || String(order.status).includes(searchTerm) || String(order.invoice).includes(searchTerm))
                .map((order, i) => (
                  <div key={i} className="grid grid-cols-12 gap-4 items-center py-3 hover:bg-secondary/30 rounded-lg transition-colors">
                    {/* Asset Info */}
                    <div className="col-span-3 flex items-center space-x-3">
                      <div>
                        <div className="font-medium">{order.type}</div>
                        <div className="text-sm text-muted-foreground">{order.invoice}</div>
                      </div>
                    </div>

                    {/* Balance */}
                    <div className="col-span-2 text-right">
                      <div className="font-mono font-medium">
                        {hideBalances ? '••••' : order.amount.toFixed(4)}
                      </div>
                      <div className="text-sm text-muted-foreground">{order.fees.toString()}</div>
                    </div>

                    {/* Value */}
                    <div className="col-span-2 text-right">
                      <div className="font-mono font-medium">
                        {hideBalances ? '••••••' : `$${order.profit.toLocaleString()}`}
                      </div>
                    </div>

                    {/* 24h Change */}
                    <div className="col-span-2 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <span className="font-mono">
                          {order.duration}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">{CountdownText({ target: order.maturity_date })}</div>
                    </div>

                    {/* Status */}
                    <div className="col-span-3 text-right">
                      <div className="flex justify-center space-x-1">
                        <Badge variant='secondary' className={`text-xs ${order.status === 'pending' ? 'text-orange-300' : order.status === 'completed' ? 'text-success' : 'text-destructive'} mt-1`}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {filteredAssets.length === 0 && (
              <div className="text-center py-12">
                <WalletIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No trades found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search terms' : 'Start by depositing some cryptocurrency'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modals */}
        <DepositModal
          open={depositModalOpen}
          onOpenChange={setDepositModalOpen}
        />
        <WithdrawModal
          open={withdrawModalOpen}
          onOpenChange={setWithdrawModalOpen}
        />
      </div>
    </DashboardLayout>
  );
};

export default Wallet;