class GmailInbox {
    constructor(page) {
        this.page = page;
        // The compose button in Gmail
        this.composeButton = page.locator("div[role='button']:has-text('Compose')");
        // The search input in Gmail
        this.searchInput = page.locator("input[aria-label='Search mail']");
    }

    async clickCompose() {
        await this.composeButton.click();
    }

    async searchEmail(keyword) {
        await this.searchInput.fill(keyword);
        await this.searchInput.press('Enter');
    }
}

module.exports = { GmailInbox };
