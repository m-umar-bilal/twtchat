import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {TabsPage} from "./tabs";
import {RelativeTime} from "../../pipes/relative-time";

@NgModule({
  declarations: [
    TabsPage,
    RelativeTime
  ],
  imports: [
    IonicPageModule.forChild(TabsPage),
  ],
})
export class TabsPageModule {}
