import { useTheme } from '@/hooks/use-theme';
import React, { useEffect, useRef, memo } from 'react';

function TradeChart() {
  const container = useRef<HTMLDivElement>(null);
  const { theme } = useTheme()

  useEffect(
    () => {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "allow_symbol_change": false,
          "calendar": false,
          "details": false,
          "hide_side_toolbar": true,
          "hide_top_toolbar": false,
          "hide_legend": false,
          "hide_volume": false,
          "hotlist": false,
          "interval": "1",
          "locale": "en",
          "save_image": true,
          "style": "1",
          "symbol": "BINANCE:BTCUSDT",
          "theme": ${theme},
          "timezone": "Etc/UTC",
          "backgroundColor": "#141414",
          "gridColor": "rgba(46, 46, 46, 0.06)",
          "watchlist": [],
          "withdateranges": false,
          "compareSymbols": [],
          "studies": [],
          "width": 100%,
          "hight": 440,
        }`;
      container.current?.appendChild(script);
    },
    []
  );

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
      <div className="tradingview-widget-copyright flex items-center justify-start">
        <a href="https://www.tradingview.com/symbols/NASDAQ-AAPL/?exchange=NASDAQ" rel="noopener nofollow" target="_blank">
          {/* <span className="blue-text">Powered by tradeview</span> */}
        </a>
      </div>
    </div>
  );
}

export default memo(TradeChart); 