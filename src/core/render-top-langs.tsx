import * as React from 'react';
import ReactDOMSserver from 'react-dom/server';
import type { LangStat } from './fetch-top-langs';

type Props = {
  langs: LangStat[];
};

const TopLangsSVG: React.FC<Props> = ({ langs }) => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        {`
          .lang-name {
            font: 400 11px 'Segoe UI', Ubuntu, Sans-Serif;
            fill: #000;
            animation: fadeInAnimation 0.8s ease-in-out forwards;
          }
          .lang-rate {
            font: 700 10px 'Segoe UI', Ubuntu, Sans-Serif;
            fill: #000;
            animation: scaleInAnimation 0.4s ease-in-out forwards;
          }
          .rank-text {
            font: 700 24px 'Segoe UI', Ubuntu, Sans-Serif;
            fill: #000;
            animation: scaleInAnimation 0.3s ease-in-out forwards;
          }
          .bar {
            animation: scaleInAnimation 0.4s ease-in-out forwards;
          }
          @keyframes scaleInAnimation {
            from {
              transform: translateY(5px) scale(0);
            }
            to {
              transform: translateY(0px) scale(1);
            }
          }
          @keyframes fadeInAnimation {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}
      </style>
      <rect data-testid="card-bg" x="0.5" y="0.5" rx="4.5" height="99%" stroke="#E4E2E2" width="494" fill="#fffefe" strokeOpacity="1" />
      <g data-testid="main-card-body" transform="translate(0, 5)">
        <g transform="translate(25, 20)">
          <g data-testid="lang-items">
            {langs.map((lang, index) => {
              const { name, rate, color } = lang;
              return (
                <g transform={`translate(0, ${index * 25})`} key={name}>
                  <rect x="0" y="0" width="400" height="18" rx="2" fill="#ededed" />
                  <rect data-testid="lang-progress" x="0" y="0" width={494 * rate} height="18" rx="2" fill={color} />
                  <text x="8" y="12" className="lang-name">
                    {name}
                  </text>
                  <text x="410" y="12" className="lang-rate">
                    {Math.floor(rate * 100)}%
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      </g>
    </svg>
  );
};

export const renderTopLangs = (langs: LangStat[]): string => {
  return ReactDOMSserver.renderToString(<TopLangsSVG langs={langs} />);
};
