import { useTheme } from '@/hooks/use-theme';
import React, { useEffect, useRef, memo } from 'react';

function CryptoHeatMap() {
    const container = useRef<HTMLDivElement>(null);
    const { theme } = useTheme()

    useEffect(
        () => {
            const script = document.createElement("script");
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js";
            script.type = "text/javascript";
            script.async = true;
            script.innerHTML = `
        {
          "dataSource": "Crypto",
          "blockSize": "market_cap_calc",
          "blockColor": "24h_close_change|5",
          "locale": "en",
          "symbolUrl": "",
          "colorTheme": ${theme},
          "hasTopBar": false,
          "isDataSetEnabled": false,
          "isZoomEnabled": true,
          "hasSymbolTooltip": true,
          "isMonoSize": false,
          "width": "100%",
          "height": "550"
        }`;
            container.current?.appendChild(script);
        },
        []
    );

    return (
        <div className="tradingview-widget-container" ref={container}>
            <div className="tradingview-widget-container__widget"></div>
            <div className="tradingview-widget-copyright">
                <a href="https://www.tradingview.com/markets/cryptocurrencies/" rel="noopener nofollow" target="_blank">
                    {/* <span className="blue-text">Crypto coins heatmap by TradingView</span> */}
                </a>
            </div>
        </div>
    );
}

export default memo(CryptoHeatMap);