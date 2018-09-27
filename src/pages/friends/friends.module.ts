import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {FriendsPage} from './friends';
import {ChatPageModule} from "../chat/chat.module";

@NgModule({
  declarations: [
    FriendsPage,
  ],
  imports: [ChatPageModule,

    IonicPageModule.forChild(FriendsPage),
  ],
})
export class FriendsPageModule {
}
