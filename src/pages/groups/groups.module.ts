import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {GroupsPage} from './groups';
import {ChatPageModule} from "../chat/chat.module";

@NgModule({
  declarations: [
    GroupsPage,
  ],
  imports: [ChatPageModule,

    IonicPageModule.forChild(GroupsPage),
  ],
})
export class GroupsPageModule {
}
