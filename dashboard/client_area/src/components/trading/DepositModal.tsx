import { useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, CheckCircle, AlertTriangle, Wallet, Network } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useTrading } from '@/hooks/useTrading';
import { useRate } from '@/hooks/useRate';

interface DepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const cryptoAssets = [
  { symbol: 'BTC', name: 'Bitcoin', networks: [{ name: 'Bitcoin', address: '1Bveyb9LE9bqDahzk77KSfhKx2qNc4eQ14' }] },
  { symbol: 'XRP', name: 'XRP', networks: [{ name: 'Tag: 3582075233', address: 'unavailable' }] },
  { symbol: 'USDT', name: 'Tether', networks: [{ name: 'TRC20', address: 'unavailable' }] }
];

export function DepositModal({ open, onOpenChange }: DepositModalProps) {
  const [selectedAsset, setSelectedAsset] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [depositMethod, setDepositMethod] = useState('');
  const [depositAddress, setDepositAddress] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [depositStatus, setDepositStatus] = useState<'idle' | 'pending' | 'confirmed'>('idle');
  const { createDeposit, isCreatingDeposit } = useTrading();
  const { toast } = useToast();
  const { data: rates } = useRate();

  const currencies = useMemo(() => rates, [rates]);
  const currencyValue = useMemo(() => ((+depositAmount / +currencies?.[selectedAsset]?.price || 0))?.toFixed(7) || 0, [depositAmount, currencies, selectedAsset]);

  const generateAddress = () => {
    // Use address from cryptoAssets config
    const asset = cryptoAssets.find(a => a.symbol === selectedAsset);
    const network = asset?.networks?.[+selectedNetwork];
    if (network) {
      setDepositMethod(network.name);
      setDepositAddress(network.address);
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(depositAddress);
      setCopied(true);
      toast({
        title: "Address Copied",
        description: "Deposit address copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy address to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleAssetChange = (value: string) => {
    setSelectedAsset(value);
    setSelectedNetwork('');
    setDepositAddress('');
  };

  const handleNetworkChange = (value: string) => {
    setSelectedNetwork(value);
    generateAddress();
  };

  const handleDeposit = () => {
    if (!selectedAsset || !selectedNetwork || !depositAddress) {
      toast({
        title: 'Missing Information',
        description: 'Please select asset, network, and generate address.',
        variant: 'destructive',
      });
      return;
    }
    // For demo, use a fixed amount or prompt user for amount
    createDeposit({
      amount: +currencyValue,
      method: depositMethod,
      currency: selectedAsset,
      walletAddress: depositAddress,
      reference: `${selectedAsset}-${Date.now()}`
    }, {
      onSuccess: () => {
        setDepositStatus('pending');
        toast({
          title: 'Deposit Initiated',
          description: `Your ${selectedAsset} deposit is being processed.`,
        });
        setSelectedAsset('');
        setSelectedNetwork('');
        setDepositMethod('');
        setDepositAddress('');
        setDepositAmount('');
        setCopied(false);
        setDepositStatus('idle');
      },
      onError: (error: any) => {
        toast({
          title: 'Deposit Failed',
          description: error?.message || 'An error occurred',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-primary" />
            <span>Deposit Cryptocurrency</span>
          </DialogTitle>
          <DialogDescription>
            Select a cryptocurrency and network to generate your deposit address
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Deposit Amount */}
          <div className="space-y-2">
            <Label>Amount $</Label>
            <div className="flex space-x-2">
              <Input value={depositAmount} placeholder='0.00' className="font-mono text-xs" onChange={(e) => setDepositAmount(e.target.value)} />
            </div>
          </div>

          {/* Asset Selection */}
          <div className="space-y-2">
            <Label htmlFor="asset">Select Cryptocurrency</Label>
            <Select value={selectedAsset} onValueChange={handleAssetChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose cryptocurrency" />
              </SelectTrigger>
              <SelectContent>
                {cryptoAssets.map((asset) => (
                  <SelectItem key={asset.symbol} value={asset.symbol}>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold">{asset.symbol}</span>
                      <span className="text-muted-foreground">{asset.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Network Selection */}
          {selectedAsset && (
            <div className="space-y-2">
              <Label htmlFor="network" className="flex items-center space-x-2">
                <Network className="w-4 h-4" />
                <span>Select Network</span>
              </Label>
              <Select value={selectedNetwork} onValueChange={handleNetworkChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose network" />
                </SelectTrigger>
                <SelectContent>
                  {cryptoAssets
                    .find(a => a.symbol === selectedAsset)
                    ?.networks.map((n, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {n.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Network Warning */}
          {selectedNetwork && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Only send {selectedAsset} on the {selectedNetwork} network.
                Sending assets on wrong networks may result in permanent loss.
              </AlertDescription>
            </Alert>
          )}

          {/* Deposit Address & QR Code */}
          {depositAddress && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-lg">
                  <QRCodeSVG
                    value={depositAddress}
                    size={160}
                    level="M"
                    includeMargin={true}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Deposit Address</Label>
                <div className="flex space-x-2">
                  <Input
                    value={depositAddress}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button
                    onClick={copyToClipboard}
                    size="sm"
                    variant="outline"
                    className="flex-shrink-0"
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4 text-success" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Deposit Status */}
              <div className="p-4 bg-secondary/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Deposit Status</span>
                  <div className={`flex items-center space-x-2 ${depositStatus === 'confirmed' ? 'text-success' :
                    depositStatus === 'pending' ? 'text-warning' : 'text-muted-foreground'
                    }`}>
                    <div className={`w-2 h-2 rounded-full ${depositStatus === 'confirmed' ? 'bg-success' :
                      depositStatus === 'pending' ? 'bg-warning animate-pulse' : 'bg-muted'
                      }`}></div>
                    <span className="text-sm capitalize">{depositStatus}</span>
                  </div>
                </div>
                {depositStatus === 'idle' && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Waiting for transaction... This may take a few minutes.
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {depositAddress && (
              <Button onClick={handleDeposit} disabled={isCreatingDeposit}>
                {isCreatingDeposit ? 'Processing...' : 'Deposit'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}