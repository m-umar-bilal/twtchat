import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VideoPlayerPage } from './video-player';
import {ChatPageModule} from "../chat/chat.module";
import {VgCoreModule} from "videogular2/core";
import {VgBufferingModule} from "videogular2/buffering";
import {VgOverlayPlayModule} from "videogular2/overlay-play";
import {VgControlsModule} from "videogular2/controls";
import {EmojiPickerComponent} from "../../components/emoji-picker/emoji-picker";

@NgModule({
  declarations: [
    VideoPlayerPage,
  ],
  imports: [
    ChatPageModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    IonicPageModule.forChild(VideoPlayerPage),

    // IonicPageModule.forChild(VideoPlayerPage),

  ],
  entryComponents:[VideoPlayerPage],

  exports:[VideoPlayerPage],
})
export class VideoPlayerPageModule {}
