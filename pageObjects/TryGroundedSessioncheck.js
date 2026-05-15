class TryGroundedSessioncheck {
    constructor(page) {
        this.page = page;
    }
    async gotogrounded() {
        await this.page.goto('https://grounded-topaz.vercel.app/dashboard');
    }
}
module.exports = { TryGroundedSessioncheck }