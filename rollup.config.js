import autoPreprocess from 'svelte-preprocess';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';
import typescript from '@rollup/plugin-typescript';
import url from '@rollup/plugin-url'

const isProd = process.env.BUILD === 'production';

export default {
  input: 'src/main.ts',
  output: {
    dir: '.',
    sourcemap: 'inline',
    sourcemapExcludeSources: isProd,
    format: 'cjs',
    exports: 'default',
  },
  external: ['obsidian'],
  plugins: [
    svelte({
      emitCss: false,
      preprocess: autoPreprocess(),
    }),
    typescript({ sourceMap: true }),
    nodeResolve({
      browser: true,
      dedupe: ['svelte'],
    }),
    url({
      fileName: '[name][extname]',
      include: ['**/*.mp3'],
      limit: 100000
    }),
    commonjs({
      include: 'node_modules/**',
    }),
  ],
};
