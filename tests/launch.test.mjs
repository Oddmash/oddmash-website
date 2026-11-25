import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

test('launch metadata only uses an explicitly enabled valid HTTPS origin',()=>{
  const output=mkdtempSync(join(tmpdir(),'oddmash-site-launch-'));
  const read=path=>readFileSync(join(output,path),'utf8');
  const build=(origin,launch)=>{
    const result=spawnSync(process.execPath,['node_modules/astro/bin/astro.mjs','build','--outDir',output],{env:{...process.env,ODDMASH_SITE_ORIGIN:origin,ODDMASH_PUBLIC_LAUNCH:launch},encoding:'utf8'});
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
    assert.match(page,/property="og:image" content="https:\/\/studio\.example\.test\/assets\/juliya-live\.png"/);
    assert.match(page,/property="og:image:alt"/);
    assert.match(read('projects/boundra/index.html'),/property="og:image" content="https:\/\/studio\.example\.test\/assets\/social\.png"/);
    assert.equal((page.match(/rel="alternate" hreflang=/g)??[]).length,5);
    assert.equal((read('sitemap.xml').match(/<loc>/g)??[]).length,192);
    assert.match(read('robots.txt'),/Sitemap: https:\/\/studio\.example\.test\/sitemap\.xml/);
    assert.match(read('404.html'),/noindex, nofollow/);
  }finally{rmSync(output,{recursive:true,force:true});}
});
