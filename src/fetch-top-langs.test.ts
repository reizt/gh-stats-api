import { fetchTopLangs } from './fetch-top-langs';

describe(fetchTopLangs.name, () => {
	it('should fetch top langs', async () => {
		const langs = await fetchTopLangs({
			username: 'reizt',
			limit: 5,
		});
		expect(langs).toBeDefined();
	});
});
