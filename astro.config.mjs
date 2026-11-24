import { defineConfig } from 'astro/config';
export default defineConfig({
  output: 'static',
  outDir: './build',
  publicDir: './public',
  trailingSlash: 'always'
});
