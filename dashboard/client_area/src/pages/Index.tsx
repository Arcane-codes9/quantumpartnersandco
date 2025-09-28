import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PriceTicker } from '@/components/dashboard/PriceTicker';
import { PortfolioOverview } from '@/components/dashboard/PortfolioOverview';
import { MarketTrends } from '@/components/dashboard/MarketTrends';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { DepositModal } from '@/components/trading/DepositModal';
import { WithdrawModal } from '@/components/trading/WithdrawModal';
import { useAuth } from '@/hooks';

const Index = () => {
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const { isLoadingUser } = useAuth();

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      {/* Quick Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Dashboard
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Price Ticker */}
        <PriceTicker />

        {/* Portfolio and Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <PortfolioOverview setDepositModalOpen={setDepositModalOpen} setWithdrawModalOpen={setWithdrawModalOpen} />
          </div>
          <div>
            <ActivityFeed />
          </div>
        </div>

        {/* Market Trends */}
        <MarketTrends />
      </div>

      {/* Modals */}
      <DepositModal
        open={depositModalOpen}
        onOpenChange={setDepositModalOpen}
      />
      <WithdrawModal
        open={withdrawModalOpen}
        onOpenChange={setWithdrawModalOpen}
      />
    </DashboardLayout>
  );
};

export default Index;
