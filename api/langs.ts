import { z } from 'zod';
import { fetchTopLangs } from './fetch-top-langs';
import { renderTopLangs } from './render-top-langs';

export const config = {
	runtime: 'edge',
};

const inputZ = z.object({
	username: z.string(),
	output: z.enum(['svg', 'html']),
	theme: z.enum(['light', 'dark']),
	limit: z.coerce.number().int(),
});
type Input = z.infer<typeof inputZ>;

export default async function (req: Request) {
	try {
		const query = new URL(req.url).searchParams;
		const unsafeInput: { [K in keyof Input]: unknown } = {
			username: query.get('username'),
			output: query.get('output') ?? 'svg',
			theme: query.get('theme') ?? 'light',
			limit: query.get('limit') ?? 10,
		};
		const input = inputZ.parse(unsafeInput);
		const langs = await fetchTopLangs({
			username: input.username,
			limit: input.limit,
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
