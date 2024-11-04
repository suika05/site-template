// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { ViteEjsPlugin } from "vite-plugin-ejs";
import { globSync } from 'glob';
import sassGlobImports from 'vite-plugin-sass-glob-import';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const jsFiles = Object.fromEntries(
  globSync('src/**/*.js', { ignore: ['node_modules/**','**/modules/**','**/dist/**']}).map(file => [
    path.relative(
      'src',
      file.slice(0, file.length - path.extname(file).length)
    ),
    fileURLToPath(new URL(file, import.meta.url))
  ])
);

const scssFiles = Object.fromEntries(
  globSync('src/**/*.scss', { ignore: ['src/**/_*.scss'] }).map(file => [
    path.relative(
      'src',
      file.slice(0, file.length - path.extname(file).length)
    ),
    fileURLToPath(new URL(file, import.meta.url))
  ])
);

const htmlFiles = Object.fromEntries(
  globSync('src/**/*.html', { ignore: ['node_modules/**', '**/dist/**'] }).map(file => [
    path.relative(
      'src',
      file.slice(0, file.length - path.extname(file).length)
    ),
    fileURLToPath(new URL(file, import.meta.url))
  ])
);

const inputObject = { ...scssFiles, ...jsFiles, ...htmlFiles };

export default defineConfig({
  root: 'src',
  publicDir: 'public',
  
  build: {
    sourcemap: false,
    outDir: '../dist',
    emptyOutDir: true,
    copyPublicDir: true,

    rollupOptions: {
      input: inputObject,
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: (assetInfo) => {
          if (/\.(gif|jpeg|jpg|png|svg|webp| )$/.test(assetInfo.name)) {
            return 'assets/img/[name][extname]';
          } else if(/\.(mp4|webm| )$/.test(assetInfo.name)) {
            return 'assets/video/[name][extname]';
          } else if(/\.(mp3|m4a|oog|flac|wav|midi|mzo| )$/.test(assetInfo.name)) {
            return 'assets/audio/[[name][extname]';
          }
          return '[name][extname]';
        },

      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
  plugins: [
    ViteEjsPlugin(),
    sassGlobImports(),
  ],
});