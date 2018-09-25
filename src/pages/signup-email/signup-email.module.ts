import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignupEmailPage } from './signup-email';

@NgModule({
  declarations: [
    SignupEmailPage,
  ],
  imports: [
    IonicPageModule.forChild(SignupEmailPage),
  ],
})
export class SignupEmailPageModule {}
