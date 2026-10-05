import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
await mkdir('test-results', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await page.emulateMedia({ reducedMotion: 'reduce' });
for (const width of [320, 375, 768, 1024, 1440]) {
  await page.setViewportSize({ width, height: 960 });
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 650) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 25)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(250);
  await page.waitForFunction(() => [...document.images].every(img => img.complete && img.naturalWidth > 0));
  await page.evaluate(() => Promise.all([...document.images].map(img => img.decode())));
  const overflow = await page.evaluate(() => ({ actual: document.documentElement.scrollWidth, expected: innerWidth, offenders: [...document.querySelectorAll('body *')].filter(el => { const r = el.getBoundingClientRect(); return r.right > innerWidth + 1 && getComputedStyle(el).position !== 'fixed'; }).map(el => el.className).slice(0, 8) }));
  assert(overflow.actual <= width, `Overflow ${width}: ${JSON.stringify(overflow)}`);
  const mobile = page.locator('.mobile-cta');
  assert.equal(await mobile.isVisible(), width < 768, `Mobile CTA at ${width}`);
  assert.equal(await page.locator('.floating-whatsapp').isVisible(), width >= 768, `Floating CTA at ${width}`);
  if (width < 768) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const box = await mobile.boundingBox(); assert(box.y + box.height <= 961 && box.y > 800);
    await page.evaluate(() => window.scrollTo(0, 0));
  }
  await page.screenshot({ path: `test-results/width-${width}.png`, fullPage: true });
  console.log(`PASS ${width}px: no overflow, correct fixed CTA, screenshot saved`);
}
const links = await page.locator('a').evaluateAll(els => els.map(el => ({ href: el.getAttribute('href'), text: el.textContent })));
for (const { href } of links) {
  if (href?.startsWith('#')) assert(await page.locator(href).count(), `Missing target ${href}`);
  if (href?.startsWith('tel:')) assert(['tel:+919942853788', 'tel:+919304951630'].includes(href));
  if (href?.startsWith('https://wa.me')) { const url = new URL(href); assert.equal(url.pathname, '/919942853788'); assert(url.searchParams.get('text')?.includes('Ganpati Travel Solutions')); }
}
const imageFailures = await page.locator('img').evaluateAll(els => els.filter(x => !x.complete || !x.naturalWidth).map(x => x.src));
assert.deepEqual(imageFailures, [], 'All images load');
await page.getByRole('button', { name: 'Netarhat', exact: true }).click();
assert((await page.getByRole('link', { name: 'Plan This Trip' }).getAttribute('href')).includes('Netarhat'));
const faq = page.getByRole('button', { name: 'Can I book through WhatsApp?', exact: true });
await faq.click(); await page.waitForTimeout(300); assert.equal(await faq.getAttribute('aria-expanded'), 'true');
await faq.click(); await page.waitForTimeout(300); assert.equal(await faq.getAttribute('aria-expanded'), 'false');
await page.setViewportSize({ width: 375, height: 900 });
await page.getByRole('button', { name: 'Open menu' }).click();
assert(await page.locator('#mobile-nav').isVisible());
await page.locator('#mobile-nav').getByRole('link', { name: 'Fleet' }).click();
await page.waitForTimeout(300); assert.equal(await page.locator('#mobile-nav').count(), 0);
await page.locator('input[name="name"]').fill('Asha & Family');
await page.locator('input[name="mobile"]').fill('123');
await page.locator('input[name="pickup"]').fill('Ranchi Airport');
await page.locator('input[name="drop"]').fill('Lalpur, Ranchi');
await page.locator('input[name="date"]').fill('2027-10-20');
await page.locator('select[name="trip"]').selectOption('Airport Transfer');
await page.locator('select[name="vehicle"]').selectOption('Innova / Crysta');
await page.evaluate(() => { window.__opened = []; window.open = (...args) => { window.__opened.push(args); return null; }; });
await page.getByRole('button', { name: 'Get Fare on WhatsApp' }).click();
assert.equal(await page.evaluate(() => window.__opened.length), 0, 'Invalid mobile must not open WhatsApp');
await page.locator('input[name="mobile"]').fill('+91 9876543210');
await page.locator('input[name="date"]').fill('2020-01-01');
await page.getByRole('button', { name: 'Get Fare on WhatsApp' }).click();
assert.equal(await page.evaluate(() => window.__opened.length), 0, 'Past date must not open WhatsApp');
await page.locator('input[name="date"]').fill('2027-10-20');
await page.getByRole('button', { name: 'Get Fare on WhatsApp' }).click();
const opened = await page.evaluate(() => window.__opened);
assert.equal(opened.length, 1); const message = new URL(opened[0][0]).searchParams.get('text');
for (const expected of ['Name: Asha & Family', 'Mobile: +919876543210', 'Pickup: Ranchi Airport', 'Drop: Lalpur, Ranchi', 'Travel Date: 2027-10-20', 'Trip Type: Airport Transfer', 'Vehicle Preference: Innova / Crysta']) assert(message.includes(expected), expected);
assert(await page.getByRole('link', { name: 'Open WhatsApp again' }).isVisible());
assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
assert.deepEqual(errors, [], 'No runtime or console errors');
console.log('PASS anchors, phone/WhatsApp links, images, destination choice, FAQ, mobile menu, validation, full encoded booking message, popup fallback, reduced motion, zero runtime errors');
await browser.close();
