import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import TradingViewWidget from './TradingViewWidget';

interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: string;
}

const mockPrices: CryptoPrice[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 43250.75, change24h: 2.34, volume: '$28.5B' },
  { symbol: 'ETH', name: 'Ethereum', price: 2680.42, change24h: -1.23, volume: '$12.3B' },
  { symbol: 'SOL', name: 'Solana', price: 98.76, change24h: 5.67, volume: '$2.1B' },
  { symbol: 'ADA', name: 'Cardano', price: 0.485, change24h: -0.89, volume: '$890M' },
  // { symbol: 'DOT', name: 'Polkadot', price: 7.23, change24h: 3.45, volume: '$456M' },
  // { symbol: 'AVAX', name: 'Avalanche', price: 35.67, change24h: 1.23, volume: '$678M' },
];

export function PriceTicker() {
  const [prices, setPrices] = useState(mockPrices);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prevPrices =>
        prevPrices.map(price => ({
          ...price,
          price: price.price * (1 + (Math.random() - 0.5) * 0.02),
          change24h: price.change24h + (Math.random() - 0.5) * 0.5
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % prices.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [prices.length]);

  return (
    <div className="bg-card border border-border rounded-xl p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">Live Prices</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>

      {/* Desktop view - scrolling ticker */}
      <TradingViewWidget />

      {/* Mobile view - single card carousel */}
      <div className="md:hidden">
        <div className="transition-all duration-500 ease-in-out">
          {prices.map((crypto, index) => (
            <div
              key={crypto.symbol}
              className={`${index === currentIndex ? 'block' : 'hidden'} animate-fade-in`}
            >
              <div className="p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-mono font-bold">{crypto.symbol}</span>
                      <span className="text-sm text-muted-foreground">{crypto.name}</span>
                    </div>
                    <div className="font-mono text-xl font-bold">
                      ${crypto.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: crypto.price < 1 ? 4 : 2
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center space-x-1 ${crypto.change24h >= 0 ? 'text-success' : 'text-destructive'
                      }`}>
                      {crypto.change24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span className="font-mono font-medium">
                        {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{crypto.volume}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="flex justify-center space-x-2 mt-4">
          {prices.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}