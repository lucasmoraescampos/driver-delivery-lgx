// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

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
  production: false,
  apiUrl: apiUrl,
  appUrl: appUrl
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
