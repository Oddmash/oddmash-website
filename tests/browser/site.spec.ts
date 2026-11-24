import { test, expect } from '@playwright/test';
test('project catalog, detail navigation, locale and legacy query', async ({page})=>{
  await page.goto('/?lang=ko');
  await expect(page).toHaveURL(/\/ko\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang','ko');
  await expect(page.locator('.project:visible')).toHaveCount(4);
  await page.getByRole('link',{name:'Kowrap 프로젝트 상세',exact:true}).click();
  await expect(page).toHaveURL(/\/ko\/projects\/kowrap\//);
  await expect(page.locator('#language-select')).toHaveValue('ko');
  await page.locator('#language-select').selectOption('ja');
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
    if(path==='') await expect(page.locator('.project-sequence .project')).toHaveCount(4);
    if(path==='projects/boundra/'){
      await expect(page.locator('h1')).toHaveText('Boundra');
      await expect(page.locator('.feature-list li')).toHaveCount(3);
      await expect(page.locator('.detail-head .lead')).not.toBeEmpty();
      await expect(page.locator('.detail-image img')).toHaveAttribute('alt', /Boundra/i);
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    await expect(page.locator('meta[name=robots]')).toHaveAttribute('content','noindex, nofollow');
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
    await page.locator('footer').scrollIntoViewIfNeeded();
    const img = page.locator('img:visible');
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
  await page.locator('#language-select').selectOption('zh-CN');
  await expect(page).toHaveURL(/\/zh-cn\/privacy\/$/);
});

test('progressive rendering without JavaScript',async ({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();
  try{
    await page.goto('http://127.0.0.1:4322/privacy.html?lang=ko');
    await expect(page).toHaveURL(/\/privacy\/$/);
    await expect(page.locator('#language-select')).toBeHidden();
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
  for(const img of await page.locator('img:visible').all()){
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
  for(const img of await page.locator('img:visible').all()){
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


test('Korean editorial text uses Kowrap across viewport sizes and preserves content', async ({page, browser})=>{
  const plain = await browser.newContext({javaScriptEnabled:false});
  const fallback = await plain.newPage();
  const normalize = (value:string) => value.replace(/\s+/g,'');
  try {
    for(const route of ['/ko/','/ko/studio/','/ko/projects/kowrap/','/ko/projects/oddmash-ui/','/ko/projects/interaction-inspector/','/ko/projects/boundra/','/ko/privacy/']){
      await fallback.goto('http://127.0.0.1:4322'+route);
      await page.goto(route);
      await expect(page.locator('[data-kowrap-applied]').first()).toBeVisible();
      for(const width of [320,390,768,1440]){
        await page.setViewportSize({width,height:900});
        await expect.poll(()=>page.locator('[data-kowrap-applied]').evaluateAll(nodes=>nodes.every(el=>el.scrollWidth<=el.clientWidth+1))).toBe(true);
        expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      }
      const original = await fallback.locator('main h1, main h2, main h3, main p, main li, main figcaption').allTextContents();
      const applied = await page.locator('[data-kowrap-applied]').allTextContents();
      expect(applied.length).toBeGreaterThan(0);
      for(const text of applied) expect(original.map(normalize)).toContain(normalize(text));
      await expect(page.locator('[data-agent-stage]')).toHaveCount(0);
    }
    await page.setViewportSize({width:320,height:900});
    await page.goto('/ko/');
    await expect.poll(()=>page.locator('#hero-title br').count()).toBeGreaterThan(0);
    await expect(fallback.locator('[data-kowrap-applied]')).toHaveCount(0);
  } finally { await plain.close(); }
});


test('cinematic opening and project scenes preserve navigation and reduced motion', async ({page})=>{
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/');
  const opening=page.locator('.opening-scene');
  await expect(opening.locator('h1')).toBeVisible();
  await expect(opening.locator('.primary')).toBeEnabled();
  const image=opening.locator('.brand-art img');
  const animation=await image.evaluate(el=>{
    const style=getComputedStyle(el);
    return {name:style.animationName,duration:style.animationDuration,iterations:style.animationIterationCount};
  });
  expect(animation.name).not.toBe('none');
  expect(animation.name).toContain('ribbon-hum');
  expect(animation.duration).toBe('0.7s, 1.45s');
  expect(animation.iterations).toBe('1, 2');
  const chapter=page.locator('.project-sequence .project-image').first();
  await chapter.scrollIntoViewIfNeeded();
  await expect(chapter).toHaveAttribute('data-scene-entered','true');
  await expect(page.locator('.project-sequence .project')).toHaveCount(4);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.reload();
  await expect(opening.locator('h1')).toBeVisible();
  expect(await image.evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
  expect(await page.evaluate(()=>getComputedStyle(document.scrollingElement ?? document.documentElement).scrollSnapType)).toBe('none');
  await chapter.scrollIntoViewIfNeeded();
  await expect(chapter).not.toHaveAttribute('data-scene-entered','true');
  expect(await chapter.locator('picture').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
  await page.getByRole('link',{name:'Kowrap Project details',exact:true}).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/projects\/kowrap\//);
});


test('native language selector preserves localized route identity', async ({page})=>{
  for(const original of ['/','/studio/','/projects/boundra/','/privacy/']){
    await page.goto(original);
    const select=page.locator('#language-select');
    await expect(select).toBeVisible();
    await expect(select).toHaveAccessibleName(/\S/);
    await expect(select).toHaveValue('en');
    expect(await select.locator('option').evaluateAll(options=>options.map(option=>(option as HTMLOptionElement).value))).toEqual(['en','ko','ja','zh-CN']);
    await select.focus();
    await expect(select).toBeFocused();
    for(const [locale,prefix] of [['ko','/ko'],['ja','/ja'],['zh-CN','/zh-cn'],['en','']] as const){
      await select.selectOption(locale);
      await expect(page).toHaveURL('http://127.0.0.1:4322'+prefix+original);
      await expect(page.locator('html')).toHaveAttribute('lang',locale);
      await expect(select).toHaveValue(locale);
    }
  }
});

test('desktop home chapters snap one at a time while narrow layouts scroll naturally', async ({page})=>{
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/');
  const chapters=page.locator('.project-sequence .project');
  await expect(chapters).toHaveCount(4);
  const snapType=()=>page.evaluate(()=>getComputedStyle(document.scrollingElement ?? document.documentElement).scrollSnapType);
  await expect.poll(snapType).toMatch(/y (mandatory|proximity)/);
  const geometry=await chapters.evaluateAll(nodes=>nodes.map(el=>({
    height:el.getBoundingClientRect().height,
    align:getComputedStyle(el).scrollSnapAlign
  })));
  for(const item of geometry){
    expect(item.height).toBeGreaterThanOrEqual(900*.7);
    expect(item.align).not.toBe('none');
  }
  const nearestChapter=()=>chapters.evaluateAll(nodes=>{
    const root=document.scrollingElement ?? document.documentElement;
    const padding=parseFloat(getComputedStyle(root).scrollPaddingTop)||0;
    return nodes.map((node,index)=>({index,distance:Math.abs(node.getBoundingClientRect().top-padding)})).sort((a,b)=>a.distance-b.distance)[0].index;
  });
  await chapters.first().evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
  await expect.poll(nearestChapter).toBe(0);
  const firstTop=await chapters.first().evaluate(el=>el.getBoundingClientRect().top);
  await page.mouse.move(720,450);
  await page.mouse.wheel(0,770);
  await expect.poll(nearestChapter).toBe(1);
  await expect.poll(()=>chapters.nth(1).evaluate((el, top)=>Math.abs(el.getBoundingClientRect().top-top),firstTop)).toBeLessThan(90);
  await page.setViewportSize({width:390,height:844});
  await expect.poll(snapType).toBe('none');
  await page.goto('/ko/');
  await expect(page.locator('#hero-title')).toBeVisible();
  await chapters.last().scrollIntoViewIfNeeded();
  await expect(chapters.last()).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('non-Kowrap project detail hero places real media next to the introduction on desktop', async ({page})=>{
  await page.setViewportSize({width:1440,height:900});
  for(const project of ['boundra','oddmash-ui','interaction-inspector']){
    await page.goto('/ko/projects/'+project+'/');
    expect(await page.evaluate(()=>getComputedStyle(document.scrollingElement ?? document.documentElement).scrollSnapType)).toBe('none');
    const hero=page.locator('.detail-hero');
    const media=hero.locator('.detail-image');
    await expect(hero.locator('h1')).toBeVisible();
    await expect(media).toBeVisible();
    const bounds=await hero.evaluate(el=>{
      const h=el.querySelector('h1')!.getBoundingClientRect();
      const img=el.querySelector('.detail-image')!.getBoundingClientRect();
      return {display:getComputedStyle(el).display,titleRight:h.right,titleBottom:h.bottom,imageTop:img.top,imageLeft:img.left,imageHeight:img.height};
    });
    expect(bounds.display).toBe('grid');
    expect(bounds.imageHeight).toBeGreaterThan(100);
    expect(bounds.imageTop).toBeLessThan(900);
    expect(bounds.imageLeft).toBeGreaterThanOrEqual(bounds.titleRight-1);
    await expect.poll(()=>media.locator('img').evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);
    await page.setViewportSize({width:320,height:740});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    await media.scrollIntoViewIfNeeded();
    await expect(media).toBeVisible();
    await page.setViewportSize({width:1440,height:900});
  }
});


test('public project documentation targets match the selected language',async ({page})=>{
  const locales=[['','README.md','user-guide.md'],['ko/','docs/ko/README.md','user-guide.ko.md'],['ja/','docs/ja/README.md','user-guide.ja.md'],['zh-cn/','docs/zh-CN/README.md','user-guide.zh-cn.md']];
  for(const [prefix,readme,guide] of locales){
    await page.goto('/'+prefix+'projects/oddmash-ui/');
    await expect(page.locator('.detail-hero .primary')).toHaveAttribute('href','https://github.com/Oddmash/oddmash-ui/blob/main/'+readme);
    await page.goto('/'+prefix+'projects/boundra/');
    await expect(page.locator('.detail-hero .secondary')).toHaveAttribute('href','https://github.com/Oddmash/boundra/blob/main/docs/'+guide);
    await expect(page.locator('.detail-grid .lead')).toContainText('pnpm exec boundra');
  }
});
