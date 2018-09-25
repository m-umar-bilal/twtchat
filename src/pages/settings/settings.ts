import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, App, Events} from 'ionic-angular';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { ChatWallpaperPage } from '../chat-wallpaper/chat-wallpaper';
import { SettingsGroupsPage } from '../settings-groups/settings-groups';
import { TwtchatPage } from '../twtchat/twtchat';
import {environment} from "../../env";

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public serverURL: string = environment.API_URL;

  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App,public events: Events) {
    events.subscribe('user:updated', (user, time) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome', user, 'at', time);
      this.currentUser = user;
    });
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
