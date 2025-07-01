import esbuild from 'esbuild';

esbuild.build({
	entryPoints: ['src/index.ts'],
	bundle: true,
	minify: true,
	loader: {
		'.ttf': 'binary',
	},
	outdir: 'dist',
});
