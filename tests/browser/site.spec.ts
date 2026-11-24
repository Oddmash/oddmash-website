import { test, expect } from '@playwright/test';
test('filter, detail navigation, locale and legacy query', async ({page})=>{
  await page.goto('/?lang=ko');
  await expect(page).toHaveURL(/\/ko\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang','ko');
  await expect(page.getByRole('button',{name:'웹 서비스'})).toHaveCount(0);
  await page.getByRole('button',{name:'개발 도구'}).click();
  await expect(page.locator('.project:visible')).toHaveCount(4);
  await expect(page.locator('#filter-status')).toHaveText('프로젝트 4개 표시');
  await page.getByRole('link',{name:'Kowrap 프로젝트 상세',exact:true}).click();
  await expect(page).toHaveURL(/\/ko\/projects\/kowrap\//);
  await page.getByRole('link',{name:'日本語'}).click();
  await expect(page).toHaveURL(/\/ja\/projects\/kowrap\//);
  await expect(page.locator('html')).toHaveAttribute('lang','ja');
});
test('all localized pages reflow, load images and retain keyboard focus', async ({page})=>{
  test.setTimeout(120_000);
  await page.setViewportSize({width:320,height:740});
  const prefixes=['','ko/','ja/','zh-cn/'];
  const paths=['','studio/','privacy/','projects/kowrap/','projects/oddmash-ui/','projects/interaction-inspector/','projects/boundra/'];
  const unexpected:string[]=[];
  page.on('pageerror',error=>unexpected.push(error.message));
  page.on('request',request=>{if(!request.url().startsWith('http://127.0.0.1:4322/')&&!request.url().startsWith('data:'))unexpected.push('Unexpected external request');});
  for(const prefix of prefixes)for(const path of paths){
    const route='/'+prefix+path;
    await page.goto(route);
    await expect(page.locator('h1')).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    await expect(page.locator('meta[name=robots]')).toHaveAttribute('content','noindex, nofollow');
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
    await page.locator('footer').scrollIntoViewIfNeeded();
    const img = page.locator('img');
    for (let i=0;i<await img.count();i++){ await img.nth(i).scrollIntoViewIfNeeded(); await expect.poll(async()=>img.nth(i).evaluate(el=>(el as HTMLImageElement).complete&&(el as HTMLImageElement).naturalWidth>0)).toBe(true); }
  }
  expect(unexpected).toEqual([]);
});
test('copy feedback and live Kowrap width', async ({page})=>{
  await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{}}}));
  await page.goto('/ko/projects/kowrap/');
  const range=page.locator('#demo-width');
  await expect(range).toBeVisible();
  await expect(page.locator('#demo-fallback')).toBeHidden();
  await range.focus();
  await range.press('End');
  await expect(page.locator('#width-value')).toHaveText('320 px');
  await expect.poll(()=>page.locator('#optimized-wrap').evaluate(el=>el.childNodes.length>1)).toBe(true);
  const widths=await page.locator('.sample').evaluateAll(elements=>elements.map(el=>el.getBoundingClientRect().width));
  expect(widths).toEqual([320,320]);
  await expect(page.locator('#demo-status')).toBeEmpty();
  await page.setViewportSize({width:320,height:740});
  await expect.poll(()=>range.getAttribute('max')).not.toBe('320');
  await range.press('End');
  const chosen=Number(await range.inputValue());
  await expect(page.locator('#width-value')).toHaveText(chosen+' px');
  expect(await page.locator('.sample').evaluateAll(elements=>elements.map(el=>el.getBoundingClientRect().width))).toEqual([chosen,chosen]);
  await page.locator('#share').click();
  await expect(page.locator('#share-status')).toHaveText('링크를 복사했습니다.');
});

test('legacy privacy locale and copy fallback',async ({page})=>{
  await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{throw new Error('Unavailable');}}}));
  await page.goto('/privacy.html?lang=ja');
  await expect(page).toHaveURL(/\/ja\/privacy\/$/);
  await page.getByRole('button',{name:'リンクをコピー'}).click();
  await expect(page.locator('#share-status')).toHaveText('アドレスバーからリンクをコピーしてください。');
  await expect(page.getByRole('textbox',{name:'ページリンク'})).toHaveValue('http://127.0.0.1:4322/ja/privacy/');
  await page.getByRole('link',{name:'简体中文'}).click();
  await expect(page).toHaveURL(/\/zh-cn\/privacy\/$/);
});

test('progressive rendering without JavaScript',async ({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();
  try{
    await page.goto('http://127.0.0.1:4322/privacy.html?lang=ko');
    await expect(page).toHaveURL(/\/privacy\/$/);
    await page.getByRole('link',{name:'한국어'}).click();
    await expect(page).toHaveURL(/\/ko\/privacy\/$/);
    await page.goto('http://127.0.0.1:4322/ko/');
    await expect(page.locator('.project:visible')).toHaveCount(4);
    await expect(page.locator('#filters')).toBeHidden();
    await expect(page.locator('#share')).toBeHidden();
    await page.getByRole('link',{name:'Kowrap 프로젝트 상세'}).click();
    await expect(page.locator('#demo-fallback')).toBeVisible();
    await expect(page.locator('#demo-pair')).toBeHidden();
    await expect(page.locator('#demo-control')).toBeHidden();
  }finally{await context.close();}
});

test('representative light and dark product captures',async ({page},testInfo)=>{
  await page.setViewportSize({width:1440,height:1000});
  await page.emulateMedia({colorScheme:'light',reducedMotion:'reduce'});
  await page.goto('/');
  for(const img of await page.locator('img').all()){
    await img.scrollIntoViewIfNeeded();
    await expect.poll(()=>img.evaluate(el=>(el as HTMLImageElement).complete&&(el as HTMLImageElement).naturalWidth>0)).toBe(true);
  }
  await page.evaluate(()=>document.fonts.ready);
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.screenshot({path:testInfo.outputPath('desktop-home-light.png'),fullPage:true});
  await page.emulateMedia({colorScheme:'dark',reducedMotion:'reduce'});
  await page.goto('/ko/projects/oddmash-ui/');
  await expect.poll(()=>page.locator('.detail-image img').evaluate((img:HTMLImageElement)=>img.currentSrc)).toMatch(/ui-dark\.png$/);
  await page.screenshot({path:testInfo.outputPath('desktop-ui-dark.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.goto('/ko/');
  for(const img of await page.locator('img').all()){
    await img.scrollIntoViewIfNeeded();
    await expect.poll(()=>img.evaluate(el=>(el as HTMLImageElement).complete&&(el as HTMLImageElement).naturalWidth>0)).toBe(true);
  }
  await page.evaluate(()=>document.fonts.ready);
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.screenshot({path:testInfo.outputPath('mobile-home-dark.png'),fullPage:true});
});

test('Kowrap demo pauses and resumes across cached page transitions', async ({page})=>{
  await page.goto('/ko/projects/kowrap/');
  const range=page.locator('#demo-width');
  const output=page.locator('#width-value');
  await expect(range).toBeVisible();
  for(let cycle=0;cycle<3;cycle++){
    const before: string=await output.innerText();
    await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true})));
    await range.evaluate((input:HTMLInputElement)=>{
      input.value=input.value==='160'?'220':'160';
      input.dispatchEvent(new Event('input'));
    });
    await expect(output).toHaveText(before);
    await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true})));
    await expect(output).toHaveText((await range.inputValue())+' px');
    await expect.poll(()=>page.locator('#optimized-wrap').evaluate(el=>el.childNodes.length>1)).toBe(true);
    await expect(page.locator('#demo-status')).toBeEmpty();
    await range.focus();
    await range.press('End');
    await expect(output).toHaveText((await range.inputValue())+' px');
  }
});


test('studio roles remain keyboard accessible and playback stops when detached', async ({page})=>{
  await page.goto('/ko/');
  const stage=page.locator('[data-agent-stage]');
  const roles=stage.locator('[data-agent-index]');
  await expect(roles).toHaveCount(7);
  await expect(roles.first()).toHaveText('Lead');
  await roles.nth(2).focus();
  await page.keyboard.press('Enter');
  await expect(roles.nth(2)).toHaveAttribute('aria-pressed','true');
  await expect(stage.locator('[data-agent-output]:visible')).toHaveCount(1);
  await expect(stage.locator('[data-agent-output]:visible')).toContainText('Triage');
  const play=stage.locator('[data-agent-play]');
  await play.click();
  await expect(play).toHaveAttribute('aria-pressed','true');
  await page.evaluate(()=>{
    const stage=document.querySelector('[data-agent-stage]')!;
    document.body.dataset.detachedStage='pending';
    const play=stage.querySelector('[data-agent-play]')!;
    const observer=new MutationObserver(()=>{
      if(play.getAttribute('aria-pressed')==='false'){
        document.body.dataset.detachedStage='stopped';
        observer.disconnect();
      }
    });
    observer.observe(play,{attributes:true});
    stage.remove();
  });
  await expect(page.locator('body')).toHaveAttribute('data-detached-stage','stopped');
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.reload();
  await expect(roles).toHaveCount(7);
  await expect(play).toBeHidden();
  await roles.last().click();
  await expect(roles.last()).toHaveAttribute('aria-pressed','true');
});
