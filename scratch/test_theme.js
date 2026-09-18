const { chromium, firefox } = require('playwright');

async function runTest(browserType, name) {
  console.log(`\n--- Running test on ${name} ---`);
  const browser = await browserType.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`[${name} CONSOLE ${msg.type().toUpperCase()}] ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    console.log(`[${name} PAGE ERROR] ${err.message}`);
  });

  await page.goto('http://localhost:3000');
  
  // Wait for hydration
  await page.waitForTimeout(2000);

  const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log(`[${name}] Initial data-theme:`, initialTheme);

  const toggleSelector = 'button[aria-label="Toggle dark mode"]';
  await page.waitForSelector(toggleSelector);
  await page.click(toggleSelector);
  
  // Wait a bit for React to process
  await page.waitForTimeout(1000);

  const newTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log(`[${name}] data-theme after click:`, newTheme);

  if (initialTheme === newTheme) {
    console.log(`[${name}] Theme DID NOT change!`);
  } else {
    console.log(`[${name}] Theme successfully changed to ${newTheme}`);
  }
  
  // Check localStorage
  const lsTheme = await page.evaluate(() => localStorage.getItem('sellsnap-theme'));
  console.log(`[${name}] localStorage sellsnap-theme:`, lsTheme);

  await browser.close();
}

async function main() {
  await runTest(chromium, 'Chrome');
  await runTest(firefox, 'Firefox');
}

main().catch(console.error);
