import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {AddFriendsGroupPage} from "./add-friends-group";

@NgModule({
  declarations: [
    AddFriendsGroupPage,
  ],
  imports: [
    IonicPageModule.forChild(AddFriendsGroupPage),
  ],
})
export class AddFriendsGroupPageModule {}
