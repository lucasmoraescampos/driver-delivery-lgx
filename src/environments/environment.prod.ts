let apiUrl: string;
let appUrl: string;

switch (window.location.host) {

  case 'driver.fariaslgx.com':
    apiUrl = 'https://api.fariaslgx.com';
    appUrl = 'https://app.fariaslgx.com';
    break;

  case 'homologdriver.fariaslgx.com':
    apiUrl = 'https://homologapi.fariaslgx.com';
    appUrl = 'https://homologadmin.fariaslgx.com';
    break;

  default:
    apiUrl = 'http://localhost:8000';
    appUrl = 'http://localhost:4200';
    break;

}

export const environment = {
  production: true,
  apiUrl: apiUrl,
  appUrl: appUrl
}