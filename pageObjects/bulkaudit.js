
class bulkaudit {
    constructor(page) {
        this.page = page;
        this.Bulkaudit = page.locator('xpath=/html/body/div[1]/div/div[1]/nav/button[3]');
        this.Title = page.locator('xpath=/html/body/div[1]/div/div[3]/div/div/div[2]/div/div[2]/div[1]/div[1]/input');
        this.Uploaddocumnet = page.locator('input[type="file"]').first();
        this.lablecheck = page.locator('xpath=/html/body/div[1]/div/div[3]/div/div/div[2]/div/div[2]/div[1]/div[3]/div[2]/div[2]/div[1]')
        this.checkQuestion = page.locator('xpath=/html/body/div[1]/div/div[3]/div/div/div[2]/div/div[2]/div[1]/div[5]/div[2]/div')
        this.CheckQuestioncount = page.locator('xpath=/html/body/div[1]/div/div[3]/div/div/div[2]/div/div[2]/div[1]/div[3]/div[2]/div[2]/div[2]')
        this.checkrunning = page.locator('xpath=/html/body/div[1]/div/div[3]/div/div/div[2]/div/div[2]/div[2]/div[1]/div[3]')
        this.runbutton = page.locator('xpath=/html/body/div[1]/div/div[3]/div/div/div[2]/div/div[2]/div[2]/button')
        this.totalquestion = page.locator('xpath=/html/body/div[1]/div/div[3]/div/div/div[2]/div/div[2]/div[2]/div[1]/div[2]')
    }
    async clickbulkaudit() {
        await this.Bulkaudit.waitFor({ state: 'visible' });
        await this.Bulkaudit.click();
    }
    async WriteTitle() {
        await this.Title.waitFor({ state: 'visible' });
        await this.Title.fill("Automation test ");
    }
    async uploadfile() {

        await this.Uploaddocumnet.waitFor({
            state: 'attached'
        });
        const filePath = './test-data/dq.csv';
        await this.Uploaddocumnet.setInputFiles(
            filePath
        );


        const fileName = filePath.split('/').pop();


        console.log('File Uploaded Successfully');
        await this.lablecheck.waitFor({ state: 'visible' });
        const text = await this.lablecheck.textContent();
        const c = await this.checkQuestion.count();
        const Numnerofquestion = await this.CheckQuestioncount.textContent();
        const number = Numnerofquestion.match(/\d+/)[0];
        return `${text}|${fileName}|${c - 1}|${number}`
    }
    async runningstage() {
        await this.runbutton.waitFor({ state: 'visible' })
        await this.runbutton.click()
        await this.totalquestion.waitFor({ state: 'visible' });
        const data = await this.totalquestion.textContent();
        const Numnerofquestion = await this.CheckQuestioncount.textContent();
        const number = Numnerofquestion.match(/\d+/)[0];
        return `${data}|${number}`;

    }

}
module.exports = { bulkaudit }