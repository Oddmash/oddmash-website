import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const prefixes=['','ko/','ja/','zh-cn/'];
const langs=['en','ko','ja','zh-CN'];
const pages=['','studio/','privacy/','projects/kowrap/','projects/oddmash-ui/','projects/interaction-inspector/','projects/boundra/'];
test('all locale paths contain static copy, correct metadata and local assets',()=>{
  for(const [i,prefix] of prefixes.entries()) for(const path of pages){
    const html=readFileSync('build/'+prefix+path+'index.html','utf8');
    assert.match(html,new RegExp('<html lang="'+langs[i]+'"'));
    assert.match(html,/<h1[ >]/);
    assert.match(html,/noindex, nofollow/);
    assert.doesNotMatch(html,/rel="canonical"|chatgpt\.site/);
    for(const [,link] of html.matchAll(/(?:href|src|srcset)="(\/[^"#?]*)"/g)){
      assert.ok(existsSync('build'+link)||existsSync('build'+link+'index.html'),link);
    }
    for(const [,tag] of html.matchAll(/(<img\b[^>]*>)/g)){
      assert.match(tag,/\balt=/);
      assert.match(tag,/\bwidth=/);
      assert.match(tag,/\bheight=/);
    }
  }
});
test('preview robots and sitemap never reveal public routes',()=>{
  assert.match(readFileSync('build/robots.txt','utf8'),/Disallow: \//);
  assert.doesNotMatch(readFileSync('build/sitemap.xml','utf8'),/<loc>/);
  assert.ok(existsSync('build/404.html'));
  assert.ok(existsSync('build/privacy.html'));
  const legacy=readFileSync('build/privacy.html','utf8');
  assert.match(legacy,/<noscript><meta http-equiv="refresh" content="0; url=\/privacy\/">/);
  for(const prefix of prefixes) assert.match(legacy,new RegExp(`href="/${prefix}privacy/"`));
});
test('excluded project has no public pages or image',()=>{
  for(const prefix of prefixes){
    assert.ok(!existsSync('build/'+prefix+'projects/vertactics/'));
    assert.doesNotMatch(readFileSync('build/'+prefix+'index.html','utf8'),/vertactics/i);
  }
  assert.ok(!existsSync('build/assets/vertactics.jpg'));
});
