import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import type { LangStat } from './fetch-top-langs';
import { renderTopLangs } from './render-top-langs';

vi.mock('./fonts/roboto-bold.ttf', () => {
	const buffer = readFileSync(new URL('./fonts/roboto-bold.ttf', import.meta.url));
	return { default: buffer };
});
vi.mock('./fonts/roboto-regular.ttf', () => {
	const buffer = readFileSync(new URL('./fonts/roboto-regular.ttf', import.meta.url));
	return { default: buffer };
});

describe(renderTopLangs.name, () => {
	const langs: LangStat[] = [
		{
			name: 'TypeScript',
			color: '#3178c6',
			rate: 0.5,
		},
		{
			name: 'JavaScript',
			color: '#f1e05a',
			rate: 0.3,
		},
		{
			name: 'Python',
			color: '#3572a5',
			rate: 0.2,
		},
	];
	mkdirSync(path.join(process.cwd(), 'tmp'), { recursive: true });

	it('should render top langs as html', async () => {
		const html = await renderTopLangs({
			langs,
			output: 'html',
			theme: 'light',
			username: 'reizt',
		});
		expect(html).toBeDefined();
		writeFileSync(path.join(process.cwd(), 'tmp/index.html'), html);
	});
	it('should render top langs as svg', async () => {
		const svg = await renderTopLangs({
			langs,
			output: 'svg',
			theme: 'light',
			username: 'reizt',
		});
		expect(svg).toBeDefined();
		writeFileSync(path.join(process.cwd(), 'tmp/index.svg'), svg);
	});
});
