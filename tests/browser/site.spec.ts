import { test, expect } from '@playwright/test';
test('filter, detail navigation, locale and legacy query', async ({page})=>{
  await page.goto('/?lang=ko');
  await expect(page).toHaveURL(/\/ko\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang','ko');
  await page.getByRole('button',{name:'웹 서비스'}).click();
  await expect(page.locator('.project:visible')).toHaveCount(1);
  await page.getByRole('link',{name:'프로젝트 상세',exact:true}).click();
  await expect(page).toHaveURL(/\/ko\/projects\/vertactics\//);
  await page.getByRole('link',{name:'日本語'}).click();
  await expect(page).toHaveURL(/\/ja\/projects\/vertactics\//);
  await expect(page.locator('html')).toHaveAttribute('lang','ja');
});
test('mobile layouts, image load and keyboard focus', async ({page})=>{
  await page.setViewportSize({width:320,height:740});
  for(const route of ['/','/ko/','/ja/','/zh-cn/','/ko/projects/kowrap/']){
    await page.goto(route);
    await expect(page.locator('h1')).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip')).toBeFocused();
    await page.locator('footer').scrollIntoViewIfNeeded();
    const img = page.locator('img');
    for (let i=0;i<await img.count();i++){ await img.nth(i).scrollIntoViewIfNeeded(); await expect.poll(async()=>img.nth(i).evaluate(el=>(el as HTMLImageElement).complete&&(el as HTMLImageElement).naturalWidth>0)).toBe(true); }
  }
});
test('copy feedback and live Kowrap width', async ({page})=>{
  await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{}}}));
  await page.goto('/ko/projects/kowrap/');
  const range=page.locator('#demo-width');
  await range.focus();
  await range.press('End');
  await expect(page.locator('#width-value')).toHaveText('320 px');
  await expect(page.locator('#demo-status')).toBeEmpty();
  await page.locator('#share').click();
  await expect(page.locator('#share-status')).toHaveText('링크를 복사했습니다.');
});
