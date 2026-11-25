import { expect, test } from '@playwright/test';

test('capture verified public Juliya playgrounds in four locales', async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Capture one consistent Chromium asset per locale.');
  test.setTimeout(120_000);
  const targets = [
    { id: 'ko', route: '', heading: '내 문장으로 확인하기', label: '한국어', lang: 'ko' },
    { id: 'en', route: 'en/', heading: 'Try your own text', label: 'English', lang: 'en' },
    { id: 'ja', route: 'ja/', heading: '自分の文章で確認', label: '日本語', lang: 'ja' },
    { id: 'zh-cn', route: 'zh/', heading: '使用自己的文本体验', label: '简体中文', lang: 'zh-Hans' },
  ] as const;
  for (const target of targets) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1, colorScheme: 'dark', reducedMotion: 'reduce', locale: target.lang });
    try {
      const page = await context.newPage();
      await page.goto(`https://oddmash.github.io/juliya/${target.route}`, { waitUntil: 'load' });
      await expect(page.locator('#playground-title')).toHaveText(target.heading);
      await expect(page.locator('#demo-locale')).toHaveText(target.label);
      const sample = await page.locator('#demo-text').inputValue();
      await expect(page.locator('#native-preview')).toHaveText(sample);
      await expect(page.locator('#kowrap-preview')).toHaveText(sample);
      await expect(page.locator('#kowrap-preview')).toHaveAttribute('lang', target.lang);
      for (const lineCount of await page.locator('#comparison-editor .line-count').all()) await expect(lineCount).toHaveText(/^\d+/);
      await page.evaluate(() => document.fonts.ready);
      const playground = page.locator('#comparison-editor');
      await playground.screenshot({ path: testInfo.outputPath(`juliya-live-${target.id}.png`), animations: 'disabled', caret: 'hide' });
      console.log(`Juliya preview ${target.id}: ${sample}`);
    } finally {
      await context.close();
    }
  }
});
