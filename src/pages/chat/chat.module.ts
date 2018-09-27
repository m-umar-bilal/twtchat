import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatPage } from './chat';
import {TimeAgoPipe} from "time-ago-pipe";

@NgModule({
  declarations: [
    ChatPage,
    TimeAgoPipe
  ],
  imports: [
    IonicPageModule.forChild(ChatPage),
  ],
  exports:[TimeAgoPipe]
})
export class ChatPageModule {}
