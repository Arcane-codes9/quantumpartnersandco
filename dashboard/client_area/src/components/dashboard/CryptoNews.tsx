import { useTheme } from '@/hooks/use-theme';
import { useEffect, useRef, memo } from 'react';

function CryptoNews() {
  const container = useRef<HTMLDivElement>(null);
  const { theme } = useTheme()

  useEffect(
    () => {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "displayMode": "regular",
          "feedMode": "all_symbols",
          "colorTheme": ${theme},
          "isTransparent": false,
          "locale": "en",
          "width": "100%",
          "height": "100%"
        }`;
      container.current?.appendChild(script);
    },
    []
  );

  return (
    <div className="space-y-4 flex flex-col w-full h-[580px] whitespace-nowrap">
      <div className="tradingview-widget-container" ref={container}>
        <div className="tradingview-widget-container__widget"></div>
        <div className="tradingview-widget-copyright">
          <a href="https://www.tradingview.com/news-flow/?priority=top_stories" rel="noopener nofollow" target="_blank">
            {/* <span className="blue-text">Top stories by TradingView</span> */}
          </a>
        </div>
      </div>
    </div>

  );
}

export default memo(CryptoNews);