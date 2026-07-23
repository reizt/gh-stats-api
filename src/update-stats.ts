import { fetchTopLangs } from './fetch-top-langs';
import { renderTopLangs } from './render-top-langs';

export type StatsEnv = {
	GITHUB_TOKEN: string;
	GITHUB_STATS: R2Bucket;
};

const username = 'reizt';
const themes = ['light', 'dark'] as const;

export async function updateStats(env: StatsEnv) {
	const langs = await fetchTopLangs({
		username,
		limit: 10,
		githubToken: env.GITHUB_TOKEN,
	});
	const objects = await Promise.all(
		themes.map(async (theme) => ({
			key: `langs.${theme}.svg`,
			svg: await renderTopLangs({
				username,
				langs,
				theme,
				output: 'svg',
			}),
		})),
	);
	const updatedAt = new Date().toISOString();
	await Promise.all(
		objects.map(({ key, svg }) =>
			env.GITHUB_STATS.put(key, svg, {
				httpMetadata: {
					contentType: 'image/svg+xml',
					cacheControl: 'no-cache',
				},
				customMetadata: { updatedAt },
			}),
		),
	);
}
