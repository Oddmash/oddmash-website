import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const prefixes=['','ko/','ja/','zh-cn/'];
const langs=['en','ko','ja','zh-CN'];
const pages=['','projects/','studio/','contribute/','privacy/','agents/',...['lead','impact','triage','qa','docs','architect','release'].map(id=>'agents/'+id+'/'),'projects/kowrap/','projects/oddmash-ui/','projects/interaction-inspector/','projects/boundra/'];
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

test('the public workflow contains only local agent artwork and no private repository links',()=>{
  for(const prefix of prefixes){
    const html=readFileSync('build/'+prefix+'index.html','utf8');
    assert.doesNotMatch(html,/github\.com\/Oddmash\/oddmash-(agents|skills)\/[^" ]*(?:\.env|secret|credential)/i);
    assert.doesNotMatch(html,/id="project-index"/);
    assert.equal([...html.matchAll(/data-film-step="[0-5]"/g)].length,6);
    for(const agent of ['lead','impact','triage','qa','docs','architect','release']){
      assert.ok(html.includes('/assets/agents/'+agent+'.svg'),agent);
    }
  }
  for(const agent of ['lead','impact','triage','qa','docs','architect','release']){
    const svg=readFileSync('build/assets/agents/'+agent+'.svg','utf8');
    assert.doesNotMatch(svg,/<(?:script|foreignObject)\b|\b(?:href|onload|onclick)\s*=/i);
  }
});

test('the standalone localized catalog contains all projects without workflow duplication',()=>{
  for(const prefix of prefixes){
    const catalog=readFileSync('build/'+prefix+'projects/index.html','utf8');
    assert.equal([...catalog.matchAll(/class="catalog-entry"/g)].length,4);
    assert.doesNotMatch(catalog,/id="workflow"/);
    const home=readFileSync('build/'+prefix+'index.html','utf8');
    assert.ok(home.includes(`href="/${prefix}projects/"`));
  }
});


test('all localized agent documentation pages are linked without private implementation links',()=>{
  for(const prefix of prefixes){
    const home=readFileSync('build/'+prefix+'index.html','utf8');
    assert.ok(home.includes('href="/'+prefix+'agents/"'));
    const overview=readFileSync('build/'+prefix+'agents/index.html','utf8');
    for(const role of ['lead','impact','triage','qa','docs','architect','release']){
      assert.ok(overview.includes('href="/'+prefix+'agents/'+role+'/"'));
      const detail=readFileSync('build/'+prefix+'agents/'+role+'/index.html','utf8');
      assert.doesNotMatch(detail,/github\.com\/Oddmash\/oddmash-(agents|skills)\/[^" ]*(?:\.env|secret|credential)/i);
    }
  }
});


test('public workflow resources are discoverable from each locale',()=>{
  for(const prefix of prefixes){
    const home=readFileSync('build/'+prefix+'index.html','utf8');
    const catalog=readFileSync('build/'+prefix+'projects/index.html','utf8');
    assert.ok(home.includes('href="/'+prefix+'skills/"'));
    assert.ok(catalog.includes('href="/'+prefix+'skills/"'));
    assert.ok(catalog.includes('https://github.com/Oddmash/oddmash-agents'));
  }
});


test('all localized skills have on-site reference pages',()=>{
  for(const prefix of prefixes){
    const catalog=readFileSync('build/'+prefix+'skills/index.html','utf8');
    const links=[...catalog.matchAll(new RegExp('href="/'+prefix+'skills/([a-z-]+)/"','g'))].map(m=>m[1]);
    assert.equal(new Set(links).size,30);
    for(const id of new Set(links)){
      const detail=readFileSync('build/'+prefix+'skills/'+id+'/index.html','utf8');
      assert.match(detail,/skill-reference/);
      assert.match(detail,/data-copy="markdown"/);
      assert.match(detail,/id="skill-install"/);
      assert.doesNotMatch(detail,/>MIT License</);
    }
  }
});


test('the skill source license remains available as a distribution asset',()=>{
  assert.ok(existsSync('build/licenses/oddmash-skills.txt'));
});
