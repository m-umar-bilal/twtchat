import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PendingFriendsPage } from './pending-friends';

@NgModule({
  declarations: [
    PendingFriendsPage,
  ],
  imports: [
    IonicPageModule.forChild(PendingFriendsPage),
  ],
})
export class PendingFriendsPageModule {}
