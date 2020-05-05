import { browser, protractor, by, element } from 'protractor';

export class Login{
  loginURL =
  'https://doorbboard-dev.auth0.com/' +
  'login?state=g6Fo2SBwSTJUZ3hfWmt0ZmZBaTlBZC1TbjdTRWJPNkl2amo2TKN0aWTZIGp' +
 // tslint:disable-next-line: max-line-length
 'kVVV5V1l3Y01na0l6aUQwTi0zRFdpWmFnQXlzUFNFo2NpZNkgeEpGdkVuU2FyU0VMT2doeHNtNEQyNElPM3ppYjEwVWI&client=xJFvEnSarSELOghxsm4D24IO3zib10Ub&protocol=oauth2&' +
 'redirect_uri=http%3A%2F%2Flocalhost%3A4200&audience=https%3A%2F%2F'
  // tslint:disable-next-line: max-line-length
  + 'droptables.csci.app%2Fapi%2F&scope=openid%20profile%20email&response_type=code&response_mode=query&nonce=e7o1ysSNHj6vCGnrnu.J3.IJbxWMn6M8hSQMu6AY8QU&code_challenge=n0YIy3FJLc7SPGfW5AXNY21W3F728J-BUuQ2uQ5W7hs&code_challenge_method=S256&auth0Client=eyJuYW1lIjoiYXV0aDAtc3BhLWpzIiwidmVyc2lvbiI6IjEuNi41In0%3D';

  navigateTo(){
    return browser.get(this.loginURL);
}
  getEmailTextbox() {
    return element(by.name('email'));
   }
   getPasswordTextbox() {
    return element(by.name('password'));
   }
   getUrl() {
    return browser.getCurrentUrl();
  }
}
