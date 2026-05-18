const { test, expect } = require('./fixtures');

test("check session", async ({ groundedPage, bulkaudit }) => {
    let actualNumber;
    test.setTimeout(120000);
    const { page } = groundedPage;

    await test.step("Click on Bulk audit", async () => {
        // Wait for the dashboard to finish loading before clicking
        await page.waitForLoadState('networkidle');
        
        await test.step("Click on builkaudit ", async () => {
            await page.waitForLoadState('networkidle');
            await bulkaudit.clickbulkaudit();
        });

        await test.step("Add details on Bulk audit page", async () => {
            await page.waitForLoadState('networkidle');
            await bulkaudit.WriteTitle();
            const data = await bulkaudit.uploadfile();
            const [text, fileName, add, number] = data.split('|');
            actualNumber = number;
            expect(text).toContain(fileName);
            expect(add).toEqual(number);
            console.log(`The Uploded file name is ${text} and system attached file name is  ${fileName}, Number of Added question are ${add} , and Actual Number of Question is ${number}`);
        });

        await test.step("check running stage", async () => {
            await page.waitForLoadState('networkidle');
            const data = await bulkaudit.runningstage();
            const [data1, number] = data.split('|');
            await expect(bulkaudit.checkrunning)
                .toContainText('GR', {
                    timeout: 300000
                });
            console.log(`The Total question is ${number}`);
            console.log('All test running completed');
        });
    });
});