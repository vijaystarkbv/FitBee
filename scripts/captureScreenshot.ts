import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];

async function run() {
  const executablePath = CHROME_PATHS.find((p) => fs.existsSync(p));
  if (!executablePath) {
    console.error('No Chrome/Edge executable found on system');
    process.exit(1);
  }

  console.log('Using browser executable:', executablePath);
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // Navigate to localhost dev server
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });

  // Wait 1s
  await new Promise((r) => setTimeout(r, 1000));

  // Check if we are on the auth page
  const emailInput = await page.$('#auth-email');
  if (emailInput) {
    console.log('Signing in on auth page...');
    await page.type('#auth-email', 'testuser_1788631438059@example.com');
    await page.type('#auth-password', 'password12345');
    await page.click('button[type="submit"]');

    // Wait for navigation or home dashboard to appear
    try {
      await page.waitForSelector('.hd-topbar-avatar, .hd-bottom-nav', { timeout: 6000 });
    } catch {
      // If login failed, try signing up a fresh account
      console.log('Login attempt failed, creating new test account...');
      const switchBtn = await page.$('.auth-toggle-btn');
      if (switchBtn) await switchBtn.click();
      await new Promise((r) => setTimeout(r, 500));
      const freshEmail = `testuser_${Date.now()}@example.com`;
      await page.type('#auth-email', freshEmail);
      await page.type('#auth-password', 'password12345');
      await page.click('button[type="submit"]');
      await page.waitForSelector('.hd-topbar-avatar, .hd-bottom-nav, .hd-greeting-name', { timeout: 8000 });
    }
    await new Promise((r) => setTimeout(r, 1000));
  }

  // Screenshot home dashboard
  const artifactDir = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\dbe6257a-5afc-4933-9783-268fdd462657';
  await page.screenshot({ path: `${artifactDir}\\01_home_after_login.png` });
  console.log('Captured 01_home_after_login.png');

  // Go to Settings tab via bottom navigation
  await page.evaluate(() => {
    const navItems = Array.from(document.querySelectorAll('.hd-nav-item'));
    const settingsItem = navItems.find((el) => el.textContent?.includes('Settings'));
    if (settingsItem) {
      (settingsItem as HTMLElement).click();
    }
  });
  await new Promise((r) => setTimeout(r, 800));

  // Now click Notifications settings item
  await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('.hd-settings-item'));
    const target = items.find((el) => {
      const text = el.textContent || '';
      return text.includes('Notifications');
    });
    if (target) {
      (target as HTMLElement).click();
    }
  });
  await new Promise((r) => setTimeout(r, 1000));

  await page.screenshot({ path: `${artifactDir}\\02_notifications_settings_audit.png` });
  console.log('Captured 02_notifications_settings_audit.png');

  // Mobile viewport audit (e.g. Pixel 7 / iPhone width 390x844)
  await page.setViewport({ width: 390, height: 844 });
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: `${artifactDir}\\03_notifications_mobile_audit.png` });
  console.log('Captured 03_notifications_mobile_audit.png');

  await browser.close();
}

run().catch((err) => {
  console.error('Screenshot script error:', err);
  process.exit(1);
});
