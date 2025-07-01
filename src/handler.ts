import { z } from 'zod';
import { fetchTopLangs } from './fetch-top-langs';
import { renderTopLangs } from './render-top-langs';

const inputZ = z.object({
	username: z.string(),
	output: z.enum(['svg', 'html']),
	theme: z.enum(['light', 'dark']),
	limit: z.coerce.number().int(),
	ignore: z.array(z.string()).optional(),
	githubToken: z.string().optional(),
});
type Input = z.infer<typeof inputZ>;

export async function handler(req: Request) {
	try {
		const query = new URL(req.url).searchParams;
		const unsafeInput: { [K in keyof Input]: unknown } = {
			username: query.get('username'),
			output: query.get('output') ?? 'svg',
			theme: query.get('theme') ?? 'light',
			limit: query.get('limit') ?? 10,
			ignore: query.get('ignore')?.split(','),
			githubToken: req.headers.get('x-gh-token') ?? undefined,
		};
		console.log('✅ unsafeInput:', unsafeInput);
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
	} catch (err) {
		if (err instanceof z.ZodError) {
			console.log(err.issues);
			return new Response(JSON.stringify(err.issues), { status: 422 });
		}
		console.log(err);

		return new Response('Internal Server Error', { status: 500 });
	}
}
