import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const base = '/oddmash-website';
const root = 'build';
const visit = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? visit(join(dir, entry.name)) : [join(dir, entry.name)]);
for (const file of visit(root).filter(file => file.endsWith('.html'))) {
  let html = readFileSync(file, 'utf8');
  if (file === join(root, 'privacy.html')) {
    html = html.replace(/(url=|['"])(\/(?!\/)(?:[a-z-]+\/)*privacy\/)/g, '$1' + base + '$2');
  }
  if (file.endsWith('/projects/kowrap/index.html')) html = html.replace(/(url=\s*)(\/(?!\/|oddmash-website\/)(?:[a-z-]+\/)*projects\/juliya\/)/gi, '$1' + base + '$2');
  html = html.replace(/\b(href|src|srcset)="(\/(?!\/|oddmash-website\/)[^"]*)"/g, (_, attr, value) => attr + '="' + base + value + '"');
  for (const [, link] of html.matchAll(/\b(?:href|src|srcset)="(\/[^"#?]*)"/g)) {
    assert.ok(link.startsWith(base + '/'), link);
    const target = join(root, link.slice(base.length + 1));
    assert.ok(existsSync(target) || existsSync(join(target, 'index.html')), link);
  }
  assert.doesNotMatch(html, /vertactics/i);
  writeFileSync(file, html);
}
assert.ok(!existsSync(join(root, 'assets', 'vertactics.jpg')));
assert.match(readFileSync(join(root, 'index.html'), 'utf8'), /rel="canonical" href="https:\/\/oddmash\.github\.io\/oddmash-website\/"/);
assert.match(readFileSync(join(root, 'sitemap.xml'), 'utf8'), /https:\/\/oddmash\.github\.io\/oddmash-website\//);
assert.match(readFileSync(join(root, 'privacy.html'), 'utf8'), /url=\/oddmash-website\/privacy\//);
