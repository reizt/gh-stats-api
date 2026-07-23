const result = await Bun.build({
	entrypoints: ['src/index.ts'],
	outdir: 'dist',
	target: 'browser',
	format: 'esm',
	minify: true,
	plugins: [
		{
			name: 'ttf',
			setup(build) {
				build.onLoad({ filter: /\.ttf$/ }, async ({ path }) => {
					const base64 = (await Bun.file(path).bytes()).toBase64();
					return {
						contents: `export default ${JSON.stringify(base64)};`,
						loader: 'js',
					};
				});
			},
		},
	],
});

if (!result.success) {
	throw new AggregateError(result.logs, 'Build failed');
}
