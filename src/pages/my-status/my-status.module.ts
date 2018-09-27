import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {MyStatusPage} from './my-status';
import {ChatPageModule} from "../chat/chat.module";

@NgModule({
  declarations: [
    MyStatusPage,
  ],
  imports: [ChatPageModule,

    IonicPageModule.forChild(MyStatusPage),
  ],
})
export class MyStatusPageModule {
}
