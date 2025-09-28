import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Wallet, DollarSign, PieChart, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TradeChart from './TradeChart';
import CryptoMarket from './CryptoMarket';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { useRate } from '@/hooks/useRate';

interface PortfolioAsset {
  symbol: string;
  name: string;
  balance: number;
  valueUSD: number;
  allocation: number;
  change24h: number;
}

const portfolioAssets: PortfolioAsset[] = [
  { symbol: 'BTC', name: 'Bitcoin', balance: 0.5684, valueUSD: 24589.32, allocation: 65.2, change24h: 2.34 },
  { symbol: 'ETH', name: 'Ethereum', balance: 4.2156, valueUSD: 11298.45, allocation: 30.0, change24h: -1.23 },
  { symbol: 'SOL', name: 'Solana', balance: 123.45, valueUSD: 1823.67, allocation: 4.8, change24h: 5.67 },
];


// We'll use USDT as the base for total value and change, since user.balance is in USD/USDT


interface PortfolioOverviewProps {
  setDepositModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setWithdrawModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}


export function PortfolioOverview({ setDepositModalOpen, setWithdrawModalOpen }: PortfolioOverviewProps) {
  const [viewMode, setViewMode] = useState<'summary' | 'detailed'>('summary');
  const { user } = useAuth();
  const { data: rates, isLoading } = useRate();
  const nav = useNavigate();

  // Calculate total value and 24h change using USDT rate (user.balance is in USD/USDT)
  const usdt = useMemo(() => rates?.USDT, [rates]);
  const totalValue = useMemo(() => +user?.balance || 0, [user]);
  const usdtPrice = useMemo(() => !isLoading ? +usdt?.price : 1, [isLoading, usdt]);
  const usdtChange24h = useMemo(() => !isLoading ? +usdt?.change24h : 0, [isLoading, usdt]);
  const usdtChangePercent = useMemo(() => !isLoading ? +usdt?.changePercent : 0, [isLoading, usdt]);
  const totalChange24h = useMemo(() => usdtPrice !== 0 ? usdtChange24h * totalValue / usdtPrice : 0, [usdtPrice, usdtChange24h, totalValue]);
  const totalChangePercent = useMemo(() => usdtChangePercent, [usdtChangePercent]);

  return (
    <div className="space-y-6">
      {/* Main Portfolio Card */}
      <Card className="crypto-card glow-primary">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="w-5 h-5 text-primary" />
              <span>Portfolio Overview</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'summary' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('summary')}
              >
                <PieChart className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'detailed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('detailed')}
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Total Value */}
          <div className="mb-6">
            <div className="flex items-baseline space-x-2">
              <DollarSign className="w-6 h-6 text-primary" />
              <span className="text-3xl md:text-4xl font-bold font-mono">
                {isLoading ? '...' : totalValue.toLocaleString()}
              </span>
              <span className="text-lg text-muted-foreground">USD</span>
            </div>

            <div className={`flex items-center space-x-2 mt-2 ${totalChangePercent >= 0 ? 'text-success' : 'text-destructive'}`}>
              {totalChangePercent >= 0 ?
                <TrendingUp className="w-4 h-4" /> :
                <TrendingDown className="w-4 h-4" />
              }
              <span className="font-mono font-medium">
                {
                  isLoading
                    ? '...'
                    : `${totalChangePercent >= 0 ? '+' : ''}$
                    ${totalChange24h.toLocaleString(undefined, { maximumFractionDigits: 2 })} (${totalChangePercent >= 0 ? '+' : ''}
                    ${totalChangePercent.toFixed(2)}%)`
                }
              </span>
              <span className="text-muted-foreground text-sm">24h</span>
            </div>
          </div>

          {/* Asset Breakdown */}
          {viewMode === 'summary' ? (
            <div className="space-y-4">
              <h4 className="font-semibold text-card-foreground mb-3">Currency Market</h4>
              <CryptoMarket />
            </div>
          ) : (
            <div className="space-y-3 h-[300px]">
              <h4 className="font-semibold text-card-foreground mb-3">Market Chart</h4>
              <TradeChart />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button className="h-16 text-left justify-start glow-primary trading-button" size="lg" onClick={() => setDepositModalOpen(true)}>
          <div>
            <div className="font-semibold">Quick Deposit</div>
            <div className="text-sm opacity-80">Add funds to portfolio</div>
          </div>
        </Button>

        <Button variant="outline" className="h-16 text-left justify-start trading-button" size="lg" onClick={() => setWithdrawModalOpen(true)}>
          <div>
            <div className="font-semibold">Withdraw</div>
            <div className="text-sm opacity-80">Transfer to wallet</div>
          </div>
        </Button>

        <Button variant="outline" className="h-16 text-left justify-start glow-accent trading-button" size="lg" onClick={() => nav('/trading')}>
          <div>
            <div className="font-semibold">Start Trading</div>
            <div className="text-sm opacity-80">Begin trading session</div>
          </div>
        </Button>
      </div>
    </div>
  );
}