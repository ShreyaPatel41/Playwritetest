const { chromium } = require('@playwright/test');
const { TryGroundedSessioncheck } = require('../pageObjects/TryGroundedSessioncheck');
const path = require('path');
const fs = require('fs');

/**
 * Reusable helper function to launch the persistent browser context,
 * retrieve the active page, and navigate to the grounded dashboard.
 * 
 * @returns {Promise<{browserContext: import('@playwright/test').BrowserContext, page: import('@playwright/test').Page}>}
 */
async function createGroundedSession() {
    let browserContext;
    let isCI = !!process.env.CI;

    if (isCI) {
        // In CI (GitHub Actions): Use standard headless chromium with saved user.json storage state
        const authPath = path.join(__dirname, '../.auth/user.json');
        
        // Launch standard headless browser
        const browser = await chromium.launch({
            headless: true
        });
        
        // Create a fresh context loaded with the saved authentication state
        browserContext = await browser.newContext({
            storageState: fs.existsSync(authPath) ? authPath : undefined
        });
        
        // Keep reference to browser so we can close it in teardown
        browserContext._browser = browser;
    } else {
        // Locally: Launch persistent Chrome browser context
        browserContext = await chromium.launchPersistentContext('C:/automation-profile', {
            headless: false,
            channel: 'chrome'
        });
    }

    const page = browserContext.pages().length > 0 ? browserContext.pages()[0] : await browserContext.newPage();

    const check = new TryGroundedSessioncheck(page);
    await check.gotogrounded();

    return { browserContext, page };
}

module.exports = { createGroundedSession };

