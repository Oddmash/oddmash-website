import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const prefixes=['','ko/','ja/','zh-cn/'];
const langs=['en','ko','ja','zh-CN'];
const pages=['','projects/','studio/','contribute/','privacy/','agents/',...['lead','impact','triage','qa','docs','architect','release'].map(id=>'agents/'+id+'/'),'projects/juliya/','projects/oddmash-ui/','projects/interaction-inspector/','projects/boundra/'];
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
  const notFound=readFileSync('build/404.html','utf8');
  assert.match(notFound,/<h1[^>]*>404<\/h1>/);
  assert.match(notFound,/<a class="button primary" href="\/">Oddmash home<\/a>/);
  assert.ok(existsSync('build/privacy.html'));
  const legacy=readFileSync('build/privacy.html','utf8');
  assert.match(legacy,/<noscript><meta http-equiv="refresh" content="0; url=\/privacy\/">/);
  for(const prefix of prefixes) assert.match(legacy,new RegExp(`href="/${prefix}privacy/"`));
});
test('project detail pages explain the product and keep footer navigation focused',()=>{
  const projects=['juliya','oddmash-ui','interaction-inspector','boundra'];
  for(const prefix of prefixes){
    const home=readFileSync('build/'+prefix+'index.html','utf8');
    assert.doesNotMatch(home.match(/<footer\b[\s\S]*?<\/footer>/)?.[0]??'',/id="share"|id="share-fallback"/);
    for(const project of projects){
      const html=readFileSync('build/'+prefix+'projects/'+project+'/index.html','utf8');
      assert.match(html,/<section class="section project-story" aria-labelledby="project-story-title"/);
      assert.equal((html.match(/class="story-step"/g)??[]).length,3);
      assert.match(html,/<div class="story-outcome"/);
      assert.doesNotMatch(html,/class="[^"]*quickstart/);
      const footer=html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0];
      assert.ok(footer);
      assert.doesNotMatch(footer,/id="share"|id="share-fallback"/);
    }
  }
});
test('Juliya previews match each locale on home, catalog and detail pages',()=>{
  for(const [prefix,locale,height] of [['','en',626],['ko/','ko',625],['ja/','ja',626],['zh-cn/','zh-cn',626]]){
    const file=`/assets/juliya-live-${locale}.png`;
    const png=readFileSync('build'+file);
    assert.equal(png.readUInt32BE(16),1160);
    assert.equal(png.readUInt32BE(20),height);
    for(const path of ['','projects/','projects/juliya/']){
      const html=readFileSync('build/'+prefix+path+'index.html','utf8');
      assert.ok(html.includes(`src="${file}" width="1160" height="${height}"`),prefix+path);
      assert.doesNotMatch(html,/src="\/assets\/juliya-live\.png"/);
    }
  }
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
      const summary=detail.match(/<p class="lead"[^>]*>([^<]+)<\/p>/)?.[1];
      const meta=detail.match(/<meta name="description" content="([^"]+)"/)?.[1];
      assert.ok(summary && summary.length >= 40, `${prefix}${role} has a substantive description`);
      assert.equal(meta,summary, `${prefix}${role} metadata matches the visible description`);
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
