import { defineConfig } from 'astro/config';
export default defineConfig({
  output: 'static',
  outDir: './build',
  publicDir: './public',
  trailingSlash: 'always',
  redirects: Object.fromEntries(['','/ko','/ja','/zh-cn'].map(prefix=>[prefix+'/projects/kowrap/',prefix+'/projects/juliya/']))
});
