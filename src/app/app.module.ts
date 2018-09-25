import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import { MyApp } from './app.component';
import { ChatPage } from '../pages/chat/chat';
import { GroupsPage } from '../pages/groups/groups';
import { FriendsPage } from '../pages/friends/friends';
import { SettingsPage } from '../pages/settings/settings';
import { TabsPage } from '../pages/tabs/tabs';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { ChatWallpaperPage } from '../pages/chat-wallpaper/chat-wallpaper';
import { SettingsGroupsPage } from '../pages/settings-groups/settings-groups';
import { GroupInfoPage } from '../pages/group-info/group-info';
import { WelcomePage } from '../pages/welcome/welcome';
import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from '../pages/login/login';
import { ChatsendPage } from '../pages/chatsend/chatsend';
import { ContactInfoPage } from '../pages/contact-info/contact-info';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { SignupEmailPage } from '../pages/signup-email/signup-email';
import { PrivatePoliyPage } from '../pages/private-poliy/private-poliy';
import { SearchGroupsPage } from '../pages/search-groups/search-groups';
import { AddGroupPage } from '../pages/add-group/add-group';
import { AddFriendsPage } from '../pages/add-friends/add-friends';
import { PendingFriendsPage } from '../pages/pending-friends/pending-friends';
import { PendingGroupsPage } from '../pages/pending-groups/pending-groups';
import { AboutPage } from '../pages/about/about';
import { StatusPage } from '../pages/status/status';
import { MyStatusPage } from '../pages/my-status/my-status';
import { TwtchatPage } from '../pages/twtchat/twtchat';
import { Device } from '@ionic-native/device';
import { HttpModule } from "@angular/http";

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


//PRELOADER

import { Camera } from '@ionic-native/camera';

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

@NgModule({
  declarations: [
    MyApp,
    ChatPage,
    GroupsPage,
    FriendsPage,
    SettingsPage,
    EditProfilePage,
    ChatWallpaperPage,
    SettingsGroupsPage,
    GroupInfoPage,
    WelcomePage,
    SignupPage,
    LoginPage,
    ChatsendPage,
    ContactInfoPage,
    ForgotPasswordPage,
    SignupEmailPage,
    PrivatePoliyPage,
    SearchGroupsPage,
    AddGroupPage,
    AddFriendsPage,
    PendingFriendsPage,
    PendingGroupsPage,
    AboutPage,
    StatusPage,
    TwtchatPage,
    MyStatusPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ChatPage,
    GroupsPage,
    FriendsPage,
    SettingsPage,
    EditProfilePage,
    ChatWallpaperPage,
    SettingsGroupsPage,
    GroupInfoPage,
    WelcomePage,
    SignupPage,
    LoginPage,
    ChatsendPage,
    ContactInfoPage,
    ForgotPasswordPage,
    SignupEmailPage,
    PrivatePoliyPage,
    SearchGroupsPage,
    AddGroupPage,
    AddFriendsPage,
    PendingFriendsPage,
    PendingGroupsPage,
    AboutPage,
    StatusPage,
    TwtchatPage,
    MyStatusPage,
    TabsPage
  ],
  providers: [
    ImagePicker,
    RestService,
    Device,
    UserService,
    // RequestService,
    CommonService,
    Camera,
    SecureStorage,
    // File,
    CommonModalsService,

    ToastAlertsService,
    StatusBar,
    Facebook,
    GooglePlus,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
