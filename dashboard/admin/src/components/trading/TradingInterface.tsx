import { useMemo, useState, useEffect } from 'react';
import { useTrading, Trade } from '@/hooks/useTrading';
import { TrendingUp, TrendingDown, BarChart3, DollarSign, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import TradeChart from '../dashboard/TradeChart';
import { useAuth } from '@/hooks';
import { useRate } from '@/hooks/useRate';
import { useSearchParams } from 'react-router-dom';

export function TradingInterface() {
  const [searchParams] = useSearchParams()
  const plan = searchParams.get('plan') || 'Starter';
  const [planType, setPlanType] = useState<string>(plan);
  const [tradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: rates, isLoading } = useRate();
  const { initiateTrade, isInitiatingTrade, useTrades } = useTrading();

  // Fetch trades from backend
  const { data: tradesData, isLoading: isTradesLoading } = useTrades({ page: 1 });

  const usdt = useMemo(() => rates?.USDT, [rates]);
  const totalValue = useMemo(() => +user.balance, [user.balance]);
  const usdtChangePercent = useMemo(() => !isLoading ? +usdt?.changePercent : 0, [isLoading, usdt]);
  const totalChangePercent = useMemo(() => usdtChangePercent, [usdtChangePercent]);
  const estimatedFee = useMemo(() => +amount * 0.001, [amount]);

  const selectedPlan = useMemo(() => plans.find(p => p.name === planType), [planType, plans]);
  const orders: Trade[] = useMemo(() => (tradesData && tradesData.data && Array.isArray(tradesData.data.trades)) ? tradesData.data.trades : [], [tradesData]);

  const totals = useMemo(() => {
    return orders.reduce(
      (totals, order) => {
        totals.amount += Number(order.amount) || 0;
        totals.profit += Number(order.profit) || 0;
        return totals;
      },
      { amount: 0, profit: 0 }
    );
  }, [orders]);

  const handleInitTrade = () => {
    if (!amount || isNaN(+amount) || !planType || !selectedPlan) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Calculate maturity amount and profit
    const profitPercent = parseFloat(selectedPlan.profit);
    const maturity_amount = (+amount / 100 * profitPercent) + +amount;
    const today = new Date();
    const maturity_date = new Date(today);
    // Parse duration (e.g., '7 days')
    const durationDays = parseInt(selectedPlan.duration);
    maturity_date.setDate(today.getDate() + durationDays);

    const payload = {
      type: planType,
      amount: +amount,
      fee: +estimatedFee,
      duration: selectedPlan.duration,
      maturity_amount,
      maturity_date: maturity_date.toISOString(),
      profit: maturity_amount - +amount,
      date: today.toISOString(),
      invoice: `INV-${Date.now()}`,
      notes: '',
    };

    initiateTrade(payload, {
      onSuccess: () => {
        setAmount('');
        toast({
          title: "Order Placed",
          description: `${planType.toUpperCase()} order for ${amount} USD placed successfully`,
        });
      },
      onError: (error: any) => {
        toast({
          title: "Order Failed",
          description: error?.message || 'Failed to place order',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Trading Chart */}
      <div className="xl:col-span-2 space-y-6">
        <Card className="crypto-card">
          <CardHeader className="pb-3">
            <div className="flex flex flex-col md:flex-row items-center justify-between">
              <div className="flex flex-col items-center space-x-4">

                <div className="flex items-center space-x-4">
                  <div>
                    <div className="text-2xl font-bold font-mono">
                      ${totalValue?.toLocaleString()}
                    </div>
                    <div className={`flex items-center space-x-1 text-sm ${totalChangePercent >= 0 ? 'text-success' : 'text-destructive'
                      }`}>
                      {totalChangePercent >= 0 ?
                        <TrendingUp className="w-4 h-4" /> :
                        <TrendingDown className="w-4 h-4" />
                      }
                      <span>{`${totalChangePercent >= 0 ? '+' : ''}${totalChangePercent.toFixed(2)}%`}</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div>Available</div>
                    {/* <div className="font-mono">${selectedPairData.volume}</div> */}
                  </div>
                </div>
              </div>

              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                Full Chart
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Mock Trading Chart */}
            <div className="h-96 bg-secondary/20 rounded-lg flex items-center justify-center border border-border">
              <TradeChart />
            </div>
          </CardContent>
        </Card>

        {/* Order Book */}
        <Card className="crypto-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Order Book</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-xs text-muted-foreground mb-2">
              <div>Invoice</div>
              <div className="text-right">Capital</div>
              <div className="text-right">Profit</div>
              <div className="text-right">Total</div>
            </div>

            {/* Asks */}
            <div className="space-y-1 mb-4">
              {orders.slice(0, 5).map((v, i) => (
                <div key={i} className="grid grid-cols-4 gap-4 text-xs py-1 hover:bg-destructive/10 rounded">
                  <div className="font-mono text-destructive">{v?.summary?.invoice}</div>
                  <div className="font-mono text-right">{v.summary.amount.toFixed(3)}</div>
                  <div className="font-mono text-right">{v.summary.profit.toFixed(3)}</div>
                  <div className="font-mono text-right">{v.summary.totalValue.toFixed(2)}</div>
                </div>
              ))}
            </div>

            {/* Spread */}
            <div className="text-center py-2 border-y border-border gap-5 flex">
              <span className="text-sm font-medium">
                Total Trade Capital: ${totals?.amount}
              </span>
              <span className="text-sm font-medium">
                Total Trade Profit: ${totals?.profit}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trading Panel */}
      <div className="space-y-6">
        <Card className="crypto-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-primary" />
              <span>Trade</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={tradeType}>

              <TabsContent value={tradeType} className="space-y-4 mt-4">
                {/* Order Type */}
                <div className="space-y-2">
                  <Label>Order Type</Label>
                  <Select value={planType} onValueChange={setPlanType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {
                        plans.map((plan, i) => (
                          <SelectItem key={plan.name} value={plan.name}>
                            {plan.name}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    min={selectedPlan?.minDeposit}
                    max={selectedPlan?.maxDeposit}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="font-mono"
                  />
                  <div className="flex space-x-2">
                    {
                      ['25%', '50%', '75%', '100%'].map((percent) => (
                        <Button
                          key={percent}
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => {
                            // Mock calculation for percentage                         
                            const percentValue = parseFloat(percent) / 100;
                            setAmount((totalValue * percentValue).toFixed(4));
                          }}
                        >
                          {percent}
                        </Button>
                      ))}
                  </div>
                </div>

                {/* Total */}
                {amount && (
                  <div className="space-y-2 p-3 bg-secondary/30 rounded-lg">

                    <div className="flex justify-between text-sm">
                      <span>Capital:</span>
                      <span className="font-mono font-medium">
                        ${Number(amount).toFixed(2)} USD
                      </span>
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Maturity Amount:</span>
                      <span className="font-mono font-medium">
                        ${Number((+amount / 100 * +selectedPlan?.profit.split('%')[0]) + +amount).toFixed(2)} USD
                      </span>
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Min:</span>
                      <span className="font-mono">${selectedPlan?.minDeposit}</span>
                    </div>


                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Max:</span>
                      <span className="font-mono">${selectedPlan?.maxDeposit}</span>
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Profit:</span>
                      <span className="font-mono">{selectedPlan?.profit}</span>
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Duration:</span>
                      <span className="font-mono">{selectedPlan?.duration}</span>
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Est. fee:</span>
                      <span className="font-mono">{estimatedFee} USD</span>
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Features:</span>
                      <span className="font-mono">
                        {
                          selectedPlan?.features.map((feat, i) => (
                            <Badge key={i} className="border-2 border-blue-500 text-blue-500" variant="outline">{feat}</Badge>
                          ))
                        }
                      </span>
                    </div>

                  </div>
                )}

                <Button
                  className='w-full trading-button'
                  variant='destructive'
                  onClick={handleInitTrade}
                  disabled={!+amount || +totalValue < +amount || +amount > selectedPlan?.maxDeposit || +amount < selectedPlan?.minDeposit || isInitiatingTrade}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Start Trade
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Open Orders */}
        <Card className="crypto-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Open Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <div className="text-sm">No open orders</div>
              </div>
            ) : (
              <div className="space-y-2">
                {orders.slice(0, 5).map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-2 bg-secondary/20 rounded">
                    <div className='flex'>
                      <div className="text-sm font-medium">
                        <Badge variant='secondary' className="mr-2">
                          Plan: {order.type.toUpperCase()}
                        </Badge>
                        <div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground font-mono text-center">
                        <Badge variant='secondary' className="mr-2">
                          MD: {order.maturity_date}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant='default' className="mr-2">
                      {order.status.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}