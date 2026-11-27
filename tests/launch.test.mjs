import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

test('launch metadata only uses an explicitly enabled valid HTTPS origin',()=>{
  const output=mkdtempSync(join(tmpdir(),'oddmash-site-launch-'));
  const read=path=>readFileSync(join(output,path),'utf8');
  const build=(origin,launch,pages='false')=>{
    const result=spawnSync(process.execPath,['node_modules/astro/bin/astro.mjs','build','--outDir',output],{env:{...process.env,ODDMASH_SITE_ORIGIN:origin,ODDMASH_PUBLIC_LAUNCH:launch,ODDMASH_PAGES_BUILD:pages},encoding:'utf8'});
    assert.equal(result.status,0,result.stderr || result.stdout);
  };
  try{
    build('https://studio.example.test','false');
    assert.match(read('index.html'),/noindex, nofollow/);
    assert.doesNotMatch(read('index.html'),/rel="canonical"/);
    assert.doesNotMatch(read('sitemap.xml'),/<loc>/);
    build('http://studio.example.test','true');
    assert.match(read('index.html'),/noindex, nofollow/);
    assert.match(read('robots.txt'),/Disallow: \//);
    build('https://studio.example.test','true');
    const page=read('ko/projects/juliya/index.html');
    assert.match(page,/content="index, follow"/);
    assert.match(page,/rel="canonical" href="https:\/\/studio\.example\.test\/ko\/projects\/juliya\/"/);
    assert.match(page,/property="og:image" content="https:\/\/studio\.example\.test\/assets\/juliya-live-ko\.png"/);
    for(const [prefix,locale] of [['','en'],['ja/','ja'],['zh-cn/','zh-cn']]){
      assert.ok(read(prefix+'projects/juliya/index.html').includes(`property="og:image" content="https://studio.example.test/assets/juliya-live-${locale}.png"`));
    }
    assert.match(page,/property="og:image:alt"/);
    assert.match(read('projects/boundra/index.html'),/property="og:image" content="https:\/\/studio\.example\.test\/assets\/social\.png"/);
    assert.equal((page.match(/rel="alternate" hreflang=/g)??[]).length,5);
    assert.equal((read('sitemap.xml').match(/<loc>/g)??[]).length,192);
    assert.match(read('robots.txt'),/Sitemap: https:\/\/studio\.example\.test\/sitemap\.xml/);
    assert.match(read('404.html'),/noindex, nofollow/);
    const pickerOptions = html => {
      const raw = html.match(/data-locale-picker="([^"]+)"/)?.[1];
      assert.ok(raw);
      return JSON.parse(raw.replace(/&quot;|&#34;|&#x22;/gi, '"').replace(/&amp;/g, '&')).options;
    };
    assert.deepEqual(pickerOptions(page).map(option => option.href), ['/projects/juliya/', '/ko/projects/juliya/', '/ja/projects/juliya/', '/zh-cn/projects/juliya/']);
    build('https://oddmash.github.io','true','true');
    const prefixes = ['', '/ko', '/ja', '/zh-cn'];
    for (const prefix of prefixes) {
      const detail = read((prefix ? prefix.slice(1) + '/' : '') + 'projects/juliya/index.html');
      assert.deepEqual(pickerOptions(detail).map(option => option.href), prefixes.map(lang => '/oddmash-website' + lang + '/projects/juliya/'));
    }
    assert.deepEqual(pickerOptions(read('index.html')).map(option => option.href), ['/oddmash-website/?lang=en', '/oddmash-website/ko/', '/oddmash-website/ja/', '/oddmash-website/zh-cn/']);
  }finally{rmSync(output,{recursive:true,force:true});}
});
