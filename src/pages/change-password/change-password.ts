import {Component} from '@angular/core';
import {App, IonicPage, NavController, NavParams} from 'ionic-angular';
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
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  cur_pass="";
  new_pass;
  con_pass;
  private currentUser: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private svc: RestService, private toastsAlertService: ToastAlertsService, public app: App) {

  this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  public changePassword() {
    if( this.cur_pass.length < 6 ){
      let toast = this.toastsAlertService.createToast("Use 6 characters or more for your password");
      toast.present();

    }
    else {

    this.svc.changePassword( this.currentUser.email,this.cur_pass,this.new_pass)
      .subscribe(res => {
        console.log(res);
          if (!res.success) {
            let toast = this.toastsAlertService.createToast(res.error_message);
            toast.present();

          } else {
            let toast = this.toastsAlertService.createToast("Your password has been updated.");
            toast.present();
            localStorage.clear();
            const root = this.app.getRootNav();
            root.popToRoot();
          }
        },
        err => {
          console.log(err);
          if (err !== false) {
            let toast = this.toastsAlertService.createToast(err);
            toast.present();
          }
        })}
  }

}
