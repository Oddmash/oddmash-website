import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const root = new URL('./dist/', import.meta.url);
const html = readFileSync(new URL('index.html', root), 'utf8');
const script = readFileSync(new URL('app.js', root), 'utf8');
for (const [, link] of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
  if (!/^https?:/.test(link)) assert.ok(existsSync(new URL(link, root)), link);
}
const mock = (dataset = {}, textContent = '') => ({dataset,textContent,hidden:false,attrs:{},events:{},setAttribute(k,v){this.attrs[k]=v;},addEventListener(k,v){this.events[k]=v;}});
const texts = [...html.matchAll(/data-t="([^"]+)"[^>]*>([^<]*)/g)].map(m=>mock({t:m[1]},m[2]));
const filters = ['all','tools','web'].map(filter=>mock({filter}));
const projects = ['tools','tools','tools','web'].map(category=>mock({category}));
const elements = Object.fromEntries(['#locale','#filter-status','#share-status','#share'].map(id=>[id,mock()]));
const document = {documentElement:{},querySelectorAll(s){return {'[data-t]':texts,'[data-alt]':[],'[data-filter]':filters,'[data-category]':projects}[s];},querySelector(s){return elements[s];}};
let location = {href:'https://example.test/?lang=ko',search:'?lang=ko'};
let copied = '';
const context = {document,location,URL,URLSearchParams,history:{replaceState(_,__,url){location.href=url.href;}},navigator:{clipboard:{async writeText(value){copied=value;}}}};
runInNewContext(script,context);
assert.equal(document.documentElement.lang,'ko');
assert.equal(texts.find(n=>n.dataset.t==='headline1').textContent,'작은 아이디어.');
filters[2].events.click();
assert.equal(projects.filter(p=>!p.hidden).length,1);
assert.equal(filters[2].attrs['aria-pressed'],'true');
for (const lang of ['ja','zh-CN','en','ko']) {
  elements['#locale'].value=lang;
  elements['#locale'].events.change();
  assert.equal(document.documentElement.lang,lang);
  assert.equal(projects.filter(p=>!p.hidden).length,1);
}
filters[0].events.click();
assert.equal(projects.filter(p=>!p.hidden).length,4);
await elements['#share'].events.click();
assert.equal(copied,'https://example.test/?lang=ko');
assert.equal(elements['#share-status'].textContent,'링크를 복사했습니다.');
context.navigator.clipboard.writeText=async()=>{throw new Error('Unavailable');};
await elements['#share'].events.click();
assert.equal(elements['#share-status'].textContent,'주소 표시줄의 링크를 복사해 주세요.');
console.log('Passed: local asset references, locale switching, project filters, clipboard success and fallback (mock DOM).');
