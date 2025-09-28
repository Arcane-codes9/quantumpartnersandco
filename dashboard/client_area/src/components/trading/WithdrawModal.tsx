import { useMemo, useState } from 'react';
import { ArrowUpRight, AlertTriangle, Calculator, TrendingUp, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useTrading } from '@/hooks/useTrading';
import { useAuth } from '@/hooks';
import { useRate } from '@/hooks/useRate';

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const availableAssets = [
  { symbol: 'BTC', name: 'Bitcoin', networks: ['Bitcoin'] },
  { symbol: 'ETH', name: 'Ethereum', networks: ['ERC20', 'Arbitrum'] },
  { symbol: 'USDT', name: 'Tether', networks: ['ERC20', 'TRC20'] }
];

export function WithdrawModal({ open, onOpenChange }: WithdrawModalProps) {
  const [selectedAsset, setSelectedAsset] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [fromAccount, setFromAccount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawStatus, setWithdrawStatus] = useState<'idle' | 'pending' | 'processing' | 'Request sent'>('idle');
  const { toast } = useToast();
  const { createWithdrawal } = useTrading();
  const { user } = useAuth();
  const { data: rates } = useRate();

  // Calculate total value and 24h change using USDT rate (user.balance is in USD/USDT)
  const currencies = useMemo(() => rates, [rates]);
  const totalValue = useMemo(() => +user?.balance || 0, [user]);
  const estimatedFee = useMemo(() => +withdrawAmount * 0.001, [withdrawAmount]);
  const totalCost = useMemo(() => +withdrawAmount + +estimatedFee, [withdrawAmount, estimatedFee]);
  const selectedAssetData = useMemo(() => availableAssets.find(a => a.symbol === selectedAsset), [selectedAsset, availableAssets]);
  const remainingBalance = useMemo(() => +totalValue - +totalCost, [totalCost, totalValue]);
  const currencyValue = useMemo(() => ((+totalCost / +currencies?.[selectedAsset]?.price || 0))?.toFixed(7) || 0, [totalCost, currencies, selectedAsset]);

  const handleMaxAmount = () => {
    if (totalValue) {
      const maxAmount = Math.max(0, totalValue);
      setWithdrawAmount(maxAmount.toString());
    }
  };

  const handleWithdraw = () => {
    if (!selectedAsset || !selectedNetwork || !withdrawAddress || !withdrawAmount || !fromAccount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (totalCost > (totalValue || 0)) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive",
      });
      return;
    }

    setWithdrawStatus('pending');

    // Call backend withdrawal API
    createWithdrawal({
      amount: +currencyValue,
      usdAmount: totalCost,
      method: selectedNetwork,
      accountType: fromAccount,
      currency: selectedAsset,
      walletAddress: withdrawAddress,
      reference: `${selectedAsset}-${Date.now()}`
    }, {
      onSuccess: () => {
        setWithdrawStatus('Request sent');
        toast({
          title: "Withdrawal Initiated",
          description: `Your ${selectedAsset} withdrawal has been processed`,
        });
        onOpenChange(false);
      },
      onError: (error: any) => {
        setWithdrawStatus('idle');
        toast({
          title: "Withdrawal Failed",
          description: error?.message || 'An error occurred',
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ArrowUpRight className="w-5 h-5 text-primary" />
            <span>Withdraw Cryptocurrency</span>
          </DialogTitle>
          <DialogDescription>
            Send cryptocurrency to an external wallet address
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Asset Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="asset">Select Asset</Label>
              <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose asset" />
                </SelectTrigger>
                <SelectContent>
                  {availableAssets.map((asset) => (
                    <SelectItem key={asset.symbol} value={asset.symbol}>
                      <div className="flex items-center justify-between w-full">
                        <span className="font-mono font-bold">{asset.symbol}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="network">Network</Label>
              <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose network" />
                </SelectTrigger>
                <SelectContent>
                  {selectedAssetData?.networks.map((network) => (
                    <SelectItem key={network} value={network}>
                      {network}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* From Accounts */}
          <div className="space-y-2">
            <Label htmlFor="asset">Account</Label>
            <Select value={fromAccount} onValueChange={setFromAccount}>
              <SelectTrigger>
                <SelectValue placeholder="Choose Account" />
              </SelectTrigger>
              <SelectContent>
                {[{ name: 'balance', symbol: <DollarSign /> }, { name: 'profit', symbol: <TrendingUp /> }].map((accounts: { name: string, symbol: any }, i) => (
                  <SelectItem key={i} value={accounts.name} className='text-capitalize'>
                    <div className="flex items-center justify-between w-full">
                      <span className="font-mono font-bold capitalize">{accounts.symbol}</span>
                      <span className="text-xs text-muted-foreground ml-2 capitalize">
                        {accounts.name}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Withdrawal Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Withdrawal Address</Label>
            <Input
              id="address"
              placeholder="Enter wallet address"
              value={withdrawAddress}
              onChange={(e) => setWithdrawAddress(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount $</Label>
            <div className="flex space-x-2">
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="font-mono"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleMaxAmount}
                disabled={!selectedAsset}
              >
                Max
              </Button>
            </div>
          </div>

          {/* Fee Summary */}
          {selectedAsset && withdrawAmount && (
            <div className="space-y-3 p-4 bg-secondary/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Calculator className="w-4 h-4 text-primary" />
                <span className="font-medium">Transaction Summary</span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Withdrawal Amount:</span>
                  <span className="font-mono">{(+withdrawAmount / +currencies?.[selectedAsset]?.price || 0)?.toFixed(4) || 0.00} {selectedAsset}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee:</span>
                  <span className="font-mono">{+estimatedFee?.toFixed(10) || 0.00} USD</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span className="font-mono">{totalCost.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining Balance:</span>
                  <span className={`font-mono ${remainingBalance < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {remainingBalance.toFixed(6)} USD
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Warning */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> Double-check the withdrawal address and network.
              Incorrect information may result in permanent loss of funds.
            </AlertDescription>
          </Alert>

          {/* Withdrawal Status */}
          {withdrawStatus !== 'idle' && (
            <div className="p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Withdrawal Status</span>
                <div className={`flex items-center space-x-2 ${withdrawStatus === 'Request sent' ? 'text-success' :
                  withdrawStatus === 'processing' ? 'text-warning' : 'text-primary'
                  }`}>
                  <div className={`w-2 h-2 rounded-full ${withdrawStatus === 'Request sent' ? 'bg-success' :
                    withdrawStatus === 'processing' ? 'bg-warning animate-pulse' : 'bg-primary animate-pulse'
                    }`}></div>
                  <span className="text-sm capitalize">{withdrawStatus}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {withdrawStatus === 'pending' && 'Verifying transaction details...'}
                {withdrawStatus === 'processing' && 'Broadcasting transaction to network...'}
                {withdrawStatus === 'Request sent' && 'Transaction has been sent successfully!'}
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleWithdraw}
              disabled={
                !selectedAsset ||
                !selectedNetwork ||
                !withdrawAddress ||
                !withdrawAmount ||
                withdrawStatus !== 'idle' ||
                totalCost > (totalValue)
              }
              className="glow-primary trading-button"
            >
              {withdrawStatus === 'idle' ? 'Confirm Withdrawal' : 'Processing...'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}