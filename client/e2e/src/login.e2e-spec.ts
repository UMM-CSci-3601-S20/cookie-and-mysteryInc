import { Login } from './login.po';
import { browser, by, element } from 'protractor';

describe('Login tests', () => {
    let page: Login;
    beforeEach(() => {
        page = new Login();
        browser.waitForAngularEnabled(false);
        page.navigateTo();
    });
    it('Should be at correct page', async() => {
      let url = await page.getUrl();
      expect(url.toString() === (page.loginURL)).toBe(true);
     });
});
