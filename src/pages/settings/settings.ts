import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, App, Events} from 'ionic-angular';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { ChatWallpaperPage } from '../chat-wallpaper/chat-wallpaper';
import { SettingsGroupsPage } from '../settings-groups/settings-groups';
import { TwtchatPage } from '../twtchat/twtchat';
import {environment} from "../../env";
import {WelcomePage} from "../welcome/welcome";

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
    this.navCtrl.push("EditProfilePage");
  }
  wallpaper(){
    this.navCtrl.push("ChatWallpaperPage");
  }
  settingGroups(){
    this.navCtrl.push("SettingsGroupsPage");
  }


  setAppRoot(rootPage) {
    // this.app.getActiveNavs()[0].setRoot(rootPage);
    var nav = this.app.getRootNavs()[0];
    nav.popToRoot()
      .then(() => {
        nav.setRoot(rootPage);
      });


    // this.nav = this.app.getRootNavById('n4'); //WORKS! no console warning
    // this.nav.setRoot(rootPage);
  }
  logout(){
    localStorage.clear();
    this.setAppRoot("WelcomePage");

  }
  twtchat(){
    this.navCtrl.push("TwtchatPage");
  }
}
