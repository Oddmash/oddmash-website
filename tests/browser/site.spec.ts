import { test, expect, type Page } from '@playwright/test';

const languageNames = { en: 'English', ko: '한국어', ja: '日本語', 'zh-CN': '简体中文' } as const;
type Language = keyof typeof languageNames;
const chooseLanguage = async (page: Page, locale: Language) => {
  const trigger = page.locator('#language-select');
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded','true');
  await page.getByRole('option',{name:languageNames[locale],exact:true}).click();
};
test('project catalog, detail navigation, locale and legacy query', async ({page})=>{
  await page.goto('/?lang=ko');
  await expect(page).toHaveURL(/\/ko\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang','ko');
  await expect(page.locator('.project:visible')).toHaveCount(4);
  await page.getByRole('link',{name:'Kowrap 프로젝트 상세',exact:true}).click();
  await expect(page).toHaveURL(/\/ko\/projects\/kowrap\//);
  await expect(page.locator('#language-select')).toHaveText(languageNames.ko);
  await chooseLanguage(page,'ja');
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
  await chooseLanguage(page,'zh-CN');
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
  await expect(chapter.locator('picture')).toBeVisible();
  await expect(page.locator('.project-sequence .project')).toHaveCount(4);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.reload();
  await expect(opening.locator('h1')).toBeVisible();
  expect(await image.evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
  expect(await page.evaluate(()=>getComputedStyle(document.scrollingElement ?? document.documentElement).scrollSnapType)).toBe('none');
  await chapter.scrollIntoViewIfNeeded();
  expect(await chapter.locator('picture').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
  expect(await page.evaluate(()=>getComputedStyle(document.scrollingElement ?? document.documentElement).scrollBehavior)).toBe('auto');
  await page.getByRole('link',{name:'Kowrap Project details',exact:true}).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/projects\/kowrap\//);
});


test('Oddmash UI custom dropdown preserves localized route identity', async ({page})=>{
  for(const original of ['/','/studio/','/projects/boundra/','/privacy/']){
    await page.goto(original);
    const select=page.locator('#language-select');
    await expect(select).toBeVisible();
    await expect(select).toHaveClass(/om-select-dropdown-trigger/);
    await expect(select).toHaveAttribute('role','combobox');
    await expect(select).toHaveAccessibleName(/\S/);
    await expect(select).toHaveText(languageNames.en);
    await select.focus();
    await expect(select).toBeFocused();
    await select.press('Enter');
    await expect(select).toHaveAttribute('aria-expanded','true');
    await expect(page.getByRole('option')).toHaveCount(4);
    await expect(page.getByRole('option',{name:languageNames.en})).toHaveAttribute('aria-selected','true');
    await select.press('Escape');
    await expect(select).toHaveAttribute('aria-expanded','false');
    for(const [locale,prefix] of [['ko','/ko'],['ja','/ja'],['zh-CN','/zh-cn'],['en','']] as const){
      await chooseLanguage(page,locale);
      await expect(page).toHaveURL('http://127.0.0.1:4322'+prefix+original);
      await expect(page.locator('html')).toHaveAttribute('lang',locale);
      await expect(select).toHaveText(languageNames[locale]);
    }
  }
  await page.goto('/ko/#work');
  await chooseLanguage(page,'ja');
  await expect(page).toHaveURL('http://127.0.0.1:4322/ja/#work');
  await expect(page.locator('#language-select')).toHaveText(languageNames.ja);
});

test('custom language menu supports keyboard, chevron and narrow viewport', async ({page})=>{
  await page.setViewportSize({width:320,height:740});
  await page.goto('/ko/');
  const trigger=page.locator('#language-select');
  await expect(trigger).toHaveText(languageNames.ko);
  expect(await trigger.evaluate(el=>getComputedStyle(el,'::after').borderInlineEndStyle)).toBe('solid');
  await trigger.focus();
  await trigger.press('ArrowDown');
  await expect(trigger).toHaveAttribute('aria-expanded','true');
  const list=page.getByRole('listbox');
  await expect(list).toBeVisible();
  const box=await list.boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x+box!.width).toBeLessThanOrEqual(321);
  await trigger.press('ArrowDown');
  await trigger.press('Enter');
  await expect(page).toHaveURL(/\/ja\/$/);
  await expect(trigger).toHaveText(languageNames.ja);
  await trigger.click();
  await expect(list).toBeVisible();
  await page.locator('h1').click();
  await expect(list).toBeHidden();
});

test('desktop home chapters snap one at a time while narrow layouts scroll naturally', async ({page})=>{
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/');
  const chapters=page.locator('.project-sequence .project');
  await expect(chapters).toHaveCount(4);
  const snapType=()=>page.evaluate(()=>getComputedStyle(document.scrollingElement ?? document.documentElement).scrollSnapType);
  await expect.poll(snapType).toMatch(/y (mandatory|proximity)/);
  expect(await page.evaluate(()=>getComputedStyle(document.scrollingElement ?? document.documentElement).scrollBehavior)).toBe('smooth');
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
  await page.mouse.wheel(0,-770);
  await expect.poll(nearestChapter).toBe(0);
  await expect.poll(()=>chapters.first().evaluate((el, top)=>Math.abs(el.getBoundingClientRect().top-top),firstTop)).toBeLessThan(90);
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
    await expect(page.locator('.detail-hero [data-platform=github]')).toHaveAttribute('href','https://github.com/Oddmash/oddmash-ui/blob/main/'+readme);
    await page.goto('/'+prefix+'projects/boundra/');
    await expect(page.locator('.detail-hero .secondary')).toHaveAttribute('href','https://github.com/Oddmash/boundra/blob/main/docs/'+guide);
    await expect(page.locator('.detail-grid .lead')).toContainText('pnpm exec boundra');
  }
});

test('project section navigation includes image and keyboard with independent package and repository links',async ({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/ko/');
  const cards=page.locator('.project-sequence .project');
  const published:Record<string,string>={kowrap:'@oddmash/kowrap','oddmash-ui':'@oddmash/ui',boundra:'boundra'};
  for(const card of await cards.all()){
    const project=(await card.getAttribute('data-project'))!;
    const destination=card.locator('a.project-destination');
    const github=card.locator('a[data-platform=github]');
    const npm=card.locator('a[data-platform=npm]');
    await expect(destination).toHaveAttribute('href','/ko/projects/'+project+'/');
    await expect(destination).toHaveAccessibleName(/\S/);
    await expect(github).toHaveAccessibleName(/GitHub/i);
    await expect(github).toHaveAttribute('href',new RegExp('^https://github\\.com/Oddmash/'+project+'(?:/|$)'));
    await expect(github.locator('svg')).toBeVisible();
    await expect(card.locator('a a, a button')).toHaveCount(0);
    if(published[project]){
      await expect(npm).toHaveAccessibleName(/npm/i);
      await expect(npm).toHaveAttribute('href','https://www.npmjs.com/package/'+published[project]);
      await expect(npm.locator('svg')).toBeVisible();
    }else await expect(npm).toHaveCount(0);
  }
  const ui=page.locator('.project-sequence [data-project=oddmash-ui]');
  await ui.locator('a.project-destination').focus();
  await expect(ui.locator('a.project-destination')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/ko\/projects\/oddmash-ui\/$/);
  await page.goto('/ko/');
  const inspector=page.locator('.project-sequence [data-project=interaction-inspector]');
  const image=inspector.locator('.project-image');
  await image.scrollIntoViewIfNeeded();
  const box=(await image.boundingBox())!;
  await page.mouse.click(box.x+box.width/2,box.y+box.height/2);
  await expect(page).toHaveURL(/\/ko\/projects\/interaction-inspector\/$/);
  await page.goto('/ko/');
  const npm=ui.locator('a[data-platform=npm]');
  const npmHref=(await npm.getAttribute('href'))!;
  await page.route(npmHref,route=>route.fulfill({contentType:'text/html',body:'<title>npm package</title>'}));
  await npm.click();
  await expect(page).toHaveURL(npmHref);
});

test('project icons have meaningful hover feedback and honour reduced motion',async ({page})=>{
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/');
  const npm=page.locator('.project-sequence [data-project=oddmash-ui] [data-platform=npm]');
  await npm.scrollIntoViewIfNeeded();
  const color=()=>npm.evaluate(el=>getComputedStyle(el).color);
  await page.mouse.move(5,5);
  const resting=await color();
  if(await page.evaluate(()=>matchMedia('(hover: hover) and (pointer: fine)').matches)){
    await npm.hover();
    await expect.poll(color).not.toBe(resting);
    await expect.poll(()=>npm.locator('svg').evaluate(el=>getComputedStyle(el).animationName)).not.toBe('none');
    await page.mouse.move(5,5);
    await expect.poll(color).toBe(resting);
  }
  await page.locator('.project-sequence [data-project=oddmash-ui] [data-platform=github]').focus();
  await page.keyboard.press('Tab');
  await expect(npm).toBeFocused();
  expect(await npm.evaluate(el=>getComputedStyle(el).outlineStyle)).not.toBe('none');
  await page.emulateMedia({reducedMotion:'reduce'});
  await npm.hover();
  expect(await npm.locator('svg').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
  expect(await npm.evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
});

test('additional project index offers direct navigation without requiring scrolling through every chapter',async ({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.setViewportSize({width:390,height:844});
  await page.goto('/ko/');
  const index=page.locator('#project-index');
  await index.scrollIntoViewIfNeeded();
  await expect(index.locator('h2')).toBeVisible();
  const boundra=index.locator('a[href="/ko/projects/boundra/"]').first();
  await expect(boundra).toHaveAccessibleName(/Boundra/i);
  await boundra.click();
  await expect(page).toHaveURL(/\/ko\/projects\/boundra\/$/);
});

test('detail media and related project rows retain separate navigation and platform links',async ({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/ja/projects/oddmash-ui/');
  const detail=page.locator('.detail-hero');
  const imageLink=detail.locator('.detail-image-link');
  const live='https://oddmash.github.io/oddmash-ui/';
  await expect(imageLink).toHaveAttribute('href',live);
  await expect(imageLink).toHaveAccessibleName(/\S/);
  await expect(detail.locator('[data-platform=npm]')).toHaveAttribute('href','https://www.npmjs.com/package/@oddmash/ui');
  await expect(page.locator('.related-projects [data-platform=github]')).toHaveCount(3);
  await expect(page.locator('.related-projects [data-platform=npm]')).toHaveCount(2);
  await expect(page.locator('main a a, main a button')).toHaveCount(0);
  await page.route(live,route=>route.fulfill({contentType:'text/html',body:'<title>UI documentation</title>'}));
  await imageLink.click();
  await expect(page).toHaveURL(live);
  await page.goto('/ja/studio/');
  await expect(page.locator('.about-projects [data-platform=github]')).toHaveCount(4);
  await expect(page.locator('.about-projects [data-platform=npm]')).toHaveCount(3);
  await expect(page.locator('main a a, main a button')).toHaveCount(0);
});

test('Oddmash UI documentation artwork is displayed completely in both themes and at mobile width',async ({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const colorScheme of ['dark','light'] as const){
    await page.emulateMedia({colorScheme});
    for(const width of [390,1440]){
      await page.setViewportSize({width,height:900});
      for(const route of ['/','/projects/oddmash-ui/']){
        await page.goto(route);
        const frame=page.locator(route==='/'?'[data-project=oddmash-ui] .project-image':'.detail-hero .detail-image');
        await frame.scrollIntoViewIfNeeded();
        const image=frame.locator('img');
        await expect.poll(()=>image.evaluate((el:HTMLImageElement)=>el.complete&&el.naturalWidth>0)).toBe(true);
        const fit=await image.evaluate((el:HTMLImageElement)=>{
          const picture=el.parentElement!;
          const frame=el.closest('.project-image, .detail-image')!;
          const box=el.getBoundingClientRect();
          const pictureBox=picture.getBoundingClientRect();
          const frameBox=frame.getBoundingClientRect();
          const style=getComputedStyle(el);
          return {
            source:el.currentSrc,
            naturalWidth:el.naturalWidth,
            naturalHeight:el.naturalHeight,
            width:box.width,
            height:box.height,
            objectFit:style.objectFit,
            noDistortion:Math.abs(box.width/box.height-el.naturalWidth/el.naturalHeight)<.02 || style.objectFit==='contain',
            insidePicture:box.left>=pictureBox.left-1 && box.right<=pictureBox.right+1 && box.top>=pictureBox.top-1 && box.bottom<=pictureBox.bottom+1,
            insideFrame:box.left>=frameBox.left-1 && box.right<=frameBox.right+1 && box.top>=frameBox.top-1 && box.bottom<=frameBox.bottom+1
          };
        });
        expect(fit.source).toMatch(colorScheme==='dark'?/ui-dark\.png$/:/ui\.png$/);
        expect(fit.naturalWidth).toBe(1280);
        expect(fit.naturalHeight).toBe(950);
        expect(fit.width).toBeGreaterThan(100);
        expect(fit.height).toBeGreaterThan(100);
        expect(fit.objectFit).toBe('contain');
        expect(fit.noDistortion).toBe(true);
        expect(fit.insidePicture).toBe(true);
        expect(fit.insideFrame).toBe(true);
      }
    }
  }
});
