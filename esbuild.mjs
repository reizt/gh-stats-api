import { build } from 'esbuild';
import pkg from './package.json' assert { type: 'json' };

/** @type {import('esbuild').BuildOptions} */
const opts = {
  target: 'es2022',
  platform: 'node',
  color: true,
  bundle: true,
};

const mode = process.argv[2];
if (mode === 'launch') {
  opts.entryPoints = ['./src/tasks/launch.ts'];
  opts.outfile = './.build/launch.js';
  opts.minify = false;
  opts.sourcemap = true;
  opts.external = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];
} else if (mode === 'vercel') {
  opts.entryPoints = ['./src/tasks/vercel.ts'];
  opts.outfile = './api/vercel.js';
  opts.minify = true;
  opts.sourcemap = false;
} else {
  throw new Error(`Invalid mode: ${mode}`);
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
