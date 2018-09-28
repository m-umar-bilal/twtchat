import {Component} from '@angular/core';
import {App, IonicPage, NavController, NavParams} from 'ionic-angular';
import {TabsPage} from "../tabs/tabs";
import {RestService, ToastAlertsService} from "../../services";
import * as CryptoJS from 'crypto-js';

/**
 * Generated class for the SignupEmailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup-email',
  templateUrl: 'signup-email.html',
})
export class SignupEmailPage {
  agreed: boolean = false;
  user = {name: '', email: '', password: '', phone: '', c_password: ''};

  constructor(
    public app: App,
    public navCtrl: NavController, public navParams: NavParams, private svc: RestService, private toastsAlertService: ToastAlertsService) {

    this.user.name = this.navParams.get('name');
    this.user.email = this.navParams.get('email');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupEmailPage');
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
    this.svc.signup(this.user.name, this.user.email, this.user.password, this.user.phone)
      .subscribe(res => {
          if (!res.success) {
            let toast = this.toastsAlertService.createToast(res.error_message);
            toast.present();
          } else {
            localStorage.setItem('currentUser', JSON.stringify({
              ...res, ...this.user,
              password: encodeURIComponent(CryptoJS.MD5(this.user.password))
            }));
            localStorage.setItem('active', 'show');
            this.setAppRoot("TabsPage");

          }
        },
        err => {
          console.log(err);
          if (err !== false) {
            let toast = this.toastsAlertService.createToast(err);
            toast.present();
          }
        })
  }


}
