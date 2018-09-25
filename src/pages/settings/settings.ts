import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { ChatWallpaperPage } from '../chat-wallpaper/chat-wallpaper';
import { SettingsGroupsPage } from '../settings-groups/settings-groups';
import { TwtchatPage } from '../twtchat/twtchat';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));

  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  edit(){
    this.navCtrl.push(EditProfilePage);
  }
  wallpaper(){
    this.navCtrl.push(ChatWallpaperPage);
  }
  settingGroups(){
    this.navCtrl.push(SettingsGroupsPage);
  }

  logout(){
    localStorage.clear();
    const root = this.app.getRootNav();
    root.popToRoot();
  }
  twtchat(){
    this.navCtrl.push(TwtchatPage);
  }
}
