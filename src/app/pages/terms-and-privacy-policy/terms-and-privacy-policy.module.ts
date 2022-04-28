import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TermsAndPrivacyPolicyPageRoutingModule } from './terms-and-privacy-policy-routing.module';
import { TermsAndPrivacyPolicyPage } from './terms-and-privacy-policy.page';
import { HeaderModule } from 'src/app/components/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderModule,
    TermsAndPrivacyPolicyPageRoutingModule
  ],
  declarations: [TermsAndPrivacyPolicyPage]
})
export class TermsAndPrivacyPolicyPageModule {}
