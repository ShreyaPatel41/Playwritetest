const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    // 1. Define the path for the persistent profile folder.
    // This is where all cookies, cache, and session data will be saved.
    const userDataDir = 'C:/automation-profile';

    // 2. Automatically create the profile folder if it doesn't exist yet.
    if (!fs.existsSync(userDataDir)) {
        fs.mkdirSync(userDataDir, { recursive: true });
        console.log(`Created new profile directory at: ${userDataDir}`);
    }

    console.log(`Using Chrome profile from: ${userDataDir}`);

    // 3. Launch the browser using launchPersistentContext
    const context = await chromium.launchPersistentContext(userDataDir, {
        // Run in non-headless mode so we can see the browser and log in manually
        headless: false,
        
        // Use the real Google Chrome browser instead of the bundled Chromium
        channel: 'chrome',
        
        // Optional: start maximized or add other Chrome flags
        // args: ['--start-maximized'],
        
        // Adjust viewport to null if using maximized
        // viewport: null
    });

    // 4. A persistent context automatically opens a default page.
    // We grab that first page instead of opening a new one.
    const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

    console.log('Navigating to Gmail...');
    
    // 5. Open Gmail
    await page.goto('https://gmail.com');

    console.log('----------------------------------------------------');
    console.log('Browser is open!');
    console.log('If this is your first time, please log in manually.');
    console.log('Your session will be saved automatically for next time.');
    console.log('Close the browser window manually to end the script.');
    console.log('----------------------------------------------------');

    // 6. Keep the script running until the user manually closes the browser
    await new Promise(resolve => {
        context.on('close', resolve);
    });

    console.log('Browser closed. Script finished.');
})();
