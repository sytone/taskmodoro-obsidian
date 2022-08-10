import process from 'process';
import esbuild from 'esbuild';
import builtins from 'builtin-modules';
import esbuildSvelte from 'esbuild-svelte';
import sveltePreprocess from 'svelte-preprocess';
import inlineWorkerPlugin from 'esbuild-plugin-inline-worker';

const banner = ``;

const prod = process.argv[2] === 'production';
const dev = process.argv[2] === 'development';

esbuild
  .build({
    banner: {
      js: banner,
    },
    bundle: true,
    entryPoints: ['./src/main.ts'],
    external: ['obsidian', 'electron', ...builtins],
    loader: { '.mp3': 'base64' },
    format: 'cjs',
    logLevel: 'info',
    minify: prod ? true : false,
    outfile: 'main.js',
    plugins: [
      esbuildSvelte({
        compilerOptions:{ css: true },
        preprocess: sveltePreprocess(),
      }),
      inlineWorkerPlugin(),
    ],
    sourcemap: 'inline',
    target: 'es2016',
    treeShaking: true,
    watch: !prod && !dev,
  })
  .catch(() => process.exit(1));
