const { test: setup, chromium } = require('@playwright/test');
const path = require('path');

const authFile = path.join(__dirname, '../.auth/user.json');

setup('authenticate', async ({}) => {
    // 1. Open the existing persistent profile you were using
    const browserContext = await chromium.launchPersistentContext('c:/automation-profile', {
        headless: process.env.CI ? true : false,
        channel: 'chrome'
    });
    
    // 2. Navigate to the page FIRST so Playwright can access the domain's LocalStorage!
    const page = browserContext.pages().length > 0 ? browserContext.pages()[0] : await browserContext.newPage();
    await page.goto('https://grounded-topaz.vercel.app/dashboard', { waitUntil: 'networkidle' });

    // 3. Extract the cookies/tokens and save them to user.json
    await browserContext.storageState({ path: authFile });
    
    // 4. Close the heavy profile browser
    await browserContext.close();
});
