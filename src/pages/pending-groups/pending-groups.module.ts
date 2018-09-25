import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PendingGroupsPage } from './pending-groups';

@NgModule({
  declarations: [
    PendingGroupsPage,
  ],
  imports: [
    IonicPageModule.forChild(PendingGroupsPage),
  ],
})
export class PendingGroupsPageModule {}
