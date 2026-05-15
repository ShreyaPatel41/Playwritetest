class TryGroundedlogin {
    constructor(page) {
        this.page = page;
        this.emailInput = page.locator('input[type="email"]');
        this.nextButton = page.locator('button:has-text("Next")');
        this.gmailbutton = page.locator('.cl-socialButtonsBlockButton.cl-button__google');
    }
    async gotogrounded() {
        await this.page.goto('https://grounded-topaz.vercel.app/');
    }
    async clicklogin() {
        await this.page.locator('a[href="/sign-in"]').click();
    }
    async clickongmail() {
        await this.gmailbutton.click();
    }
    async selectGoogleAccount(email) {
        // Wait for the Google account chooser and click the specific email
        await this.page.getByText(email).first().click();
    }
    
    async clickContinue() {
        // Wait for and click the 'Continue' button on the Google consent screen
        await this.page.locator('button:has-text("Continue")').first().click();
    }
    async globalLogin(email) {
        await this.gotogrounded();
        
        // Wait a moment for the site to load and check session state
        await this.page.waitForTimeout(2000); 
        
        const loginButton = this.page.locator('a[href="/sign-in"]');
        
        if (await loginButton.isVisible()) {
            console.log("You are not logged in. Proceeding to log in...");
            await this.clicklogin();
            
            // Wait for the sign-in page to load
            await this.page.waitForURL('**/sign-in');
            
            await this.clickongmail();
            await this.selectGoogleAccount(email);
            await this.clickContinue();
            
        } else {
            console.log("Awesome! You are ALREADY logged in from the saved session. Skipping login.");
        }
    }
}
module.exports = { TryGroundedlogin }