## Authenticating DoorBoard with Auth0
For security on DoorBoard, we utilized the service Auth0. Prior to development, you will need to set 
up an account for [Auth0](https://auth0.com/) and then follow this tutorial to implement Auth0 into your code:
[Angular Login](https://auth0.com/docs/quickstart/spa/angular2/01-login).

## Tutorial Tips
- In the section [Configure Callback URL's](https://auth0.com/docs/quickstart/spa/angular2/01-login#configure-callback-urls), you'll want
to put your local domain (i.e. localhost:4200). Also do this for [Configure Logout URL's](https://auth0.com/docs/quickstart/spa/angular2/01-login#configure-logout-urls) 
and [Configure Allowed Web Origins](https://auth0.com/docs/quickstart/spa/angular2/01-login#configure-allowed-web-origins). 
When you deploy DoorBoard, you MUST also put your website's url into these fields as well so Auth0 knows to it's allowed
to authenticate it.
- You must create an Auth0 API. Navigate to "Create API" under the APIs tab. Enter a name and identifier for your API and 
set the signing algorithm to RS256
- In the file client/src/environments/environment.ts and client/src/environments/environment.prod.ts in your project, 
change "AUTH_DOMAIN" to your app's domain. Change "AUTH_CLIENT_ID" to your app's client ID and change "AUTH_API_DOMAIN" 
to your API's identifier. In server/src/main/java/umm3601/TokenVerifier.java, change instances of "AUTH_DOMAIN" to your app's domain.
Domain, client ID and API info can be found in your project's Settings.


## Deploy
After deploying, make sure to add your website's url in the fields listed in the first bullet of Tutorial Tips.
[DEPLOYMENT.md](DEPLOYMENT.md)
