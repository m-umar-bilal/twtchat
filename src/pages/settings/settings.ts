import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, App, Events, LoadingController} from 'ionic-angular';
import {EditProfilePage} from '../edit-profile/edit-profile';
import {ChatWallpaperPage} from '../chat-wallpaper/chat-wallpaper';
import {SettingsGroupsPage} from '../settings-groups/settings-groups';
import {TwtchatPage} from '../twtchat/twtchat';
import {environment} from "../../env";
import {WelcomePage} from "../welcome/welcome";
import {RestService, ToastAlertsService} from "../../services";

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public serverURL: string = environment.API_URL;
  public isToggled: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App, public events: Events, public loadingCtrl: LoadingController, private svc: RestService, private toastsAlertService: ToastAlertsService) {
    if (this.currentUser.notify && this.currentUser.notify === '1') {
      this.isToggled = true;
    }
    else {
      this.isToggled = false;
    }
    events.subscribe('user:updated', (user, time) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome', user, 'at', time);
      this.currentUser = user;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  edit() {
    this.navCtrl.push("EditProfilePage");
  }

  wallpaper() {
    this.navCtrl.push("ChatWallpaperPage");
  }

  settingGroups() {
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

  logout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("active");
    localStorage.removeItem("UserData");
    this.setAppRoot("WelcomePage");

  }

  twtchat() {
    this.navCtrl.push("TwtchatPage");
  }

  changeNoti() {
    console.log(this.isToggled)
    if (this.isToggled) {
      this.updateUserProfile("1");
    } else {
      this.updateUserProfile("0");

    }
  }

  updateUserProfile(status) {


    this.currentUser.notify = status;
    this.events.publish('user:updated', this.currentUser, Date.now());


    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    this.svc.changeNotify(this.currentUser.email, this.currentUser.password, status)
      .subscribe((res: any) => {
          if (res.error_message === "") {
            let toast = this.toastsAlertService.createToast("Updated");
            this.currentUser.notify = status;
            this.events.publish('user:updated', this.currentUser, Date.now());


            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            toast.present();
          }
        },
        err => {
          if (status === "0") {
            this.currentUser.notify = "1";
          }
          else {
            this.currentUser.notify = "0";
          }
          this.events.publish('user:updated', this.currentUser, Date.now());


          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            let toast = this.toastsAlertService.createToast("Error updating notification settings.");
            toast.present();
          // console.log(err);
          // if (err !== false) {
          //   let toast = this.toastsAlertService.createToast(err);
          //   toast.present();
          // }
        })
  }

}
