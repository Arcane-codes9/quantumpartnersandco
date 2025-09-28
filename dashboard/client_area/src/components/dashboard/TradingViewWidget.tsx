import { useTheme } from '@/hooks/use-theme';
import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget() {
  const container = useRef<HTMLDivElement>(null);
  const { theme } = useTheme()

  useEffect(
    () => {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "symbols": [
            {
              "proName": "BINANCE:BTCUSD",
              "title": "BTC"
            },
            {
              "proName": "BINANCE:LTCUSDT",
              "title": "LTC"
            },
            {
              "proName": "OKX:SOLUSDT",
              "title": "Solana"
            },
            {
              "proName": "BINANCE:XRPUSDT",
              "title": "xrp"
            },
            {
              "proName": "BINANCE:TRXUSDT",
              "title": "Tron"
            },
            {
              "proName": "BINANCE:DOGEUSDT",
              "title": "DogeCoin"
            },
            {
              "proName": "BINANCE:BNBUSDT",
              "title": "Bnb"
            },
            {
              "proName": "BINANCE:USDCUSDT",
              "title": "Usdc"
            },
            {
              "proName": "BINANCE:NEARUSDT",
              "title": "Near"
            }
          ],
          "colorTheme": ${theme},
          "locale": "en",
          "largeChartUrl": "",
          "isTransparent": true,
          "showSymbolLogo": true,
          "displayMode": "adaptive"
        }`;
      container.current?.appendChild(script);
    },
    []
  );

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright flex items-center justify-start">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          {/* <span className="blue-text">By TradingView</span> */}
        </a>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget); 