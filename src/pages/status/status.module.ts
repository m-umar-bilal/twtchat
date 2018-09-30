import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatusPage } from './status';
import {ChatPageModule} from "../chat/chat.module";
import {VideoPlayerPageModule} from "../video-player/video-player.module";

@NgModule({
  declarations: [
    StatusPage,
  ],
  imports: [
    ChatPageModule,
    VideoPlayerPageModule,
    IonicPageModule.forChild(StatusPage),
  ],
})
export class StatusPageModule {}
