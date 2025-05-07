// biome-ignore lint/style/useImportType: <explanation>
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import satori from 'satori';
import type { LangStat } from './fetch-top-langs';

type Props = {
	username: string;
	langs: LangStat[];
	theme: 'light' | 'dark';
};

const TopLangsSVG: React.FC<Props> = ({ username, langs, theme }) => {
	return (
		<div
			style={{
				width: '375px',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<div style={{ display: 'flex', marginBottom: '10px', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
				{langs.map((lang) => (
					<div key={lang.name} style={{ width: `${lang.rate * 100}%`, height: '100%', backgroundColor: lang.color }} />
				))}
			</div>
			<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
				{langs.map((lang) => (
					<a
						href={`https://github.com/search?q=${encodeURIComponent(`user:${username}++language:${lang.name}`)}&type=code`}
						key={lang.name}
						style={{ display: 'flex', alignItems: 'center', columnGap: '5px', textDecoration: 'none' }}
					>
						<span style={{ width: '16px', height: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '8px' }}>
							<span style={{ width: '8px', height: '8px', backgroundColor: lang.color, borderRadius: '100%' }} />
						</span>
						<span
							style={{
								fontFamily: 'Roboto',
								fontWeight: 'bold',
								color: theme === 'light' ? '#24292f' : '#fff',
								marginRight: '4px',
							}}
						>
							{lang.name}
						</span>
						<span
							style={{
								fontFamily: 'Roboto',
								fontWeight: 'normal',
								color: theme === 'light' ? '#57606a' : '#7d8590',
							}}
						>
							{`${(lang.rate * 100).toFixed(1)}%`}
						</span>
					</a>
				))}
			</div>
		</div>
	);
};

const fetchFont = async (url: string) => {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to fetch font from ${url}`);
	}
	const buffer = await response.arrayBuffer();
	return buffer;
};

export const renderTopLangs = async ({ output, ...props }: Props & { output: 'html' | 'svg' }) => {
	const reactNode = <TopLangsSVG {...props} />;
	switch (output) {
		case 'html': {
			const html = ReactDOMServer.renderToString(
				<html lang="en">
					<head>
						<meta charSet="UTF-8" />
						<meta name="viewport" content="width=device-width, initial-scale=1.0" />
						<title>Languages</title>
						<style>{`body { margin: 0; font-family: 'Roboto', sans-serif; }`}</style>
					</head>
					<body>{reactNode}</body>
				</html>,
			);
			return html;
		}
		case 'svg': {
			const fontUrlRoot = 'https://fonts.werp.in';
			const robotoRegularFont = await fetchFont(`${fontUrlRoot}/Roboto-Regular.ttf`);
			const robotoBoldFont = await fetchFont(`${fontUrlRoot}/Roboto-Bold.ttf`);
			const svg = await satori(reactNode, {
				fonts: [
					{
						name: 'Roboto',
						data: robotoRegularFont,
						weight: 400,
						style: 'normal',
					},
					{
						name: 'Roboto',
						data: robotoBoldFont,
						weight: 700,
						style: 'normal',
					},
				],
				width: 375,
				height: 200,
			});
			return svg;
		}
		default:
			throw new Error(`Unknown output type: ${output}`);
	}
};
