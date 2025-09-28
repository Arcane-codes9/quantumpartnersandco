import { useQuery } from '@tanstack/react-query';

// TradingView does not provide a public REST API for rates, but you can use their widget API or a proxy service.
// For demonstration, we'll use CoinGecko as a reliable public API for crypto rates.
// If you want to use TradingView widgets, you must embed them as iframes or scripts in your UI, not fetch rates directly.

export interface RateItem {
    price: number;
    change24h: number;
    changePercent: number;
}

export interface RateResponse {
    [symbol: string]: RateItem;
}

const COINGECKO_IDS = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    SOL: 'solana',
    USDT: 'tether',
};

export const fetchRates = async (): Promise<RateResponse> => {
    const ids = Object.values(COINGECKO_IDS).join(',');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch rates');
    const data = await res.json();
    return {
        BTC: {
            price: data[COINGECKO_IDS.BTC]?.usd ?? 0,
            change24h: data[COINGECKO_IDS.BTC]?.usd_24h_change ?? 0,
            changePercent: (data[COINGECKO_IDS.BTC]?.usd_24h_change ?? 0) / (data[COINGECKO_IDS.BTC]?.usd ?? 1) * 100,
        },
        ETH: {
            price: data[COINGECKO_IDS.ETH]?.usd ?? 0,
            change24h: data[COINGECKO_IDS.ETH]?.usd_24h_change ?? 0,
            changePercent: (data[COINGECKO_IDS.ETH]?.usd_24h_change ?? 0) / (data[COINGECKO_IDS.ETH]?.usd ?? 1) * 100,
        },
        SOL: {
            price: data[COINGECKO_IDS.SOL]?.usd ?? 0,
            change24h: data[COINGECKO_IDS.SOL]?.usd_24h_change ?? 0,
            changePercent: (data[COINGECKO_IDS.SOL]?.usd_24h_change ?? 0) / (data[COINGECKO_IDS.SOL]?.usd ?? 1) * 100,
        },
        USDT: {
            price: data['tether']?.usd ?? 0,
            change24h: data['tether']?.usd_24h_change ?? 0,
            changePercent: (data['tether']?.usd_24h_change ?? 0) / (data['tether']?.usd ?? 1) * 100
        },
    };
};

export function useRate() {
    return useQuery({
        queryKey: ['rates'],
        queryFn: fetchRates,
        staleTime: 60 * 1000,
        refetchInterval: 60 * 1000,
    });
}
