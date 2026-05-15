const { test, expect, chromium } = require('@playwright/test');
const { TryGroundedSessioncheck } = require('../pageObjects/TryGroundedSessioncheck');
const { Responseaudit } = require('../pageObjects/Responseaudit');

test.only("check session", async ({ }, testInfo) => {
    test.setTimeout(120000);

    const browserContext = await chromium.launchPersistentContext('C:/automation-profile', {
        headless: false,
        channel: 'chrome',
        recordVideo: {
            dir: 'test-results/videos/' // Automatically records video of the session
        }
    });

    // Start tracing to capture full evidence of all steps and network requests
    await browserContext.tracing.start({ screenshots: true, snapshots: true, sources: true });

    const page = browserContext.pages().length > 0 ? browserContext.pages()[0] : await browserContext.newPage();
    const check = new TryGroundedSessioncheck(page);
    await check.gotogrounded();
    await test.step("Click on response audit", async () => {
        // Wait for the dashboard to finish loading before clicking
        await page.waitForLoadState('networkidle');

        const responseaudit = new Responseaudit(page);
        await responseaudit.clickResponseAudit();

    })
    await test.step("Click on hubspot", async () => {
        // Wait for the dashboard to finish loading before clicking
        await page.waitForLoadState('networkidle');

        const responseaudit = new Responseaudit(page);
        await responseaudit.clickonhubspot();
    })
    await test.step("Click on deal", async () => {
        // Wait for the dashboard to finish loading before clicking
        await page.waitForLoadState('networkidle');

        const responseaudit = new Responseaudit(page);
        await responseaudit.clickondeal();
    })
    await test.step("Get deal count", async () => {
        // Wait for the dashboard to finish loading before clicking
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(5000)
        const responseaudit = new Responseaudit(page);
        const dealcount = await responseaudit.getdealcount();
        expect(dealcount).toBeGreaterThan(0);

    })
    await test.step('click on random deal', async () => {
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(5000)
        const responseaudit = new Responseaudit(page);
        const dealcount = await responseaudit.getdealcount();
        const randomIndex = Math.floor(Math.random() * dealcount);
        await responseaudit.totaldealcount.nth(randomIndex).click();


    })
    await test.step('click on Factual', async () => {
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(5000)
        const responseaudit = new Responseaudit(page);
        const data = await responseaudit.clickonfactual();
        expect(data).not.toBeNull();
        console.log(data);
    })
    await test.step('click on AI Generated', async () => {
        await page.waitForLoadState('networkidle');
        const responseaudit = new Responseaudit(page);
        const data = await responseaudit.aicontent_demo();
        expect(data).not.toBeNull();
        console.log(data);

    })
    await test.step('click on run', async () => {
        await page.waitForLoadState('networkidle');
        const responseaudit = new Responseaudit(page);
        await responseaudit.Runaudit();

    })
    await test.step('check report', async () => {
        await page.waitForLoadState('networkidle');
        const responseaudit = new Responseaudit(page);
        const grScore = await responseaudit.checkreport();
        expect(grScore).not.toBeNull();
        console.log(grScore);
    })

    await test.step('Attach Evidence to Report', async () => {
        // Take a final screenshot and attach it
        const screenshot = await page.screenshot();
        await testInfo.attach('Final Evidence Screenshot', { body: screenshot, contentType: 'image/png' });

        // Stop tracing and attach it
        const tracePath = `test-results/trace-${testInfo.title.replace(/\s+/g, '-')}.zip`;
        await browserContext.tracing.stop({ path: tracePath });
        await testInfo.attach('Playwright Trace', { path: tracePath, contentType: 'application/zip' });
    });

    // Close context so the video finishes saving, then attach the video
    const video = page.video();
    await browserContext.close();
    if (video) {
        const videoPath = await video.path();
        await testInfo.attach('Session Video', { path: videoPath, contentType: 'video/webm' });
    }
})