import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatsendPage } from './chatsend';

@NgModule({
  declarations: [
    ChatsendPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatsendPage),
  ],
})
export class ChatsendPageModule {}
