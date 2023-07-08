import * as React from 'react';
import ReactDOMSserver from 'react-dom/server';
import type { LangStat } from './fetch-top-langs';

type Props = {
  userName: string;
  langs: LangStat[];
};

const TopLangsSVG: React.FC<Props> = ({ userName, langs }) => {
  return (
    <div
      style={{
        fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
        width: '300px',
      }}
    >
      <style>
        {`
          .lang-link:hover, .lang-link:hover span {
            color: #2f81f7 !important;
          }
        `}
      </style>
      <div style={{ display: 'flex', marginBottom: '10px', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
        {langs.map((lang) => (
          <div key={lang.name} style={{ width: `${lang.rate * 100}%`, height: '100%', backgroundColor: lang.color }}></div>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {langs.map((lang) => (
          <a
            href={`https://github.com/search?q=user%3A${userName}++language%3A${lang.name}&type=code`}
            key={lang.name}
            className="lang-link"
            style={{ display: 'flex', alignItems: 'center', columnGap: '5px', color: '#fff', textDecoration: 'none' }}
          >
            <span style={{ width: '16px', height: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '8px' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: lang.color, borderRadius: '100%' }} />
            </span>
            <span style={{ fontWeight: 'bold', marginRight: '4px' }}>{lang.name}</span>
            <span style={{ color: '#7d8590' }}>{`${(lang.rate * 100).toFixed(1)}%`}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export const renderTopLangs = (userName: string, langs: LangStat[]): string => {
  return ReactDOMSserver.renderToString(<TopLangsSVG userName={userName} langs={langs} />);
};
