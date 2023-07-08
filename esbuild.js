const { build } = require('esbuild');
const { resolve } = require('path');
const { vanillaExtractPlugin } = require('@vanilla-extract/esbuild-plugin');

/** @type {import('esbuild').BuildOptions} */
const opts = {
  tsconfig: resolve(__dirname, './tsconfig.json'),
  platform: 'node',
  define: { 'process.env.NODE_ENV': `"${process.env.NODE_ENV}"` },
  plugins: [vanillaExtractPlugin()],
  color: true,
  bundle: true,
};

const env = process.argv[2];
if (env === 'development') {
  opts.entryPoints = [resolve(__dirname, './src/tasks/launch.ts')];
  opts.outfile = resolve(__dirname, './dist/development.js');
  opts.minify = false;
  opts.sourcemap = true;
  // opts.external = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];
} else if (env === 'production') {
  opts.entryPoints = [resolve(__dirname, './src/tasks/vercel.ts')];
  opts.outfile = resolve(__dirname, './api/production.js');
  opts.minify = true;
  opts.sourcemap = false;
  // opts.external = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];
} else {
  throw new Error(`Invalid env: ${env}`);
}

build(opts)
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
