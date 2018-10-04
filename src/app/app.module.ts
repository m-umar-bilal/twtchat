import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import { MyApp } from './app.component';

import { Device } from '@ionic-native/device';
import { HttpModule } from "@angular/http";
import {Geolocation} from '@ionic-native/geolocation';

//IONIC NATIVE
import { ImagePicker } from '@ionic-native/image-picker';
// import { Keyboard } from '@ionic-native/keyboard';
import { SplashScreen } from '@ionic-native/splash-screen';
// import { SocialSharing } from '@ionic-native/social-sharing';
import { StatusBar } from '@ionic-native/status-bar';
// import { Toast } from "@ionic-native/toast";
// import { FCM } from '@ionic-native/fcm';
// import { Deeplinks } from '@ionic-native/deeplinks';
// import { TouchID } from '@ionic-native/touch-id';
import { SecureStorage } from '@ionic-native/secure-storage';
// import { IOSFilePicker } from '@ionic-native/file-picker';
import {MediaCapture} from "@ionic-native/media-capture";

import {StreamingMedia} from "@ionic-native/streaming-media";

//PRELOADER

import { Camera } from '@ionic-native/camera';
import { Media } from '@ionic-native/media';
import { VideoEditor } from '@ionic-native/video-editor';
//PAGES

//MODULES


//SERVICES
import {
  CommonModalsService,
  CommonService,
  JobModalsService,
  RestService,
  UserService,
  ToastAlertsService,
  ResumeService
} from "../services";
import {HttpClientModule} from "@angular/common/http";
import {HttpService} from "../services/http-service";
import {GooglePlus} from "@ionic-native/google-plus";
import {Facebook} from "@ionic-native/facebook";
import {ChangePasswordPage} from "../pages/change-password/change-password";
import {Transfer} from "@ionic-native/transfer";
import {FilePath} from "@ionic-native/file-path";
import {File} from "@ionic-native/file";
import {TimeAgoPipe} from 'time-ago-pipe';
import {EmojiProvider} from "../providers/emoji";
import {FileChooser} from "@ionic-native/file-chooser";
import {PagerService} from "../services";
import {VideoPlayer} from "@ionic-native/video-player";
import {PhotoViewer} from "@ionic-native/photo-viewer";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {AndroidPermissions} from "@ionic-native/android-permissions";
@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{
      tabsHideOnSubPages:true,
      preloadModules: true
    }),
    HttpClientModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    ImagePicker,
    RestService,
    Device,
    UserService,
    PagerService,
    // RequestService,
    CommonService,
    Camera,
    File,
    Transfer,
    FilePath,
    SecureStorage,
    MediaCapture,
    VideoEditor,
    VideoPlayer,
    PhotoViewer,
    // File,
    AndroidPermissions,
    CommonModalsService,
EmojiProvider,
    InAppBrowser,
    ToastAlertsService,
    StatusBar,
    Facebook,
    StreamingMedia,
    FileChooser,
    Geolocation,
    GooglePlus,
    SplashScreen,Media,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
