import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatWallpaperPage } from './chat-wallpaper';

@NgModule({
  declarations: [
    ChatWallpaperPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatWallpaperPage),
  ],
})
export class ChatWallpaperPageModule {}
