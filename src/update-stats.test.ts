import { fetchTopLangs } from './fetch-top-langs';
import { renderTopLangs } from './render-top-langs';
import { type StatsEnv, updateStats } from './update-stats';

vi.mock('./fetch-top-langs', () => ({
	fetchTopLangs: vi.fn().mockResolvedValue([{ name: 'TypeScript', color: '#3178c6', rate: 1 }]),
}));
vi.mock('./render-top-langs', () => ({
	renderTopLangs: vi.fn(({ theme }) => Promise.resolve(`<svg>${theme}</svg>`)),
}));

describe(updateStats.name, () => {
	it('writes both themes to R2', async () => {
		const put = vi.fn().mockResolvedValue(undefined);
		const env = {
			GITHUB_TOKEN: 'token',
			GITHUB_STATS: { put },
		} as unknown as StatsEnv;

		await updateStats(env);

		expect(fetchTopLangs).toHaveBeenCalledOnce();
		expect(fetchTopLangs).toHaveBeenCalledWith({
			username: 'reizt',
			limit: 10,
			githubToken: 'token',
		});
		expect(renderTopLangs).toHaveBeenCalledTimes(2);
		expect(put).toHaveBeenCalledTimes(2);
		expect(put).toHaveBeenCalledWith(
			'langs.light.svg',
			'<svg>light</svg>',
			expect.objectContaining({
				httpMetadata: {
					contentType: 'image/svg+xml',
					cacheControl: 'no-cache',
				},
			}),
		);
		expect(put).toHaveBeenCalledWith(
			'langs.dark.svg',
			'<svg>dark</svg>',
			expect.objectContaining({
				httpMetadata: {
					contentType: 'image/svg+xml',
					cacheControl: 'no-cache',
				},
			}),
		);
	});
});
