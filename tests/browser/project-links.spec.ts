import { expect, test } from '@playwright/test';

test('workflow resource cards align their public GitHub and localized documentation actions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const prefix of ['', 'ko/', 'ja/', 'zh-cn/']) {
    await page.goto('/' + prefix + 'projects/');
    const cards = page.locator('.ecosystem-grid article');
    await expect(cards).toHaveCount(2);
    for (const [index, name] of ['skills', 'agents'].entries()) {
      const card = cards.nth(index);
      const github = card.locator('[data-platform=github]');
      const docs = card.locator('[data-platform=docs]');
      await expect(github).toHaveAttribute('href', 'https://github.com/Oddmash/oddmash-' + name);
      await expect(docs).toHaveAttribute('href', '/' + prefix + name + '/');
      await expect(github).toHaveAccessibleName(/GitHub/);
      await expect(docs).toHaveAccessibleName(/Oddmash/);
      await expect(card.locator('a a, a button')).toHaveCount(0);
      const bounds = await card.evaluate(el => {
        const container = el.getBoundingClientRect();
        const docs = el.querySelector('[data-platform=docs]')!.getBoundingClientRect();
        const padding = parseFloat(getComputedStyle(el).paddingRight);
        return { right: container.right - docs.right, padding };
      });
      expect(Math.abs(bounds.right - bounds.padding - 1)).toBeLessThan(2);
    }
    const bottoms = await cards.locator('.platform-links').evaluateAll(rows => rows.map(row => row.getBoundingClientRect().bottom));
    expect(Math.abs(bottoms[0] - bottoms[1])).toBeLessThan(2);
  }

  await page.goto('/ko/projects/');
  const skillCard = page.locator('.ecosystem-grid article').first();
  const description = skillCard.locator('p');
  await description.scrollIntoViewIfNeeded();
  const box = (await description.boundingBox())!;
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page).toHaveURL(/\/ko\/skills\/$/);

  await page.goto('/ko/projects/');
  const repo = 'https://github.com/Oddmash/oddmash-skills';
  await page.route(repo, route => route.fulfill({ contentType: 'text/html', body: '<title>Skills repository</title>' }));
  await skillCard.locator('[data-platform=github]').click();
  await expect(page).toHaveURL(repo);

  await page.goto('/ko/projects/');
  const agentDocs = page.locator('.ecosystem-grid article').last().locator('[data-platform=docs]');
  await agentDocs.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/ko\/agents\/$/);
});

test('project and workflow card actions remain independently usable with roomy hit targets', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 740 });
  for (const path of ['/ko/', '/ko/projects/', '/ko/projects/boundra/']) {
    await page.goto(path);
    const sizes = await page.locator('main .platform-link').evaluateAll(links => links.map(link => {
      const { width, height } = link.getBoundingClientRect();
      return { width, height };
    }));
    expect(sizes.length).toBeGreaterThan(0);
    expect(sizes.every(({ width, height }) => width >= 47 && height >= 47)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    await expect(page.locator('main a a, main a button')).toHaveCount(0);
  }

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/ko/projects/');
  const first = page.locator('.catalog-entry').first();
  const media = first.locator('.catalog-identity picture');
  await media.scrollIntoViewIfNeeded();
  const box = (await media.boundingBox())!;
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page).toHaveURL(/\/ko\/projects\/juliya\/$/);

  await page.goto('/ko/projects/');
  const homepage = page.locator('.catalog-entry').first().locator('[data-platform=homepage]');
  await expect(homepage).toHaveAccessibleName(/Juliya/);
  const url = (await homepage.getAttribute('href'))!;
  await page.route(url, route => route.fulfill({ contentType: 'text/html', body: '<title>Juliya homepage</title>' }));
  await homepage.click();
  await expect(page).toHaveURL(url);
});
