const { test, expect } = require('./fixtures');

test("check session", async ({ groundedPage, responseaudit }) => {
    test.setTimeout(120000);
    const { page } = groundedPage;

    await test.step("Click on response audit", async () => {
        // Wait for the dashboard to finish loading before clicking
        await page.waitForLoadState('networkidle');
        await responseaudit.clickResponseAudit();
    });

    await test.step("Click on hubspot", async () => {
        // Wait for the dashboard to finish loading before clicking
        await page.waitForLoadState('networkidle');
        await responseaudit.clickonhubspot();
    });

    await test.step("Click on deal", async () => {
        // Wait for the dashboard to finish loading before clicking
        await page.waitForLoadState('networkidle');
        await responseaudit.clickondeal();
    });

    await test.step("Get deal count", async () => {
        // Wait for the dashboard to finish loading before clicking
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(5000);
        const dealcount = await responseaudit.getdealcount();
        expect(dealcount).toBeGreaterThan(0);
    });

    await test.step('click on random deal', async () => {
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(5000);
        const dealcount = await responseaudit.getdealcount();
        const randomIndex = Math.floor(Math.random() * dealcount);
        await responseaudit.totaldealcount.nth(randomIndex).click();
    });

    await test.step('click on Factual', async () => {
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(5000);
        const data = await responseaudit.clickonfactual();
        expect(data).not.toBeNull();
        console.log(data);
    });

    await test.step('click on AI Generated', async () => {
        await page.waitForLoadState('networkidle');
        const data = await responseaudit.aicontent_demo();
        await page.waitForTimeout(3000);
        await expect(data).not.toBeNull();
        console.log(data);
    });
});