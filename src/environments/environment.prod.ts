let apiUrl: string;

switch (window.location.host) {

  case 'driver.fariaslgx.com':
    apiUrl = 'https://api.fariaslgx.com';
    break;

  case 'homologdriver.fariaslgx.com':
    apiUrl = 'https://homologapi.fariaslgx.com';
    break;

  default:
    apiUrl = 'http://localhost:8000';
    break;

}

export const environment = {
  production: true,
  apiUrl: apiUrl
}