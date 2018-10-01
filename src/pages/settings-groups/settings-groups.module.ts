import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsGroupsPage } from './settings-groups';
import {FriendsPageModule} from "../friends/friends.module";

@NgModule({
  declarations: [
    SettingsGroupsPage,
  ],
  imports: [
    FriendsPageModule,
    IonicPageModule.forChild(SettingsGroupsPage),
  ],
})
export class SettingsGroupsPageModule {}
