import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchGroupsPage } from './search-groups';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    SearchGroupsPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchGroupsPage)
  ],
})
export class SearchGroupsPageModule {}
