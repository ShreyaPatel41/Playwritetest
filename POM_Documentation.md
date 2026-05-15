# Page Object Model (POM) Framework Documentation
**Project:** Playwright Automation Framework  
**Author:** Samarth Patel's Workspace

---

## 1. Introduction to Page Object Model (POM)
The Page Object Model (POM) is an industry-standard design pattern in test automation that creates an object repository for web UI elements. Under this model, for each web page in the application, there is a corresponding Page Class.

### Why POM is Essential for Your Project:
1. **Maintainability:** If a UI element changes (e.g., the `#userPassword` ID becomes `#password`), you only need to update the locator in **one** file (`LoginPage.js`), instead of modifying every single test case that logs in.
2. **Reusability:** Functions like `validLogin(email, password)` can be reused across dozens of tests.
3. **Readability:** Your `exercise1.spec.js` test file becomes a clean list of human-readable steps rather than a messy block of locators.

---

## 2. Framework Architecture
Your project has been refactored into two distinct layers:

### Layer A: The Test Scripts (`/tests/`)
* **Purpose:** Contains the actual test scenarios, assertions, and `test.step()` definitions.
* **Files:** `exercise1.spec.js`, `UIBasicstest.spec.js`
* **Rule:** Tests should NEVER contain direct hardcoded locators like `page.locator('.btn1')`. They should only call methods from the Page Objects.

### Layer B: The Page Objects (`/pageObjects/`)
* **Purpose:** Stores the locators and the action methods for specific pages.
* **Files:** 
  * `LoginPage.js` (Handles Client App Login and Registration)
  * `DashboardPage.js` (Handles the Client App Dashboard)
  * `PracticeLoginPage.js` (Handles the older UI Basics practice login)

---

## 3. Deep Dive into Your Page Classes

### A. LoginPage.js
This file maps the `https://rahulshettyacademy.com/client/#/auth/login` page.

**Key Locators Stored:**
* Email and Password fields.
* Login and Registration buttons.
* All registration form fields (Name, Phone, Occupation, etc.).

**Key Methods Available:**
* `goTo()`: Navigates the browser directly to the login URL.
* `validLogin(email, password)`: Fills in credentials and clicks login.
* `openRegistration()`: Clicks the register button to flip the UI.
* `fillRegistrationForm(...)`: Fills out the entire registration form dynamically.
* `submitRegistration()`: Checks the Terms & Conditions and submits.

### B. DashboardPage.js
This file maps the dashboard you see *after* a successful login.

**Key Locators Stored:**
* `products`: Locates the titles of the items on the dashboard.
* `ordersButton`: Locates the sidebar button to view orders.

**Key Methods Available:**
* `getProductTitles()`: Waits for the products to load and returns an array of their text contents.
* `navigateToOrders()`: Clicks the orders button in the sidebar.

### C. PracticeLoginPage.js
This file maps the `https://rahulshettyacademy.com/loginpagePractise/` page used in your basic UI tests.

**Key Locators Stored:**
* Username, password, role dropdowns, radio buttons, and error messages.

**Key Methods Available:**
* `login(username, password)`: Submits the form.
* `selectUserRadio()`, `acceptAlert()`, `selectRole()`: Interact with specific UI dropdowns and dialogs.
* `getErrorMessage()`: Returns the text of the invalid login popup.

---

## 4. How to Write a New Test using POM

When you need to automate a new scenario (for example, "Adding a product to cart"), follow these steps:

**Step 1: Update or Create a Page Object**
Open `DashboardPage.js` and add a new locator and method:
```javascript
// In the constructor:
this.addToCartBtn = page.locator(".btn-custom"); 

// New Method:
async addProductToCart() {
    await this.addToCartBtn.click();
}
```

**Step 2: Write the Test**
In your `tests/` folder, import the page object and use the method:
```javascript
const { DashboardPage } = require('../pageObjects/DashboardPage');

test("Add product to cart", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.addProductToCart();
});
```

---

## 5. Future Enhancements (Next Steps)
To make your framework even more professional, consider these future steps:
1. **Environment Variables:** Move your emails and passwords out of the code and into a `.env` file for security.
2. **Base URL Configuration:** Set `baseURL: 'https://rahulshettyacademy.com'` in `playwright.config.js` so `goTo()` methods can just use relative paths like `page.goto('/client')`.
3. **Test Data Files:** Move hardcoded test data (like "Patel", "Samarth") into a `testData.json` file.
