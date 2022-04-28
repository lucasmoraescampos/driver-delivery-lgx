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
  appUrl: appUrl,
  nexmoKey: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MzU0NDQ4NzQsImV4cCI6ODgwMzU0NDQ4NzQsImp0aSI6IlJtYklTTWk5cDNZOSIsImFwcGxpY2F0aW9uX2lkIjoiZjM3MmIxZTUtYTU1Mi00NGY0LTgyM2QtZGQ4NTRkZGI5ZjMyIn0.FK6yK3aFwQkPKwKOUQX1C1WWwAfqbWv6v65Nodv9U1Wu8-Goq9eVWWg7OaIw22ibQhbEYjs9Qi5XbQvPb6pYTM9FPweNmrLA4VnmH_EBl8K5Y33b3kFjNA4irvdGFis8iHlFOB_D1gCT_Op77YPjx5t9WgSUt3t_LevK0TMvWll3Javb5ybwPULrZhEa2rLxS1cwjTR9I2NdneJP7CiHPFGS_udP14TtdM_zQh0XZAq_8krMsOKeuJBDJxzA9iN6uC82eAMCFRqzWysji3LBKMKogLPYJj2eKRf1pT1lUoelMDJzcR_gFHBlziTVfBAuXmlJRDRnCH8PrzgMQzKV1Q'
}