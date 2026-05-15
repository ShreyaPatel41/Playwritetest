const { test: setup, chromium } = require('@playwright/test');
const path = require('path');

const authFile = path.join(__dirname, '../.auth/user.json');

setup('authenticate', async ({}) => {
    // 1. Open the existing persistent profile you were using
    const browserContext = await chromium.launchPersistentContext('c:/automation-profile', {
        headless: process.env.CI ? true : false,
        channel: 'chrome'
    });
    
    // 2. Extract the cookies/tokens and save them to user.json
    await browserContext.storageState({ path: authFile });
    
    // 3. Close the heavy profile browser
    await browserContext.close();
});
