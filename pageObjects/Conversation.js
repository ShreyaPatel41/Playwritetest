const { expect } = require('@playwright/test');
class Conversation {
    constructor(page) {
        this.page = page;
        this.Conversation = page.locator('xpath=/html/body/div[1]/div/div[1]/nav/button[4]');
        this.pageTitle = page.locator('xpath=/html/body/div[1]/div/div[3]/div/div/div[1]/div[1]/div[2]')
        this.transcriptmodule = page.locator('xpath=/html/body/div[1]/div/div[3]/div/div/div[1]/div[2]/div/button[1]')
        this.livesessionmodule = page.locator('xpath=/html/body/div[1]/div/div[3]/div/div/div[1]/div[2]/div/button[2]')
        this.AIChatbotModule = page.locator('xpath=/html/body/div[1]/div/div[3]/div/div/div[1]/div[2]/div/button[3]')
        this.transcriptInput = page.locator('input[placeholder*="Support Chatbot Test"]');
        this.transcriptrefupload = page.locator('button:has-text("Upload file")');
        this.transcriptRefURL = page.locator('button:has-text("URL")');
        this.transcriptRefPasttext = page.locator('button:has-text("Paste text")');
        this.transcriptrEnterUrl = page.locator('input[placeholder*="URL"], input[placeholder*="Enter"], input[placeholder*="http"]');
        this.transcripttextarea = page.locator('textarea[placeholder*="Q:"]');
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
    async transcriptmodulecheck() {
        await this.transcriptmodule.click();
        await expect(this.pageTitle).toContainText('Conversation Analysis');
        console.log("Check all Transcript component is working or not");
        console.log("First check the Transcript title is working or not");
        console.log("Write title");
        await this.transcriptInput.waitFor({ state: 'visible' });
        await this.transcriptInput.fill('NewTranscript Using automation');
        await expect(this.transcriptInput).toHaveValue('NewTranscript Using automation');
        console.log("Clear title");
        await this.transcriptInput.clear();
        await expect(this.transcriptInput).toHaveValue('');
        console.log("click reference type upload");
        await this.transcriptrefupload.click();
        await expect(this.page.locator('text=Click to upload or drag & drop')).toBeVisible();
        console.log("click reference type URL");
        await this.transcriptRefURL.click();
        await this.transcriptrEnterUrl.fill('www.google.com');
        await expect(this.transcriptrEnterUrl).toHaveValue('www.google.com');
        console.log("click reference type Past text");
        await this.transcriptRefPasttext.click();
        console.log("Write past text");
        await this.transcripttextarea.fill('This is transcript using automation');
        await expect(this.transcripttextarea).toHaveValue('This is transcript using automation');
        console.log("Clear past text");
        await this.transcripttextarea.clear();
        await expect(this.transcripttextarea).toHaveValue('');
    }
}
module.exports = { Conversation }