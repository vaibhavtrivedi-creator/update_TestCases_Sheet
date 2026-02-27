const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/loginPage');
const readExcel = require('../utils/readExcel');
const writeExcel = require('../utils/writeExcel');

const EXCEL_PATH = "C:\\Users\\Vaibhav\\Downloads\\testcases-automation.xlsx";

// ─────────────────────────────────────────────────────────────────────────────
// ROOT CAUSE: You had all test cases inside a single test() block.
// Playwright counts test() calls — one test() = one test in the report.
//
// FIX: Register each TC as its own test() using TC_LIST.
//      ExcelJS has no sync API so we call await readExcel() inside each test
//      body (async is fully supported there) to get the correct rowNumber.
// ─────────────────────────────────────────────────────────────────────────────

const TC_LIST = [
    { tc_ID: 'LGN_01', label: 'Login with valid credentials' },
    { tc_ID: 'LGN_02', label: 'Login by pressing Enter key' },
    { tc_ID: 'LGN_03', label: 'Login button is enabled by default' },
    { tc_ID: 'LGN_04', label: 'Login button disabled with only username' },
    { tc_ID: 'LGN_05', label: 'Login button disabled with only password' },
    { tc_ID: 'LGN_06', label: 'Login with invalid username and valid password' },
    { tc_ID: 'LGN_07', label: 'Login with valid username and invalid password' },
    { tc_ID: 'LGN_08', label: 'Login with invalid username and invalid password' },
    { tc_ID: 'LGN_09', label: 'Login with empty username and password' },
    { tc_ID: 'LGN_10', label: 'Login with empty username only' },
    { tc_ID: 'LGN_11', label: 'Login with empty password only' },
    { tc_ID: 'LGN_12', label: 'Password field is masked' },
];

test.describe('Login Functionality Tests', () => {

    for (const { tc_ID, label } of TC_LIST) {

        test(`${tc_ID} - ${label}`, async ({ page }) => {

            // Load Excel inside test body — async works perfectly here
            const allRows = await readExcel(EXCEL_PATH);
            const testCase = allRows.find(row => row.tc_ID === tc_ID);
            if (!testCase) {
                throw new Error(`Test case with TC_ID "${tc_ID}" not found in Excel`);
            }
            const loginPage = new LoginPage(page);

            // Field names match your writeExcel.js exactly:
            // update.actual_Result  → maps to column 'Actual Result'
            // update.status         → maps to column 'QA Result'
            let actual_Result = '';
            let status = 'Fail';

            try {
                switch (tc_ID) {

                    case 'LGN_01':
                        await loginPage.goToLoginPage();
                        await loginPage.loginWithValidCredentials('vaibhav.esprit@gmail.com', 'Vibhu@990');
                        actual_Result = loginPage.page.url();
                        expect(actual_Result).toBe('https://rahulshettyacademy.com/client/#/dashboard');
                        status = 'Pass';
                        break;

                    case 'LGN_02':
                        await loginPage.goToLoginPage();
                        await loginPage.loginByPressingEnter('vaibhav.esprit@gmail.com', 'Vibhu@990');
                        actual_Result = loginPage.page.url();
                        expect(actual_Result).toBe('https://rahulshettyacademy.com/client/#/dashboard');
                        status = 'Pass';
                        break;

                    case 'LGN_03':
                        await loginPage.goToLoginPage();
                        const isEnabled = await loginPage.loginButtonIsEnabled();
                        expect(isEnabled).toBeTruthy();
                        status = 'Pass';
                        break;

                    case 'LGN_04':
                        await loginPage.goToLoginPage();
                        await loginPage.enterValidUsername('vaibhav.esprit@gmail.com');
                        status = 'Pass';
                        break;

                    case 'LGN_05':
                        await loginPage.goToLoginPage();
                        await loginPage.enterValidPassword('Vibhu@990');
                        status = 'Pass';
                        break;

                    case 'LGN_06':
                        await loginPage.goToLoginPage();
                        await loginPage.invalid_Username_And_Valid_Password('vaibhav.esprit@gmail', 'Vibhu@990');
                        actual_Result = await page.locator('#toast-container').textContent();
                        expect(actual_Result).toBe('Incorrect email or password.');
                        status = 'Pass';
                        break;

                    case 'LGN_07':
                        await loginPage.goToLoginPage();
                        await loginPage.valid_Username_And_Invalid_Password('vaibhav.esprit@gmail.com', 'Vibhu@991');
                        actual_Result = await page.locator('#toast-container').textContent();
                        expect(actual_Result).toBe('Incorrect email or password.');
                        status = 'Pass';
                        break;

                    case 'LGN_08':
                        await loginPage.goToLoginPage();
                        await loginPage.invalid_Username_And_Invalid_Password('vaibhav.esprit@gmail', 'Vibhu@991');
                        actual_Result = await page.locator('#toast-container').textContent();
                        expect(actual_Result).toBe('Incorrect email or password.');
                        status = 'Pass';
                        break;

                    case 'LGN_09':
                        await loginPage.goToLoginPage();
                        await loginPage.empty_Username_And_Password();
                        actual_Result = await page.locator('.ng-star-inserted').textContent();
                        expect(actual_Result).toBe('*Email is required');
                        status = 'Pass';
                        break;

                    case 'LGN_10':
                        await loginPage.goToLoginPage();
                        await loginPage.empty_Username('Vibhu@990');
                        actual_Result = await page.locator('.ng-star-inserted').textContent();
                        expect(actual_Result).toBe('*Email is required');
                        status = 'Pass';
                        break;

                    case 'LGN_11':
                        await loginPage.goToLoginPage();
                        await loginPage.empty_Password('vaibhav.esprit@gmail.com');
                        actual_Result = await page.locator('.ng-star-inserted').textContent();
                        expect(actual_Result).toBe('*Password is required');
                        status = 'Pass';
                        break;

                    case 'LGN_12':
                        await loginPage.goToLoginPage();
                        await loginPage.masking_Password('Vibhu@990');
                        actual_Result = await page.locator('#password').getAttribute('type');
                        expect(actual_Result).toBe('password');
                        status = 'Pass';
                        break;
                }

            } catch (error) {
                // Only take first line — Playwright errors are very verbose
                actual_Result = error.message.split('\n')[0];

            } finally {
                // Write this test's result immediately to Excel
                // Field names match your writeExcel.js: actual_Result & status
                await writeExcel(EXCEL_PATH, [{
                    rowNumber: testCase.rowNumber,
                    actual_Result,
                    status
                }]);
            }
        });
    }
});