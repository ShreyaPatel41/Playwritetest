const { expect } = require('@playwright/test');
class Conversation {
    constructor(page) {
        this.page = page;
        this.Conversation = page.locator('xpath=/html/body/div[1]/div/div[1]/nav/button[4]');
        this.pageTitle = page.locator('xpath=/html/body/div[1]/div/div[3]/div/div/div[1]/div[1]/div[2]')
        this.transcriptmodule = page.locator('xpath=/html/body/div[1]/div/div[3]/div/div/div[1]/div[2]/div/button[1]')
        this.livesessionmodule = page.locator('xpath=/html/body/div[1]/div/div[3]/div/div/div[1]/div[2]/div/button[2]')
        this.AIChatbotModule = page.locator('xpath=/html/body/div[1]/div/div[3]/div/div/div[1]/div[2]/div/button[3]')
    }
    async clickConversation() {
        await this.Conversation.waitFor({ state: 'visible' });
        await this.Conversation.click();
        await this.pageTitle.waitFor({ state: 'visible' });
        const title = await this.pageTitle.textContent();
        return title;
    }
    async checkModule() {
        await this.transcriptmodule.click();
        await expect(this.pageTitle).toContainText('Conversation Analysis');
        await this.livesessionmodule.click();
        await expect(this.pageTitle).toContainText('Live Session');
        await this.AIChatbotModule.click();
        await expect(this.pageTitle).toContainText('Connect AI Agent');
    }
}
module.exports = { Conversation }