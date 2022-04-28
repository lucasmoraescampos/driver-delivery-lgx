import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TermsAndPrivacyPolicyPage } from './terms-and-privacy-policy.page';

const routes: Routes = [
  {
    path: '',
    component: TermsAndPrivacyPolicyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TermsAndPrivacyPolicyPageRoutingModule {}
