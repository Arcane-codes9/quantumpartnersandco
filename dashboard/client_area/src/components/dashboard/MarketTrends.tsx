import { TrendingUp, TrendingDown, Activity, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CryptoNews from './CryptoNews';
import CryptoHeatMap from './CryptoHeatMap';

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: string;
  marketCap: string;
  isWatchlist?: boolean;
}

const topMovers: MarketData[] = [
  { symbol: 'SOL', name: 'Solana', price: 98.76, change24h: 8.45, volume: '2.1B', marketCap: '45.2B' },
  { symbol: 'AVAX', name: 'Avalanche', price: 35.67, change24h: 6.23, volume: '678M', marketCap: '14.1B' },
  { symbol: 'MATIC', name: 'Polygon', price: 0.785, change24h: 5.89, volume: '456M', marketCap: '7.8B' },
  { symbol: 'ADA', name: 'Cardano', price: 0.485, change24h: -3.21, volume: '890M', marketCap: '17.2B' },
  { symbol: 'DOT', name: 'Polkadot', price: 7.23, change24h: -2.67, volume: '234M', marketCap: '9.1B' },
];

const watchlist: MarketData[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 43250.75, change24h: 2.34, volume: '28.5B', marketCap: '845B', isWatchlist: true },
  { symbol: 'ETH', name: 'Ethereum', price: 2680.42, change24h: -1.23, volume: '12.3B', marketCap: '322B', isWatchlist: true },
  { symbol: 'BNB', name: 'BNB', price: 315.89, change24h: 1.45, volume: '1.2B', marketCap: '47.2B', isWatchlist: true },
];

interface MarketRowProps {
  market: MarketData;
  showWatchlistButton?: boolean;
}

function MarketRow({ market, showWatchlistButton = false }: MarketRowProps) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-secondary/30 rounded-lg transition-colors group">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
          <span className="text-xs font-bold">{market.symbol.charAt(0)}</span>
        </div>
        <div>
          <div className="font-medium">{market.symbol}</div>
          <div className="text-xs text-muted-foreground">{market.name}</div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className="font-mono font-medium">
            ${market.price < 1 ? market.price.toFixed(4) : market.price.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">${market.volume}</div>
        </div>

        <div className={`flex items-center space-x-1 min-w-[80px] justify-end ${market.change24h >= 0 ? 'text-success' : 'text-destructive'
          }`}>
          {market.change24h >= 0 ?
            <TrendingUp className="w-3 h-3" /> :
            <TrendingDown className="w-3 h-3" />
          }
          <span className="font-mono text-sm">
            {market.change24h >= 0 ? '+' : ''}{market.change24h.toFixed(2)}%
          </span>
        </div>

        {showWatchlistButton && (
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Star className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function MarketTrends() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Movers */}
      <Card className="crypto-card">
        <CardContent>
          <CryptoNews />
        </CardContent>
      </Card>

      {/* Watchlist */}
      <Card className="crypto-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-primary" />
            <span>Watchlist</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CryptoHeatMap />
        </CardContent>
      </Card>
    </div>
  );
}