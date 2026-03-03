class LoginPage {
    constructor(page) {
        this.page = page;
        this.username = page.locator('#userEmail');
        this.password = page.locator('#userPassword');
        this.loginButton = page.locator('#login');
    }

    async goToLoginPage() {
        await this.page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    }

    async loginWithValidCredentials(username, password) {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
    }
    async loginByPressingEnter(username, password) {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.password.press('Enter');
    }
    async loginButtonIsEnabled() {
        return await this.loginButton.isEnabled();
    }
    async enterValidUsername(username) {
        await this.username.waitFor({ state: 'visible' });
        await this.username.fill(username);
        const name1 = await this.username.inputValue();
        return name1;
    }


    async enterValidPassword(password) {
        await this.password.isVisible();
        await this.password.fill(password);
        const passwordValue = await this.password.inputValue();
        return passwordValue;
    }
    async invalid_Username_And_Valid_Password(username, password) {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
    }
    async valid_Username_And_Invalid_Password(username, password) {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
    }
    async invalid_Username_And_Invalid_Password(username, password) {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
    }
    async empty_Username_And_Password() {
        await this.username.fill('');
        await this.password.fill('');
        await this.loginButton.click();
    }
    async empty_Username(password) {
        await this.username.fill('');
        await this.password.fill(password);
        await this.loginButton.click();
    }
    async empty_Password(username) {
        await this.username.fill(username);
        await this.password.fill('');
        await this.loginButton.click();
    }
    async masking_Password(password) {
        await this.password.fill(password);
        const inputType = await this.password.getAttribute('type');
        return inputType === 'password';
    }

}
module.exports = LoginPage;