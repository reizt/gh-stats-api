import { Hono } from 'hono';
import { z } from 'zod';
import { fetchTopLangs } from './fetch-top-langs';
import { renderTopLangs } from './render-top-langs';

const app = new Hono();

app.use('*', async (c, next) => {
	try {
		return await next();
	} catch (error) {
		console.error('❌ error:', error);
		return c.text('Internal Server Error', 500);
	}
});

const inputZ = z.object({
	username: z.string(),
	output: z.enum(['svg', 'html']),
	theme: z.enum(['light', 'dark']),
	limit: z.coerce.number().int(),
	ignore: z.array(z.string()).optional(),
	githubToken: z.string().optional(),
});
type Input = z.infer<typeof inputZ>;

app.get('/:username', async (c) => {
	const unsafeInput: { [K in keyof Input]: unknown } = {
		username: c.req.param('username'),
		output: c.req.query('output') ?? 'svg',
		theme: c.req.query('theme') ?? 'light',
		limit: c.req.query('limit') ?? 10,
		ignore: c.req.query('ignore')?.split(','),
		githubToken: c.req.header('x-gh-token') ?? undefined,
	};
	const input = inputZ.parse(unsafeInput);
	console.log('✅ input:', input);

	const langs = await fetchTopLangs({
		username: input.username,
		limit: input.limit,
		ignore: input.ignore,
		githubToken: input.githubToken,
	});
	const content = await renderTopLangs({
		langs,
		output: input.output,
		theme: input.theme,
		username: input.username,
	});

	return new Response(content, {
		status: 200,
		headers: {
			'Content-Type': { svg: 'image/svg+xml', html: 'text/html' }[input.output],
		},
	});
});

export default app;
