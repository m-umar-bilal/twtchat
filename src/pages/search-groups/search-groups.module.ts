import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchGroupsPage } from './search-groups';

@NgModule({
  declarations: [
    SearchGroupsPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchGroupsPage),
  ],
})
export class SearchGroupsPageModule {}
