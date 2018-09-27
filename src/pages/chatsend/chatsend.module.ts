import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatsendPage } from './chatsend';
import {RelativeTime} from "../../pipes/relative-time";
import {EmojiPickerComponentModule} from "../../components/emoji-picker/emoji-picker.module";
import {ChatService} from "../../providers/chat-service";
import {EmojiProvider} from "../../providers/emoji";
import {ChatPageModule} from "../chat/chat.module";

@NgModule({
  declarations: [
    ChatsendPage
  ],
  imports: [
    EmojiPickerComponentModule,
    ChatPageModule,
    IonicPageModule.forChild(ChatsendPage),
  ],
  exports: [
    ChatsendPage
  ],
  providers: [
    ChatService,
    EmojiProvider
  ]
})
export class ChatsendPageModule {}
