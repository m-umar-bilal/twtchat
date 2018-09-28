import {Component} from '@angular/core';
import {App, IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {SignupPage} from '../signup/signup';
import {TabsPage} from "../tabs/tabs";


@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(   public app: App,public navCtrl: NavController, public navParams: NavParams, private   platform: Platform,) {
    platform.ready().then(() => {

      if (localStorage.getItem('currentUser')) {
        this.setAppRoot("TabsPage");

      }
      else {
        // this.navCtrl.setRoot(WelcomePage);
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }

  login() {
    this.navCtrl.push("LoginPage");

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
  signup() {
    this.navCtrl.push("SignupPage");
  }

}
