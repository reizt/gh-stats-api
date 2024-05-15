import { build } from 'esbuild';
import pkg from './package.json' assert { type: 'json' };

/** @type {import('esbuild').BuildOptions} */
const opts = {
	target: 'es2022',
	platform: 'node',
	color: true,
	bundle: true,
};

const deps = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies, ...pkg.devDependencies });

const mode = process.argv[2];
if (mode === 'dev-server') {
	opts.entryPoints = ['./src/tasks/launch.ts'];
	opts.outfile = './tmp/dev-server.cjs';
	opts.minify = false;
	opts.sourcemap = true;
	opts.external = deps;
} else {
	opts.entryPoints = ['./src/tasks/vercel.ts'];
	opts.outfile = './api/vercel.js';
	opts.minify = true;
	opts.sourcemap = false;
}

try {
	const start = Date.now();
	console.log(`Building... (mode: ${mode})`);
	await build(opts);
	console.log(`Done! (${Date.now() - start}ms)`);
	process.exit(0);
} catch (err) {
	console.log('Build failed!');
	console.error(err);
	process.exit(1);
}
