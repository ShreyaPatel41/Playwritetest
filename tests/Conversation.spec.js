const { test, expect } = require('./fixtures');
test.describe.configure({ mode: 'serial' });
test("check conversation module page Working or not", async ({ groundedPage, conversation }) => {
    test.setTimeout(120000);
    const { page, browserContext } = groundedPage;

    await test.step("check Conversation module page", async () => {

        await conversation.clickConversation();
        await expect(conversation.pageTitle).toContainText("Conversation Analysis");
    });
});
test("Check all conversation sub  modules Working or not", async ({ groundedPage, conversation }) => {
    test.setTimeout(120000);
    const { page, browserContext } = groundedPage;
    await conversation.clickConversation();

    await test.step("check all conversation sub modules", async () => {

        await conversation.checkModule();

    });
    await browserContext.close();
})

