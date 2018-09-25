import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {TabsPage} from "../tabs/tabs";
import {RestService, ToastAlertsService} from "../../services";

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  email;

  constructor(public navCtrl: NavController, public navParams: NavParams, private svc: RestService, private toastsAlertService: ToastAlertsService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  public forgotPassword() {

    this.svc.forgotPassword(this.email)
      .subscribe(res => {
        console.log(res);
          if (!res.success) {
            let toast = this.toastsAlertService.createToast(res.error_message);
            toast.present();

          } else {
            // localStorage.setItem('currentUser', res);
            // localStorage.setItem('active', 'show');
            // this.navCtrl.push(TabsPage);
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
