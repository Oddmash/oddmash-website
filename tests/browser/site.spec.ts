import { test, expect, type Page } from '@playwright/test';

const languageNames = { en: 'English', ko: '한국어', ja: '日本語', 'zh-CN': '简体中文' } as const;
type Language = keyof typeof languageNames;
const chooseLanguage = async (page: Page, locale: Language) => {
  const trigger = page.locator('#language-select');
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded','true');
  await page.getByRole('listbox').getByRole('option',{name:languageNames[locale],exact:true}).click();
};
test('root chooses the first supported browser language and remembers explicit selection', async ({browser})=>{
  const cases = [
    {languages:['ko-KR','en-US'],prefix:'ko/',lang:'ko'},
    {languages:['fr-FR','ja-JP'],prefix:'ja/',lang:'ja'},
    {languages:['zh-Hans-CN'],prefix:'zh-cn/',lang:'zh-CN'},
    {languages:['fr-FR','de-DE'],prefix:'',lang:'en'},
  ];
  for (const {languages,prefix,lang} of cases) {
    const context = await browser.newContext();
    try {
      await context.addInitScript(languages=>Object.defineProperty(navigator,'languages',{value:languages}),languages);
      const page = await context.newPage();
      await page.goto('http://127.0.0.1:4322/?ref=entry#work');
      await expect(page).toHaveURL('http://127.0.0.1:4322/'+prefix+'?ref=entry#work');
      await expect(page.locator('html')).toHaveAttribute('lang',lang);
      await chooseLanguage(page,'en');
      await page.goto('http://127.0.0.1:4322/');
      await expect(page.locator('html')).toHaveAttribute('lang','en');
      await expect(page).toHaveURL('http://127.0.0.1:4322/');
      await page.goto('http://127.0.0.1:4322/ja/projects/');
      await expect(page.locator('html')).toHaveAttribute('lang','ja');
      await page.goto('http://127.0.0.1:4322/?lang=ko&ref=entry');
      await expect(page).toHaveURL('http://127.0.0.1:4322/ko/?ref=entry');
    } finally { await context.close(); }
  }
});
test('initial language selection remains usable without storage or JavaScript', async ({browser})=>{
  const blocked = await browser.newContext();
  try {
    await blocked.addInitScript(()=>{
      Object.defineProperty(navigator,'languages',{value:['ja-JP']});
      Object.defineProperty(window,'localStorage',{get(){throw new Error('Storage unavailable');}});
    });
    const page=await blocked.newPage();
    await page.goto('http://127.0.0.1:4322/');
    await expect(page).toHaveURL('http://127.0.0.1:4322/ja/');
    await chooseLanguage(page,'en');
    await expect(page).toHaveURL('http://127.0.0.1:4322/');
    await expect(page.locator('html')).toHaveAttribute('lang','en');
  } finally { await blocked.close(); }
  const noScript = await browser.newContext({javaScriptEnabled:false,locale:'ko-KR'});
  try {
    const page=await noScript.newPage();
    await page.goto('http://127.0.0.1:4322/');
    await expect(page.locator('html')).toHaveAttribute('lang','en');
    await expect(page.locator('.language-picker-fallback summary')).toBeVisible();
    await page.locator('.language-picker-fallback summary').focus();
    await page.keyboard.press('Enter');
    await page.getByRole('link',{name:'한국어',exact:true}).click();
    await expect(page).toHaveURL('http://127.0.0.1:4322/ko/');
  } finally { await noScript.close(); }
});
test('project catalog, detail navigation, locale and legacy query', async ({page})=>{
  await page.goto('/?lang=ko');
  await expect(page).toHaveURL(/\/ko\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang','ko');
  await expect(page.locator('.project:visible')).toHaveCount(4);
  await page.getByRole('link',{name:'Juliya 프로젝트 상세',exact:true}).click();
  await expect(page).toHaveURL(/\/ko\/projects\/juliya\//);
  await expect(page.locator('#language-select')).toHaveText(languageNames.ko);
  await chooseLanguage(page,'ja');
  await expect(page).toHaveURL(/\/ja\/projects\/juliya\//);
  await expect(page.locator('html')).toHaveAttribute('lang','ja');
});
test('all localized pages reflow, load images and retain keyboard focus', async ({page})=>{
  test.setTimeout(180_000);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.setViewportSize({width:320,height:740});
  const prefixes=['','ko/','ja/','zh-cn/'];
  const paths=['','projects/','studio/','privacy/','agents/',...['lead','impact','triage','qa','docs','architect','release'].map(id=>'agents/'+id+'/'),'projects/juliya/','projects/oddmash-ui/','projects/interaction-inspector/','projects/boundra/'];
  const unexpected:string[]=[];
  page.on('pageerror',error=>unexpected.push(error.message));
  page.on('request',request=>{if(!request.url().startsWith('http://127.0.0.1:4322/')&&!request.url().startsWith('data:'))unexpected.push('Unexpected external request');});
  for(const prefix of prefixes)for(const path of paths){
    const route='/'+prefix+path;
    await page.goto(route);
    await expect(page.locator('h1')).toBeVisible();
    if(path==='') await expect(page.locator('.project-gallery .project')).toHaveCount(4);
    if(path==='projects/boundra/'){
      await expect(page.locator('h1')).toHaveText('Boundra');
      await expect(page.locator('.story-features li')).toHaveCount(3);
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
test('agent role names and descriptions keep stable card widths', async ({page})=>{
  test.setTimeout(90_000);
  await page.emulateMedia({reducedMotion:'reduce'});
  for (const prefix of ['', 'ko/', 'ja/', 'zh-cn/']) {
    for (const route of [prefix, prefix+'agents/']) {
      for (const width of [320,375,701,1051,1280]) {
        await page.setViewportSize({width,height:800});
        await page.goto('/'+route+(route===''?'?lang=en':''));
        const cards = page.locator('.agent-roster .agent-profile-link');
        await expect(cards).toHaveCount(7);
        await page.evaluate(()=>document.fonts.ready);
        const captions = cards.locator('.agent-caption');
        for (const heading of await captions.locator('h3').all()) {
          await expect(heading).not.toHaveAttribute('data-juliya-applied','true');
          await expect(heading.locator('br')).toHaveCount(0);
          const geometry = await heading.evaluate(el=>{
            const range = document.createRange();
            range.selectNodeContents(el);
            const rectangles = [...range.getClientRects()];
            const text = range.getBoundingClientRect();
            const bounds = el.getBoundingClientRect();
            return {
              label: el.textContent,
              rectangles: rectangles.length,
              left: text.left - bounds.left,
              right: bounds.right - text.right,
              blockHeight: bounds.height,
              lineHeight: parseFloat(getComputedStyle(el).lineHeight),
            };
          });
          const caseLabel = `${route || '/'} ${width}px: ${JSON.stringify(geometry)}`;
          expect(geometry.rectangles,caseLabel).toBe(1);
          expect(geometry.left,caseLabel).toBeGreaterThanOrEqual(-1);
          expect(geometry.right,caseLabel).toBeGreaterThanOrEqual(-1);
          expect(geometry.blockHeight,caseLabel).toBeLessThanOrEqual(geometry.lineHeight+1);
        }
        if (route.endsWith('agents/')) {
          const descriptions = captions.locator('p');
          await expect(descriptions).toHaveCount(7);
          for (const paragraph of await descriptions.all()) {
            await expect(paragraph).toHaveAttribute('data-juliya-applied','true');
            await expect.poll(()=>paragraph.evaluate(el=>{
              const parent = el.parentElement!.getBoundingClientRect();
              const bounds = el.getBoundingClientRect();
              const max = parseFloat(getComputedStyle(el).fontSize)*12;
              return bounds.width >= Math.min(parent.width,max)-1 && bounds.width <= parent.width+1 && el.scrollWidth<=el.clientWidth+1;
            })).toBe(true);
          }
        }
        await cards.first().focus();
        await expect(cards.first()).toBeFocused();
        expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      }
    }
  }
});

test('live Juliya width and clean footer', async ({page})=>{
  await page.goto('/ko/projects/juliya/');
  const range=page.locator('#demo-width');
  await expect(range).toBeVisible();
  await expect(range).toHaveClass(/om-slider/);
  await expect(page.locator('#demo-fallback')).toBeHidden();
  await expect(page.locator('.demo-fallback-link')).toBeHidden();
  await range.focus();
  await range.press('End');
  await expect(page.locator('#width-value')).toHaveText('320 px');
  await expect.poll(()=>page.locator('#optimized-wrap').evaluate(el=>el.childNodes.length>1)).toBe(true);
  const widths=await page.locator('.sample').evaluateAll(elements=>elements.map(el=>el.getBoundingClientRect().width));
  expect(widths).toEqual([320,320]);
  await expect(page.locator('#demo-status')).toBeEmpty();
  await page.setViewportSize({width:320,height:740});
  await expect.poll(async()=>Number(await range.getAttribute('max'))).not.toBe(320);
  const resizedMax=Number(await range.getAttribute('max'));
  expect(resizedMax).toBeLessThan(320);
  await expect(range).toHaveValue(String(resizedMax));
  await expect(page.locator('#width-value')).toHaveText(resizedMax+' px');
  await expect.poll(()=>page.locator('.sample').evaluateAll(elements=>elements.map(el=>el.getBoundingClientRect().width))).toEqual([resizedMax,resizedMax]);
  await range.press('End');
  const chosen=Number(await range.inputValue());
  await expect(page.locator('#width-value')).toHaveText(chosen+' px');
  expect(await page.locator('.sample').evaluateAll(elements=>elements.map(el=>el.getBoundingClientRect().width))).toEqual([chosen,chosen]);
  await expect(page.locator('footer #share, footer #share-fallback')).toHaveCount(0);
});

test('legacy privacy locale and language switch',async ({page})=>{
  await page.goto('/privacy.html?lang=ja');
  await expect(page).toHaveURL(/\/ja\/privacy\/$/);
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
    await page.locator('.language-picker-fallback summary').focus();
    await page.keyboard.press('Enter');
    await page.getByRole('link',{name:'한국어'}).click();
    await expect(page).toHaveURL(/\/ko\/privacy\/$/);
    await page.goto('http://127.0.0.1:4322/ko/');
    await expect(page.locator('.project:visible')).toHaveCount(4);
    await expect(page.locator('#filters')).toBeHidden();
    await expect(page.locator('#share')).toHaveCount(0);
    const workflow=page.locator('#workflow');
    await expect(workflow).not.toHaveAttribute('data-film-ready','true');
    await expect(workflow.locator('.film-step')).toHaveCount(6);
    await expect(workflow.locator('.film-inline:visible')).toHaveCount(6);
    for(const step of await workflow.locator('.film-step').all()) await expect(step.locator('h3')).toBeVisible();
    await page.getByRole('link',{name:'Juliya 프로젝트 상세'}).click();
    await expect(page.locator('#demo-fallback')).toBeVisible();
    await expect(page.locator('.demo-fallback-link')).toBeVisible();
    await expect(page.locator('#demo-pair')).toBeHidden();
    await expect(page.locator('#demo-control')).toBeHidden();
  }finally{await context.close();}
});

test('Juliya demo keeps its explanation when enhancement fails', async ({page})=>{
  await page.addInitScript(() => {
    Object.defineProperty(window, 'ResizeObserver', {value: undefined, configurable: true});
  });
  await page.goto('/ko/projects/juliya/');
  await expect(page.locator('#demo-status')).not.toBeEmpty();
  await expect(page.locator('#demo-fallback')).toBeVisible();
  await expect(page.locator('.demo-fallback-link')).toBeVisible();
  await expect(page.locator('#demo-pair')).toBeHidden();
  await expect(page.locator('#demo-control')).toBeHidden();
  await expect(page.locator('#demo-language-control')).toBeHidden();
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

test('Juliya demo pauses and resumes across cached page transitions', async ({page})=>{
  await page.goto('/ko/projects/juliya/');
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


test('Juliya editorial wrapping preserves content and links across viewport sizes', async ({page, browser})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  const plain = await browser.newContext({javaScriptEnabled:false,reducedMotion:'reduce'});
  const fallback = await plain.newPage();
  const normalize = (value:string) => value.replace(/\s+/g,'');
  try {
    for(const route of ['/ko/','/ko/projects/','/ko/agents/','/ko/agents/lead/','/ko/studio/','/ko/projects/juliya/','/ko/projects/oddmash-ui/','/ko/projects/interaction-inspector/','/ko/projects/boundra/','/ko/privacy/']){
      await fallback.goto('http://127.0.0.1:4322'+route);
      await page.goto(route);
      await expect(page.locator('[data-juliya-applied]').first()).toBeVisible();
      for(const width of [320,390,768,1440]){
        await page.setViewportSize({width,height:900});
        await expect.poll(()=>page.locator('[data-juliya-applied]').evaluateAll(nodes=>nodes.every(el=>el.scrollWidth<=el.clientWidth+1))).toBe(true);
        expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      }
      const original = await fallback.locator('main h1, main h2, main h3, main h4, main h5, main h6, main p, main li, main figcaption, main dt, main dd, main blockquote').allTextContents();
      const applied = await page.locator('[data-juliya-applied]').allTextContents();
      expect(applied.length).toBeGreaterThan(0);
      for(const text of applied) expect(original.map(normalize)).toContain(normalize(text));
      expect(await page.locator('main a[href]').count()).toBe(await fallback.locator('main a[href]').count());
    }
    await page.setViewportSize({width:320,height:900});
    await page.goto('/ko/');
    await expect(page.locator('#hero-title')).toHaveAttribute('data-juliya-applied','true');
    expect(await page.locator('#hero-title').evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
    await expect(fallback.locator('[data-juliya-applied]')).toHaveCount(0);
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
  const chapter=page.locator('.project-gallery .project-image').first();
  await chapter.scrollIntoViewIfNeeded();
  await expect(chapter.locator('picture')).toBeVisible();
  await expect(page.locator('.project-gallery .project')).toHaveCount(4);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.reload();
  await expect(opening.locator('h1')).toBeVisible();
  expect(await image.evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
  expect(await page.evaluate(()=>getComputedStyle(document.scrollingElement ?? document.documentElement).scrollSnapType)).toBe('none');
  await chapter.scrollIntoViewIfNeeded();
  expect(await chapter.locator('picture').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
  expect(await page.evaluate(()=>getComputedStyle(document.scrollingElement ?? document.documentElement).scrollBehavior)).toBe('auto');
  await page.getByRole('link',{name:'Juliya Project details',exact:true}).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/projects\/juliya\//);
});


test('Oddmash UI custom dropdown preserves localized route identity', async ({page})=>{
  for(const original of ['/','/projects/','/agents/','/agents/qa/','/studio/','/projects/boundra/','/privacy/']){
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

test('cinematic workflow repeats automatically with hover and focus pause',async ({page},testInfo)=>{
  test.setTimeout(65_000);
  await page.setViewportSize({width:1440,height:900});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/');
  const workflow=page.locator('#workflow');
  await expect(workflow).toHaveAttribute('data-film-ready','true');
  await expect(workflow.locator('.film-step')).toHaveCount(6);
  await expect(workflow.locator('.film-player')).toBeVisible();
  await expect(workflow.locator('.film-controls button')).toHaveCount(0);
  await expect(workflow.locator('progress, .film-timeline, .film-step-number')).toHaveCount(0);
  await workflow.locator('.film-screen').scrollIntoViewIfNeeded();
  await expect(workflow).toHaveAttribute('data-playing','true');
  await expect(workflow).toHaveAttribute('data-active-scene','1',{timeout:15000});
  await workflow.locator('.film-player').hover();
  await expect(workflow).toHaveAttribute('data-playing','false');
  const paused=await workflow.getAttribute('data-active-scene');
  await page.waitForTimeout(6000);
  await expect(workflow).toHaveAttribute('data-active-scene',paused!);
  await page.mouse.move(0,0);
  await expect(workflow).toHaveAttribute('data-playing','true');
  await workflow.locator('.film-player').focus();
  await expect(workflow).toHaveAttribute('data-playing','false');
  await workflow.locator('#workflow-title').focus();
  await expect(workflow).toHaveAttribute('data-playing','true');
  await expect(workflow).toHaveAttribute('data-active-scene','5',{timeout:30000});
  await expect(workflow).toHaveAttribute('data-active-scene','0',{timeout:10000});
  await page.screenshot({path:testInfo.outputPath('desktop-workflow-scene.png')});
  await page.locator('h1').scrollIntoViewIfNeeded();
  await expect(workflow).toHaveAttribute('data-playing','false');
});

test('workflow preserves inline scenes under reduced motion and fits narrow screens',async ({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/ko/');
  const workflow=page.locator('#workflow');
  await expect(workflow.locator('.film-player')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(workflow.locator('.film-player')).toBeHidden();
  await expect(workflow.locator('.film-step')).toHaveCount(6);
  await expect(workflow.locator('.film-inline:visible')).toHaveCount(6);
  for(const step of await workflow.locator('.film-step').all()){
    await expect(step.locator('h3')).toBeVisible();
    expect(await step.locator('.film-inline').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
  }
});

test('non-Juliya project detail hero places real media next to the introduction on desktop', async ({page})=>{
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


test('public project homepage and repository targets match the selected language',async ({page})=>{
  const locales=[['','README.md',''],['ko/','docs/ko/README.md','ko/'],['ja/','docs/ja/README.md','ja/'],['zh-cn/','docs/zh-CN/README.md','zh-cn/']];
  for(const [prefix,readme,homepage] of locales){
    await page.goto('/'+prefix+'projects/oddmash-ui/');
    await expect(page.locator('.detail-hero [data-platform=github]')).toHaveAttribute('href','https://github.com/Oddmash/oddmash-ui');
    await expect(page.locator('.detail-hero [data-platform=docs]')).toHaveAttribute('href','https://github.com/Oddmash/oddmash-ui/blob/main/'+readme);
    await page.goto('/'+prefix+'projects/boundra/');
    await expect(page.locator('.detail-hero [data-platform=homepage]')).toHaveAttribute('href','https://oddmash.github.io/boundra/'+homepage);
    await expect(page.locator('.detail-hero .button.secondary')).toHaveCount(0);
  }
});

test('project section navigation includes image and keyboard with independent package and repository links',async ({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/ko/');
  const cards=page.locator('.project-gallery .project');
  const published:Record<string,string>={juliya:'@oddmash/juliya','oddmash-ui':'@oddmash/ui',boundra:'boundra'};
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
  const ui=page.locator('.project-gallery [data-project=oddmash-ui]');
  await ui.locator('a.project-destination').focus();
  await expect(ui.locator('a.project-destination')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/ko\/projects\/oddmash-ui\/$/);
  await page.goto('/ko/');
  const inspector=page.locator('.project-gallery [data-project=interaction-inspector]');
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
  const npm=page.locator('.project-gallery [data-project=oddmash-ui] [data-platform=npm]');
  await npm.scrollIntoViewIfNeeded();
  const color=()=>npm.evaluate(el=>getComputedStyle(el).color);
  await page.mouse.move(5,5);
  const resting=await color();
  if(await page.evaluate(()=>matchMedia('(hover: hover) and (pointer: fine)').matches)){
    await npm.hover();
    await expect.poll(color).not.toBe(resting);
    await expect.poll(()=>npm.locator('svg').evaluate(el=>getComputedStyle(el).animationName)).not.toBe('none');
    expect(await npm.locator('svg').evaluate(el=>getComputedStyle(el).animationIterationCount)).toBe('1');
    await page.mouse.move(5,5);
    await expect.poll(color).toBe(resting);
  }
  await page.locator('.project-gallery [data-project=oddmash-ui] [data-platform=github]').focus();
  await page.keyboard.press('Tab');
  await expect(npm).toBeFocused();
  expect(await npm.evaluate(el=>getComputedStyle(el).outlineStyle)).not.toBe('none');
  await page.emulateMedia({reducedMotion:'reduce'});
  await npm.hover();
  expect(await npm.locator('svg').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
  expect(await npm.evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
});

test('homepage sections are navigable and every public product appears once',async ({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.setViewportSize({width:390,height:844});
  await page.goto('/ko/');
  await expect(page.locator('#project-index')).toHaveCount(0);
  const work=page.locator('#work');
  const method=page.locator('#method');
  const agents=page.locator('#agents');
  const workflow=page.locator('#workflow');
  for(const section of [work,method,agents,workflow]){
    await expect(section.locator('h2')).toBeVisible();
  }
  await expect(work.locator('.project-gallery .project')).toHaveCount(4);
  await expect(work.locator('.project-arrow')).toHaveCount(0);
  for(const project of ['juliya','oddmash-ui','interaction-inspector','boundra']){
    await expect(page.locator('main a[href="/ko/projects/'+project+'/"]')).toHaveCount(1);
  }
  await expect(method.locator('.method-item')).toHaveCount(4);
  await expect(agents.locator('.agent-profile')).toHaveCount(7);
  for(const profile of await agents.locator('.agent-profile').all()){
    await expect(profile.locator('h3')).toBeVisible();
    const badge=profile.locator('img');
    await expect(badge).toHaveAttribute('src',/^\/(?!\/).*\.svg$/);
    await badge.scrollIntoViewIfNeeded();
    await expect.poll(()=>badge.evaluate((el:HTMLImageElement)=>el.complete&&el.naturalWidth>0)).toBe(true);
  }
  await expect(workflow.locator('.film-step')).toHaveCount(6);
  await page.locator('header nav a[href="/ko/contribute/"]').click();
  await expect(page).toHaveURL(/\/ko\/contribute\/$/);
  await expect(page.locator('.contribution-guide li')).toHaveCount(5);
  await expect(page.getByRole('link', { name: '이슈 템플릿' })).toHaveAttribute('href', 'https://github.com/Oddmash/.github/tree/main/.github/ISSUE_TEMPLATE');
  await page.locator('header nav a[href="/ko/projects/"]').click();
  await expect(page).toHaveURL(/\/ko\/projects\/$/);
  await expect(page.locator('.catalog-entry')).toHaveCount(4);
  await expect(page.locator('#workflow')).toHaveCount(0);
  await page.goto('/ko/');
  const boundra=work.locator('a[href="/ko/projects/boundra/"]');
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
  await expect(page.locator('.about-projects')).toHaveCount(0);
  await expect(page.locator('.principle-list h3')).toHaveCount(3);
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


test('localized Juliya links follow upstream language routes',async ({page})=>{
  for(const [prefix,suffix] of [['','en/'],['ko/',''],['ja/','ja/'],['zh-cn/','zh/']] as const){
    await page.goto('/'+prefix+'projects/juliya/');
    const live='https://oddmash.github.io/juliya/'+suffix;
    await expect(page.locator('.detail-image-link')).toHaveAttribute('href',live);
    await expect(page.locator('.detail-hero [data-platform=homepage]')).toHaveAttribute('href',live);
    await expect(page.locator('.detail-hero [data-platform=docs]')).toHaveAttribute('href',live+'docs/');
  }
});


test('home section headings and method cards align at desktop and mobile sizes',async ({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const width of [1440,320]){
    await page.setViewportSize({width,height:900});
    await page.goto('/ko/');
    for(const id of ['work','method','agents','workflow']){
      const section=page.locator('#'+id);
      const title=section.locator('.section-title h2');
      const box=await section.boundingBox();
      const heading=await title.boundingBox();
      expect(Math.abs(box!.x+box!.width/2-heading!.x-heading!.width/2)).toBeLessThan(3);
    }
    const closing=page.locator('.closing-cta');
    const closeBox=await closing.boundingBox();
    const closeHeading=await closing.locator('h2').boundingBox();
    expect(Math.abs(closeBox!.x+closeBox!.width/2-closeHeading!.x-closeHeading!.width/2)).toBeLessThan(3);
    const cards=page.locator('.method-item');
    const first=await cards.nth(0).boundingBox();
    const second=await cards.nth(1).boundingBox();
    if(width===1440) expect(Math.abs(first!.y-second!.y)).toBeLessThan(3);
    else expect(Math.abs(first!.x-second!.x)).toBeLessThan(3);
    const h=await cards.first().locator('h3').boundingBox();
    const p=await cards.first().locator('p').boundingBox();
    expect(Math.abs(h!.x-p!.x)).toBeLessThan(3);
  }
});


test('localized agent pages describe official roles and preserve individual character gestures',async ({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/ko/');
  const agent=page.locator('#agents .agent-profile-link').first();
  const hand=agent.locator('.agent-gesture');
  await expect(hand).toHaveCSS('opacity','0');
  await agent.scrollIntoViewIfNeeded();
  if(await page.evaluate(()=>matchMedia('(hover: hover) and (pointer: fine)').matches)){
    await agent.hover();
    expect(await hand.evaluate(el=>getComputedStyle(el).animationName)).toBe('lead-check');
    expect(await hand.evaluate(el=>getComputedStyle(el).animationIterationCount)).toBe('1');
    await page.mouse.move(1,1);
    const gestures=['lead-check','impact-spark','triage-sort','qa-inspect','docs-open','architect-plan','release-launch'];
    for (const [index,name] of gestures.entries()) {
      const card=page.locator('#agents .agent-profile-link').nth(index);
      await card.hover();
      expect(await card.locator('.agent-gesture').evaluate(el=>getComputedStyle(el).animationName)).toBe(name);
      if(name==='qa-inspect') expect(await card.locator('.gesture-glint').evaluate(el=>getComputedStyle(el).animationName)).toBe('qa-glint');
      if(name==='release-launch') expect(await card.locator('.gesture-prop').evaluate(el=>{const box=el.getBoundingClientRect();const badge=el.closest('[data-agent-role]')!.getBoundingClientRect();return box.left>badge.left+badge.width*.7;})).toBe(true);
    }
    await page.mouse.move(1,1);
  }
  await page.keyboard.press('Tab');
  await agent.focus();
  await expect(agent).toBeFocused();
  expect(await hand.evaluate(el=>getComputedStyle(el).animationName)).toBe('lead-check');
  await page.emulateMedia({reducedMotion:'reduce'});
  expect(await hand.evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
  await page.locator('#agents .agent-roster-cta').click();
  await expect(page).toHaveURL(/\/ko\/agents\/$/);
  await expect(page.locator('.agent-profile')).toHaveCount(7);
  await expect(page.locator('a[href="https://github.com/Oddmash/oddmash-agents"]')).toHaveCount(1);
  await expect(page.locator('main a[href="/ko/skills/"]')).toHaveCount(2);
  await page.locator('a[href="/ko/agents/triage/"]').click();
  await expect(page.locator('h1')).toHaveText('Triage');
  await expect(page.locator('.agent-command-card code')).toHaveText('/triage');
  await chooseLanguage(page,'ja');
  await expect(page).toHaveURL(/\/ja\/agents\/triage\/$/);
  await expect(page.locator('h1')).toHaveText('Triage');
});

test('visible workflow stages use multilingual enhancement and preserve native typography fallback',async ({page})=>{
  await page.setViewportSize({width:1200,height:900});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/ko/');
  const player=page.locator('#workflow .film-player');
  await player.locator('.film-screen').scrollIntoViewIfNeeded();
  await expect(page.locator('#workflow')).toHaveAttribute('data-active-scene','1',{timeout:15000});
  await expect(player.locator('[data-film-visual="1"] h3')).toHaveAttribute('data-juliya-applied','true');
  await expect(player.locator('[data-film-visual]:is([hidden]) [data-juliya-applied]')).toHaveCount(0);
  for(const path of ['/ja/','/zh-cn/']){
    await page.goto(path);
    expect(await page.locator('main').evaluate(el=>getComputedStyle(el).lineBreak)).toBe('strict');
    await expect(page.locator('[data-juliya-applied]').first()).toBeVisible();
  }
});


test('skills are documented natively and localized routes remain usable',async ({page})=>{
  for(const [prefix,language] of [['','en'],['ko/','ko'],['ja/','ja'],['zh-cn/','zh-CN']]){
    await page.setViewportSize({width:320,height:900});
    await page.goto('/'+prefix+'skills/');
    await expect(page.locator('.skill-item')).toHaveCount(30);
    await expect(page.locator('[data-stage-panel]:visible')).toHaveCount(1);
    await page.locator('[data-stage-select="quality"]').click();
    await expect(page.locator('[data-stage-select="quality"]')).toHaveAttribute('aria-pressed','true');
    await expect(page.locator('[data-stage-panel="quality"]')).toBeVisible();
    await page.locator('a[href="/'+prefix+'skills/accessibility/"]').click();
    await expect(page.locator('.skill-reference')).toBeVisible();
    await expect(page.locator('.skill-reference h2')).toHaveCount(3);
    await expect(page.locator('[data-copy="markdown"]')).toBeVisible();
    await expect(page.locator('a[href="#skill-install"]')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang',language);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    await expect(page.locator('.skill-doc .lead')).toHaveAttribute('data-juliya-applied','true');
  }
});


test('skill copy and install affordances provide actionable content',async ({page})=>{
  await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async(text:string)=>{document.documentElement.dataset.copiedSkill=text;}}}));
  await page.goto('/ko/skills/');
  const quality=page.locator('[data-stage-select="quality"]');
  await quality.hover();
  await expect(quality).toHaveAttribute('aria-pressed','false');
  await quality.focus();
  await expect(quality).toHaveAttribute('aria-pressed','false');
  await quality.press('Enter');
  await expect(page.locator('[data-stage-panel="quality"]')).toBeVisible();
  await page.locator('a[href="/ko/skills/accessibility/"]').click();
  await page.locator('[data-copy="markdown"]').click();
  await expect(page.locator('[data-copy="markdown"]')).toHaveClass(/om-button/);
  await expect(page.locator('html')).toHaveAttribute('data-copied-skill',/^---\nname: oddmash-accessibility/);
  await expect(page.locator('#copy-toast .om-toast')).toContainText('복사했습니다');
  await page.locator('a[href="#skill-install"]').click();
  await expect(page).toHaveURL(/#skill-install$/);
  await page.locator('[data-copy="commands"]').click();
  await expect(page.locator('[data-copy="commands"]')).toHaveClass(/om-button/);
  await expect(page.locator('html')).toHaveAttribute('data-copied-skill',/oddmash-accessibility\/SKILL\.md/);
});


test('skill flow heading is centered and the development map is discoverable',async ({page})=>{
  for(const width of [1280,320]){
    await page.setViewportSize({width,height:720});
    await page.goto('/ko/skills/');
    const section=await page.locator('.skill-flow-section').boundingBox();
    const heading=await page.locator('#skill-flow-title').boundingBox();
    const controls=await page.locator('[data-skill-flow-controls]').boundingBox();
    expect(Math.abs(section!.x+section!.width/2-heading!.x-heading!.width/2)).toBeLessThan(3);
    expect(heading!.width).toBeGreaterThan(Math.min(section!.width*.8,700));
    if(width===1280) expect(controls!.y).toBeLessThan(620);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});

test('workflow touch pause is reversible and keyboard focus does not retain touch pause', async ({ page }) => {
  await page.setViewportSize({width: 1200, height: 900});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/ko/');
  const workflow = page.locator('#workflow');
  const player = workflow.locator('.film-player');
  await player.locator('.film-screen').scrollIntoViewIfNeeded();
  await expect(workflow).toHaveAttribute('data-playing','true');
  await player.dispatchEvent('pointerup', {pointerType:'touch'});
  await expect(workflow).toHaveAttribute('data-playing','false');
  await player.dispatchEvent('pointerup', {pointerType:'touch'});
  await expect(workflow).toHaveAttribute('data-playing','true');
  await player.dispatchEvent('pointerup', {pointerType:'touch'});
  await expect(workflow).toHaveAttribute('data-playing','false');
  await workflow.locator('#workflow-title').focus();
  await page.keyboard.press('Tab');
  await expect(player).toBeFocused();
  await expect(workflow).toHaveAttribute('data-playing','false');
  await workflow.locator('#workflow-title').evaluate(el => (el as HTMLElement).focus({preventScroll:true}));
  await expect(player).not.toBeFocused();
  await expect(workflow).toHaveAttribute('data-playing','true');
  await player.focus();
  await player.dispatchEvent('pointerup', {pointerType:'touch'});
  await expect(workflow).toHaveAttribute('data-playing','false');
  await page.keyboard.press('Tab');
  await expect(player).not.toBeFocused();
  await player.locator('.film-screen').scrollIntoViewIfNeeded();
  await expect(workflow).toHaveAttribute('data-playing','true');
});


test('workflow pause preserves readable text and can remain stopped after focus moves', async ({page})=>{
  await page.setViewportSize({width:1280,height:800});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/ko/');
  const workflow=page.locator('#workflow');
  const player=workflow.locator('.film-player');
  await player.scrollIntoViewIfNeeded();
  await player.focus();
  await expect(workflow).toHaveAttribute('data-playing','false');
  for(const selector of ['.film-visual:not([hidden])','.film-visual:not([hidden]) .film-step-copy']) await expect(workflow.locator(selector)).toHaveCSS('opacity','1');
  const pause=workflow.locator('[data-film-pause]');
  await pause.press('Enter');
  await page.mouse.move(0,0);
  await workflow.locator('#workflow-title').focus();
  await expect(workflow).toHaveAttribute('data-playing','false');
  await expect(pause).toHaveText('애니메이션 재개');
  await pause.press('Enter');
  await expect(pause).toHaveText('애니메이션 일시 정지');
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(pause).toBeHidden();
  await expect(workflow.locator('.film-steps')).toBeVisible();
});

test('representative editorial text and controls have readable contrast', async ({page})=>{
  await page.goto('/ko/skills/');
  const ratios=await page.evaluate(()=>{
    const root=getComputedStyle(document.documentElement);
    const luminance=(hex:string)=>{
      const value=hex.trim().slice(1);
      const expanded=value.length===3?value.split('').map(x=>x+x).join(''):value;
      const channels=expanded.match(/.{2}/g)!.map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);
      return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;
    };
    const contrast=(a:string,b:string)=>{const x=luminance(root.getPropertyValue(a)),y=luminance(root.getPropertyValue(b));return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
    return {body:contrast('--muted','--bg'),card:contrast('--muted','--paper'),button:contrast('--control-line','--paper'),focus:contrast('--focus','--bg')};
  });
  expect(ratios.body).toBeGreaterThanOrEqual(4.5);
  expect(ratios.card).toBeGreaterThanOrEqual(4.5);
  expect(ratios.button).toBeGreaterThanOrEqual(3);
  expect(ratios.focus).toBeGreaterThanOrEqual(3);
  await page.locator('[data-stage-select="quality"]').click();
  await page.locator('a[href="/ko/skills/accessibility/"]').click();
  const intro=await page.locator('.skill-doc .lead').innerText();
  const when=await page.locator('.skill-reference > p').first().innerText();
  expect(intro).not.toBe(when);
  await expect(page.locator('.skill-reference pre')).toContainText('$oddmash-accessibility');
});


test('project detail explains problems, workflow, outcomes and scope in each locale', async ({page})=>{
  for(const prefix of ['','ko/','ja/','zh-cn/']) for(const project of ['juliya','oddmash-ui','interaction-inspector','boundra']){
    await page.goto('/'+prefix+'projects/'+project+'/');
    const story=page.locator('.project-story');
    await expect(story.locator('.story-intro')).toBeVisible();
    await expect(story.locator('.story-flow .story-step')).toHaveCount(3);
    await expect(story.locator('.story-outcome > div')).toHaveCount(2);
    await expect(story.locator('.story-features li')).toHaveCount(3);
    await expect(page.locator('.project-quickstart, .detail-hero .package')).toHaveCount(0);
    const homepage=page.locator('.detail-hero [data-platform=homepage]');
    await expect(homepage).toHaveCount(project==='interaction-inspector'?0:1);
  }
});

test('Juliya comparison supports each language and retains content across navigation', async ({page})=>{
  await page.goto('/ko/projects/juliya/');
  const language = page.locator('#demo-language');
  await expect(language).toHaveClass(/om-select-dropdown-trigger/);
  await expect(language).toHaveRole('combobox');
  for (const locale of ['ko','en','ja','zh-CN']) {
    await language.press('Enter');
    await expect(language).toHaveAttribute('aria-expanded','true');
    await page.locator('#demo-language-host').getByRole('option',{name:languageNames[locale as Language],exact:true}).click();
    await expect(page.locator('#native-wrap')).toHaveAttribute('lang',locale);
    await expect(page.locator('#optimized-wrap')).toHaveAttribute('lang',locale);
    await expect.poll(async()=>await page.locator('#optimized-wrap').textContent()).toBe(await page.locator('#native-wrap').textContent());
  }
  await page.goto('/ko/projects/kowrap/');
  await expect(page).toHaveURL(/\/ko\/projects\/juliya\/$/);
});

test('404 offers a keyboard-operable return to the public homepage', async ({page})=>{
  await page.goto('/404.html');
  await expect(page.locator('main h1')).toHaveText('404');
  await page.locator('main a[href="/"]').focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('http://127.0.0.1:4322/');
});

test('initial language control preserves its reserved geometry before script enhancement', async ({page})=>{
  await page.setViewportSize({width:1280,height:900});
  let releaseScripts: (()=>void) | undefined;
  const pending = new Promise<void>(resolve=>{releaseScripts=resolve;});
  await page.route('**/_astro/*.js',async route=>{await pending;await route.continue();});
  await page.goto('/ko/',{waitUntil:'commit'});
  try {
    const fallback=page.locator('.language-picker-fallback');
    await expect(fallback).toBeVisible();
    const before=await fallback.boundingBox();
    expect(before).not.toBeNull();
    releaseScripts?.();
    await expect(page.locator('#language-select')).toBeVisible();
    const after=await page.locator('.language-select').boundingBox();
    expect(Math.abs(before!.width-after!.width)).toBeLessThanOrEqual(1);
    expect(Math.abs(before!.x-after!.x)).toBeLessThanOrEqual(1);
  } finally { releaseScripts?.(); }
});

test('multilingual wrapping preserves editorial text and links after resize and back navigation', async ({page,browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});
  const plain=await context.newPage();
  const normalized=(text:string)=>text.replace(/\s+/g,'');
  try {
    for (const path of ['/','/ja/','/zh-cn/']) {
      await page.setViewportSize({width:390,height:850});
      await page.goto(path);
      await plain.goto('http://127.0.0.1:4322'+path);
      const originals=(await plain.locator('main h1, main h2, main h3, main h4, main p, main li, main figcaption').allTextContents()).map(normalized);
      await expect(page.locator('#hero-title')).toHaveAttribute('data-juliya-applied','true');
      for (const width of [320,1280]) {
        await page.setViewportSize({width,height:850});
        await expect.poll(()=>page.locator('[data-juliya-applied]').evaluateAll(nodes=>nodes.every(el=>el.scrollWidth<=el.clientWidth+1))).toBe(true);
        expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        for(const value of await page.locator('[data-juliya-applied]').allTextContents()) expect(originals).toContain(normalized(value));
      }
    }
    await page.goto('/ko/skills/');
    await page.locator('[data-stage-select="quality"]').click();
    await page.locator('a[href="/ko/skills/accessibility/"]').click();
    await page.goBack();
    await expect(page.locator('.skill-flow-section')).toBeVisible();
    await expect(page.locator('[data-stage-panel]:visible')).toHaveCount(1);
  } finally {await context.close();}
});
