const { chromium } = require('playwright');

(async () => {
    console.log("Opening persistent Chrome profile...");
    
    // Launch the persistent profile in headed mode
    const browserContext = await chromium.launchPersistentContext('C:/automation-profile', {
        headless: false,
        channel: 'chrome'
    });

    const page = browserContext.pages().length > 0 ? browserContext.pages()[0] : await browserContext.newPage();
    
    console.log("Navigating to Grounded AI Sign In...");
    await page.goto('https://grounded-topaz.vercel.app/sign-in');

    console.log("====================================================");
    console.log(">>> ACTION REQUIRED: Please log into Google manually.");
    console.log(">>> The browser will stay open for 5 minutes.");
    console.log(">>> Once you see the dashboard, you can safely close the browser.");
    console.log("====================================================");

    // Give the user 5 minutes to complete the manual login
    await page.waitForTimeout(5 * 60 * 1000);

    await browserContext.close();
    console.log("Profile setup complete!");
})();
