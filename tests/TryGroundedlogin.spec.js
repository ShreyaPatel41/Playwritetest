const { test, expect, chromium } = require('@playwright/test');
const { TryGroundedlogin } = require('../pageObjects/TryGroundedlogin');

test.describe('Try Grounded Tests with Persistent Profile', () => {
    let browserContext;
    let page;

    test.beforeAll(async () => {
        // We use the EXACT same profile we created earlier.
        // This means if you are logged into Gmail on this profile, 
        // you will automatically be logged in when clicking "Sign in with Google"!
        const userDataDir = './automation-profile';

        browserContext = await chromium.launchPersistentContext(userDataDir, {
            headless: process.env.CI ? true : false,
            channel: 'chrome'
        });

        // Use the first tab that opens
        page = browserContext.pages().length > 0 ? browserContext.pages()[0] : await browserContext.newPage();
    });

    test.afterAll(async () => {
        await browserContext.close();
    });

    // NOTE: We do NOT use "async ({ page }) =>" here anymore. 
    // We use the empty "async () =>" so it uses our persistent 'page' variable from above.

    test('check link is opne or not', async () => {
        const groundedPage = new TryGroundedlogin(page);
        await groundedPage.gotogrounded();
        await expect(page).toHaveTitle('Try Grounded AI — AI Hallucination Testing by KiwiQA');
        // await page.pause(); // Removed pause so the test can finish
    });

    test('Signin Button work or not', async () => {
        const groundedPage = new TryGroundedlogin(page);
        await groundedPage.gotogrounded();
        await groundedPage.clicklogin();
        await expect(page).toHaveURL('https://grounded-topaz.vercel.app/sign-in');
        // await page.pause();
    });

    test("try to signin using gmail", async () => {
        const groundedPage = new TryGroundedlogin(page);

        // Simply call the global login function from the Page Object!
        // It handles both logging in the first time, or skipping if already logged in.
        await groundedPage.globalLogin('samarth.patel@project-kiwiqa.com');

        // await page.pause();
    });
});
