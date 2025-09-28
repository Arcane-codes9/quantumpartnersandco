import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DepositModal } from '@/components/trading/DepositModal';
import { WithdrawModal } from '@/components/trading/WithdrawModal';
import { Button } from '@/components/ui/button';
import { Wallet, ArrowUpRight, TrendingUp } from 'lucide-react';
import { TradingInterface } from '@/components/trading/TradingInterface';

const Trading = () => {
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

  return (
    <DashboardLayout>
      {/* Quick Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Trading
          </h1>
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={() => setDepositModalOpen(true)}
            className="glow-primary trading-button"
          >
            <Wallet className="w-4 h-4 mr-2" />
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

      {/* Main Content */}
      <TradingInterface />

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

export default Trading;