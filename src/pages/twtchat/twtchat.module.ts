import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TwtchatPage } from './twtchat';
import {EmailComposer} from "@ionic-native/email-composer";

@NgModule({
  declarations: [
    TwtchatPage,
  ],
  imports: [
    IonicPageModule.forChild(TwtchatPage),
  ],
  providers:[EmailComposer]
})
export class TwtchatPageModule {}
