import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {FriendsPage} from './friends';
import {ChatPageModule} from "../chat/chat.module";
import {SearchPipe} from "../../pipes/search-groups/search-groups";

@NgModule({
  declarations: [
    FriendsPage,
    SearchPipe
  ],
  imports: [ChatPageModule,


    IonicPageModule.forChild(FriendsPage),
  ],
  exports:[SearchPipe]
})
export class FriendsPageModule {
}
