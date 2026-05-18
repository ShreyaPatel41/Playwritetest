const { test, expect, chromium } = require('@playwright/test');
const { TryGroundedSessioncheck } = require('../pageObjects/TryGroundedSessioncheck');
const { Responseaudit } = require('../pageObjects/Responseaudit');

test("check session", async ({ }, testInfo) => {
    test.setTimeout(120000);

    const browserContext = await chromium.launchPersistentContext('C:/automation-profile', {
        headless: process.env.CI ? true : false,
        channel: 'chrome'
    });

    const page = browserContext.pages().length > 0 ? browserContext.pages()[0] : await browserContext.newPage();
    const check = new TryGroundedSessioncheck(page);
    await check.gotogrounded();

    const responseaudit = new Responseaudit(page);
    await responseaudit.closePopup();
    await test.step("Click on response audit", async () => {
        // Wait for the dashboard to finish loading before clicking
        await page.waitForLoadState('networkidle');
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
        await page.waitForTimeout(3000)
        await expect(data).not.toBeNull();
        console.log(data);

    })
    // await test.step('click on run', async () => {
    //     await page.waitForLoadState('networkidle');
    //     const responseaudit = new Responseaudit(page);
    //     await responseaudit.Runaudit();

    // })
    // await test.step('check report', async () => {
    //     await page.waitForLoadState('networkidle');
    //     const responseaudit = new Responseaudit(page);
    //     const grScore = await responseaudit.checkreport();
    //     expect(grScore).not.toBeNull();
    //     console.log(grScore);
    // })

    await browserContext.close();
})