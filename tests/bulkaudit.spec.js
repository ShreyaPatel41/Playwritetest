const {
    test,
    expect,
    chromium
} = require('@playwright/test');
const { bulkaudit } = require('../pageObjects/bulkaudit');
const { TryGroundedSessioncheck } = require('../pageObjects/TryGroundedSessioncheck');
const { Responseaudit } = require('../pageObjects/Responseaudit');

test("check session", async ({ }, testInfo) => {
    let actualNumber;
    test.setTimeout(120000);

    const browserContext = await chromium.launchPersistentContext('c:/automation-profile', {
        headless: process.env.CI ? true : false,
        channel: 'chrome'
    });

    const page = browserContext.pages().length > 0 ? browserContext.pages()[0] : await browserContext.newPage();

    const tryGroundedSessioncheck = new TryGroundedSessioncheck(page);
    await tryGroundedSessioncheck.gotogrounded();
    const responseaudit = new Responseaudit(page);
    await responseaudit.closePopup();
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

        })
    })

    await browserContext.close();
})