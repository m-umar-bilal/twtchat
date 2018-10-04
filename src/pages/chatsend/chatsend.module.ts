import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatsendPage } from './chatsend';
import {RelativeTime} from "../../pipes/relative-time";
import {EmojiPickerComponentModule} from "../../components/emoji-picker/emoji-picker.module";
import {ChatService} from "../../providers/chat-service";
import {EmojiProvider} from "../../providers/emoji";
import {ChatPageModule} from "../chat/chat.module";
import {VgControlsModule} from "videogular2/controls";
import {VgBufferingModule} from "videogular2/buffering";
import {VgOverlayPlayModule} from "videogular2/overlay-play";
import {VgCoreModule} from "videogular2/core";

@NgModule({
  declarations: [
    ChatsendPage
  ],
  imports: [
    EmojiPickerComponentModule,
    ChatPageModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
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
