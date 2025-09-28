import { useTheme } from '@/hooks/use-theme';
import React, { useEffect, useRef, memo } from 'react';

function CryptoMarket() {
  const container = useRef<HTMLDivElement>(null);
  const { theme } = useTheme()

  useEffect(
    () => {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "defaultColumn": "overview",
          "screener_type": "crypto_mkt",
          "displayCurrency": "USD",
          "colorTheme": ${theme},
          "isTransparent": true,
          "locale": "en",
          "width": "100%",
          "height": "100%"
        }`;
      container.current?.appendChild(script);
    },
    []
  );

  return (
    <div className="space-y-4 flex flex-col w-full h-[375px] overflow-x-auto whitespace-nowrap">
      <div className="tradingview-widget-container min-w-[1500px]" ref={container}>
        <div className="tradingview-widget-container__widget"></div>
        <div className="tradingview-widget-copyright flex justify-start items-center">
          <a href="https://www.tradingview.com/crypto-coins-screener/" rel="noopener nofollow" target="_blank">
            {/* <span className="blue-text">powered by TradingView</span> */}
          </a>
        </div>
      </div>
    </div>
  );
}

export default memo(CryptoMarket); 