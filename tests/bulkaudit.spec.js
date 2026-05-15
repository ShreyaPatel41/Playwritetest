const {
    test,
    expect,
    chromium
} = require('@playwright/test');
const { bulkaudit } = require('../pageObjects/bulkaudit');
const { TryGroundedSessioncheck } = require('../pageObjects/TryGroundedSessioncheck');

test("check session", async ({ }, testInfo) => {
    let actualNumber;
    test.setTimeout(120000);

    const browserContext = await chromium.launchPersistentContext('./automation-profile', {
        headless: process.env.CI ? true : false,
        channel: 'chrome',
        recordVideo: {
            dir: 'test-results/videos/' // Automatically records video of the session
        }
    });

    // Start tracing to capture full evidence of all steps and network requests
    await browserContext.tracing.start({ screenshots: true, snapshots: true, sources: true });

    const page = browserContext.pages().length > 0 ? browserContext.pages()[0] : await browserContext.newPage();

    const tryGroundedSessioncheck = new TryGroundedSessioncheck(page);
    await tryGroundedSessioncheck.gotogrounded();
    await test.step("Click on Bulk audit", async () => {
        // Wait for the dashboard to finish loading before clicking
        await page.waitForLoadState('networkidle');
        await test.step("Click on builkaudit ", async () => {
            await page.waitForLoadState('networkidle');
            const Bulkaudit = new bulkaudit(page);
            await Bulkaudit.clickbulkaudit();
        })
        await test.step("Add details on Bulk audit page", async () => {
            await page.waitForLoadState('networkidle');
            const Bulkaudit = new bulkaudit(page);
            await Bulkaudit.WriteTitle();
            const data = await Bulkaudit.uploadfile();
            const [text, fileName, add, number] = data.split('|');
            actualNumber = number;
            expect(text).toContain(fileName);
            expect(add).toEqual(number);
            console.log(`The Uploded file name is ${text} and system attached file name is  ${fileName}, Number of Added question are ${add} , and Actual Number of Question is ${number}`);



        })
        await test.step("check running stage", async () => {
            await page.waitForLoadState('networkidle');
            const Bulkaudit = new bulkaudit(page);
            const data = await Bulkaudit.runningstage();
            const [data1, number] = data.split('|');
            await expect(Bulkaudit.checkrunning)
                .toContainText('GR', {
                    timeout: 300000
                });
            console.log(`The Total question is ${number}`);
            console.log('All test running completed');
            // await page.pause(); // Disabled for CI/CD
        })

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