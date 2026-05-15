class Responseaudit {
    constructor(page) {
        this.page = page;
        this.responseAuditLink = page.locator('xpath=/html/body/div[1]/div/div[1]/nav/button[2]');
        this.hubspot = page.locator('xpath=/html/body/div[1]/div/div[3]/div/div[2]/div[1]/div/div[2]/div[1]/div[2]/div[2]')
        this.deal = page.locator('xpath=/html/body/div[1]/div/div[3]/div/div[2]/div[1]/div/div[2]/div[1]/div[3]/div[1]/button[1]')
        this.totaldealcount = page.locator('xpath=/html/body/div[1]/div/div[3]/div/div[2]/div[1]/div/div[2]/div[1]/div[3]/div[2]/div')
        this.factual = page.locator('xpath=/html/body/div[1]/div/div[3]/div/div[2]/div[1]/div[2]/div[2]/div/div[1]/div[1]/div[2]/button[1]')
        this.textare = page.locator('xpath=/html/body/div[1]/div/div[3]/div/div[2]/div[1]/div[2]/div[2]/div/div[1]/textarea')
        this.generatedemo = page.locator('xpath=/html/body/div[1]/div/div[3]/div/div[2]/div[1]/div[2]/div[2]/div/div[2]/div[1]/div[2]/button[1]')
        this.getresponse = page.locator('xpath=/html/body/div[1]/div/div[3]/div/div[2]/div[1]/div[2]/div[2]/div/div[2]/div[1]/div[2]/button[3]')
        this.airesponsebox = page.locator('xpath=/html/body/div[1]/div/div[3]/div/div[2]/div[1]/div[2]/div[2]/div/div[2]/textarea')
        this.run = page.locator('xpath=/html/body/div[1]/div/div[3]/div/div[2]/div[2]/div[2]/button')
        this.exportbutton = page.locator('xpath=/html/body/div[1]/div/div[1]/div[1]/div[2]/button[4]')
        this.grScore = page.locator('xpath=/html/body/div[1]/div/div[1]/div[1]/div[1]/div[2]/div[1]/span[1]')
    }
    async clickResponseAudit() {
        await this.responseAuditLink.waitFor({ state: "visible" });
        await this.responseAuditLink.click();
    }
    async clickonhubspot() {
        await this.hubspot.waitFor({ state: "visible" });
        await this.hubspot.click();
    }
    async clickondeal() {
        await this.deal.waitFor({ state: "visible" });
        await this.deal.click();
    }
    async getdealcount() {
        // Wait for the *first* deal to become visible to avoid strict mode error
        await this.totaldealcount.first().waitFor({ state: "visible" });

        // Count all the matched deal elements
        const totalData = await this.totaldealcount.count();
        return totalData;
    }
    async clickonfactual() {
        await this.factual.waitFor({ state: "visible" });
        await this.factual.click();
        await this.textare.waitFor({ state: "visible" });
        const data = await this.textare.textContent();
        return data;
    }
    async aicontent_demo() {
        await this.generatedemo.waitFor({ state: "visible" });
        await this.generatedemo.click();
        await this.getresponse.waitFor({ state: "visible" });
        await this.getresponse.click();

        // Wait for the AI response box to appear
        await this.airesponsebox.waitFor({ state: "visible" });

        // Wait a few seconds for the AI to finish typing the response
        await this.page.waitForTimeout(5000);

        const data = await this.airesponsebox.textContent();
        return data;
    }
    async Runaudit() {
        await this.run.waitFor({ state: "visible" });
        await this.run.click();
    }
    async checkreport() {
        // Instead of blindly waiting 30 seconds (which wastes time and causes timeouts), 
        // we tell Playwright to wait specifically for the export button to appear.
        // It will wait up to 60 seconds, but if the button appears in 5 seconds, 
        // the test will instantly continue!
        await this.exportbutton.waitFor({ state: "visible", timeout: 60000 });
        await this.grScore.waitFor({ state: "visible" });
        const grScore = await this.grScore.textContent();
        return grScore;

    }
}
module.exports = { Responseaudit }
