const { test, expect } = require('./fixtures');
test.describe.configure({ mode: 'serial' });
test("check conversation module page Working or not", async ({ groundedPage, conversation }) => {
    test.setTimeout(60000);
    const { page, browserContext } = groundedPage;

    await test.step("check Conversation module page", async () => {

        await conversation.clickConversation();
        await expect(conversation.pageTitle).toContainText("Conversation Analysis");
    });
});
test("Check all conversation sub  modules Working or not", async ({ groundedPage, conversation }) => {
    test.setTimeout(60000);
    const { page, browserContext } = groundedPage;
    await conversation.clickConversation();

    await test.step("check all conversation sub modules", async () => {

        await conversation.checkModule();

    });
});
test("Check All component wrok on transcriptmodule", async ({ groundedPage, conversation }) => {
    const { page, browserContext } = groundedPage;
    await conversation.clickConversation();
    await test.step("check transcript module page", async () => {
        await conversation.transcriptmodulecheck();
    })
});
test("Check Live Session module", async ({ groundedPage, conversation }) => {
    const { page, browserContext } = groundedPage;
    await conversation.clickConversation();
    await test.step("Check Live Session module is working or not", async () => {
        await conversation.livesessionmodule.click();
        await expect(conversation.pageTitle).toContainText("Live Session");
    })
    await test.step("Write title on Live session", async () => {
        await conversation.livesessiontitle.fill("Live Session Using Automation");
        await expect(conversation.livesessiontitle).toHaveValue("Live Session Using Automation");
    })

});

