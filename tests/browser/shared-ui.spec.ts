import { expect, test } from '@playwright/test';

test('shared platform links render native destinations and package hover motion', async ({ page, browser }) => {
  await page.setViewportSize({width:1440,height:900});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/ko/');
  const header = page.locator('header.om-site-header.om-site-header-inner');
  await expect(header.locator('nav.om-site-nav')).toBeVisible();
  await expect(page.locator('footer.om-site-footer nav.om-site-nav')).toBeVisible();
  await expect(page.locator('main .om-button--link').first()).toBeVisible();
  const card=page.locator('[data-project=oddmash-ui]');
  const github=card.locator('a.om-platform-link[data-platform=github]');
  const npm=card.locator('a.om-platform-link[data-platform=npm]');
  await expect(github).toHaveAttribute('href','https://github.com/Oddmash/oddmash-ui');
  await expect(npm).toHaveAttribute('href','https://www.npmjs.com/package/@oddmash/ui');
  await github.scrollIntoViewIfNeeded();
  const hit=await github.boundingBox();
  expect(hit!.width).toBeGreaterThanOrEqual(44);
  expect(hit!.height).toBeGreaterThanOrEqual(44);
  if(await page.evaluate(()=>matchMedia('(hover: hover) and (pointer: fine)').matches)){
    await github.hover();
    await expect(github.locator('svg')).toHaveCSS('animation-name','om-platform-pulse');
    await npm.hover();
    await expect(npm.locator('svg')).toHaveCSS('animation-name','om-platform-pulse');
    await expect(npm).toHaveCSS('color','rgb(203, 56, 55)');
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await npm.hover();
  await expect(npm.locator('svg')).toHaveCSS('animation-name','none');
  const context=await browser.newContext({javaScriptEnabled:false});
  try{
    const plain=await context.newPage();
    await plain.goto('http://127.0.0.1:4322/ko/');
    await expect(plain.locator('[data-project=oddmash-ui] a.om-platform-link[data-platform=github] svg')).toBeVisible();
    await expect(plain.locator('.om-locale-fallback summary')).toBeVisible();
    await plain.locator('.om-locale-fallback summary').click();
    await plain.getByRole('link',{name:'日本語',exact:true}).click();
    await expect(plain).toHaveURL(/\/ja\/$/);
  }finally{await context.close();}
});

test('shared locale picker retains route, hash, preference and narrow layout',async({page})=>{
  await page.setViewportSize({width:320,height:740});
  await page.goto('/ko/#work');
  const selector=page.locator('.om-locale-picker #language-select');
  await expect(selector).toHaveAttribute('role','combobox');
  await expect(selector).toHaveText('한국어');
  await selector.press('Enter');
  await page.getByRole('option',{name:'日本語',exact:true}).click();
  await expect(page).toHaveURL(/\/ja\/#work$/);
  await expect(selector).toHaveText('日本語');
  await expect(page.locator('.om-locale-fallback')).toBeHidden();
  expect(await page.evaluate(()=>localStorage.getItem('oddmash-language'))).toBe('ja');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

test('documentation adopts semantic code and prose surfaces and exposes managed copy state',async({page})=>{
  await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async (value:string)=>{
    document.documentElement.dataset.copiedShared=value;
  }}}));
  await page.goto('/ko/agents/');
  await expect(page.locator('.agent-doc-section.om-prose .om-code-block-content')).toContainText('/review');
  await page.goto('/ko/skills/accessibility/');
  const first=page.locator('[data-copy=markdown]');
  await first.click();
  await expect(page.locator('#copy-toast [data-toast-id] .om-toast')).toContainText('복사했습니다');
  await expect(page.locator('html')).toHaveAttribute('data-copied-shared',/^---\nname: oddmash-accessibility/);
  await expect(first).toBeFocused();
});

test('skill card directional fill and command copy use shared UI without losing native links',async({page})=>{
  await page.goto('/skills/');
  await expect(page.locator('a.skill-item.om-link-card').first()).toBeVisible();
  const card=page.locator('.skill-flow-panel:not([hidden]) a.om-link-card').first();
  await card.scrollIntoViewIfNeeded();
  if(await page.evaluate(()=>matchMedia('(hover: hover) and (pointer: fine)').matches)){
    await card.hover();
    await expect(card).toHaveCSS('background-size','100% 100%');
  }
  await card.click();
  await expect(page.locator('.skill-reference.om-prose .om-code-block-content')).toBeVisible();
  await expect(page.locator('.skill-install.om-prose .om-code-block-copy[data-copy=commands]')).toBeVisible();
});
