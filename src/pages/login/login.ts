import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {TabsPage} from '../tabs/tabs';
import {RestService, ToastAlertsService} from "../../services";
import {ForgotPasswordPage} from "../forgot-password/forgot-password";
import * as CryptoJS from 'crypto-js';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {email: '', password: ''};

  constructor(public navCtrl: NavController, public navParams: NavParams, private svc: RestService, private toastsAlertService: ToastAlertsService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  home() {


    this.svc.login(this.user.email, this.user.password)
      .subscribe(res => {
          if (!res.success) {
            let toast = this.toastsAlertService.createToast(res.error_message);
            toast.present();

          } else {
            let pass =  encodeURIComponent(CryptoJS.MD5(this.user.password));
            console.log(pass);
            localStorage.setItem('currentUser', JSON.stringify({...res, password:pass}));
            localStorage.setItem('active', 'show');
            this.navCtrl.push(TabsPage);
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

  goToForgotPass() {
    this.navCtrl.push(ForgotPasswordPage);
  }
}
