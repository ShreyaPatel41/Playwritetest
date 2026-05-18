const base = require('@playwright/test');
const { Conversation } = require('../pageObjects/Conversation');
const { TryGroundedSessioncheck } = require('../pageObjects/TryGroundedSessioncheck');
const { Responseaudit } = require('../pageObjects/Responseaudit');
const { bulkaudit } = require('../pageObjects/bulkaudit');

const path = require('path');
const fs = require('fs');

// Extend base test to include pre-configured groundedPage and Page Objects
const test = base.test.extend({
    // Fixture to automatically boot persistent context or standard context using storage state
    groundedPage: async ({}, use, testInfo) => {
        let browserContext;
        let isCI = !!process.env.CI;

        if (isCI) {
            // In CI (GitHub Actions): Use standard headless chromium with saved user.json storage state
            const authPath = path.join(__dirname, '../.auth/user.json');
            
            // Launch standard headless browser
            const browser = await base.chromium.launch({
                headless: true
            });
            
            // Create a fresh context loaded with the saved authentication state
            browserContext = await browser.newContext({
                storageState: fs.existsSync(authPath) ? authPath : undefined,
                recordVideo: {
                    dir: path.join(testInfo.outputDir, 'videos')
                }
            });
            
            // Keep reference to browser so we can close it in teardown
            browserContext._browser = browser;
        } else {
            // Locally: Launch persistent Chrome browser context
            browserContext = await base.chromium.launchPersistentContext('C:/automation-profile', {
                headless: false,
                channel: 'chrome',
                recordVideo: {
                    dir: path.join(testInfo.outputDir, 'videos')
                }
            });
        }

        // Start tracing before the test runs to capture screenshots, snapshots, and sources
        await browserContext.tracing.start({ screenshots: true, snapshots: true, sources: true });

        // Get the active page or create a new one
        const page = browserContext.pages().length > 0 ? browserContext.pages()[0] : await browserContext.newPage();
        
        // Go to grounded dashboard to ensure we are logged in
        const check = new TryGroundedSessioncheck(page);
        await check.gotogrounded();
        
        console.log("--------------------------------------------------");
        console.log(">>> DEBUG INFO FOR AUTHENTICATION <<<");
        console.log("Current page URL:", page.url());
        console.log("Current page title:", await page.title());
        console.log("--------------------------------------------------");

        // Pass the context and page to the test
        await use({ page, browserContext });

        // Capture a full-page screenshot if the test fails
        if (testInfo.status !== testInfo.expectedStatus) {
            const screenshotPath = path.join(testInfo.outputDir, 'failure-screenshot.png');
            await page.screenshot({ path: screenshotPath, fullPage: true });
            await testInfo.attach('failure-screenshot', {
                path: screenshotPath,
                contentType: 'image/png'
            });
        }

        // Stop tracing and attach trace.zip to the report
        const tracePath = path.join(testInfo.outputDir, 'trace.zip');
        await browserContext.tracing.stop({ path: tracePath });
        await testInfo.attach('trace', {
            path: tracePath,
            contentType: 'application/zip'
        });

        // Auto-close context and browser after test completion
        await browserContext.close();
        if (browserContext._browser) {
            await browserContext._browser.close();
        }
    },

    // Fixture for Conversation Page Object
    conversation: async ({ groundedPage }, use) => {
        const conv = new Conversation(groundedPage.page);
        await use(conv);
    },

    // Fixture for Response Audit Page Object
    responseaudit: async ({ groundedPage }, use) => {
        const resp = new Responseaudit(groundedPage.page);
        await use(resp);
    },

    // Fixture for Bulk Audit Page Object
    bulkaudit: async ({ groundedPage }, use) => {
        const bulk = new bulkaudit(groundedPage.page);
        await use(bulk);
    }
});

module.exports = { test, expect: base.expect };
