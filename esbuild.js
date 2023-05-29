const pkg = require('./package.json');
const { build } = require('esbuild');
const { resolve } = require('path');

/** @type {import('esbuild').BuildOptions} */
const options = {
  entryPoints: [resolve(__dirname, './src/index.ts')],
  define: { 'process.env.NODE_ENV': `"${process.env.NODE_ENV}"` },
  target: 'es2022',
  platform: 'node',
  color: true,
  bundle: true,
};

const env = process.argv[2];
if (env === 'development') {
  options.outfile = resolve(__dirname, './dist/development.js');
  options.minify = false;
  options.sourcemap = true;
  options.external = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];
} else if (env === 'production') {
  options.outfile = resolve(__dirname, './dist/production.js');
  options.minify = true;
  options.sourcemap = false;
} else {
  throw new Error(`Invalid env: ${env}`);
}

build(options)
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
