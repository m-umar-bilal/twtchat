import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {SignupPage} from '../signup/signup';
import {TabsPage} from "../tabs/tabs";


@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private   platform: Platform,) {
    platform.ready().then(() => {

      if (localStorage.getItem('currentUser')) {
        this.navCtrl.push(TabsPage);

      }
      else {

      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }

  login() {
    this.navCtrl.push(LoginPage);

  }

  signup() {
    this.navCtrl.push(SignupPage);
  }

}
