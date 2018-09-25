import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TwtchatPage } from './twtchat';

@NgModule({
  declarations: [
    TwtchatPage,
  ],
  imports: [
    IonicPageModule.forChild(TwtchatPage),
  ],
})
export class TwtchatPageModule {}
