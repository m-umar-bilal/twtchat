import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsGroupsPage } from './settings-groups';

@NgModule({
  declarations: [
    SettingsGroupsPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsGroupsPage),
  ],
})
export class SettingsGroupsPageModule {}
