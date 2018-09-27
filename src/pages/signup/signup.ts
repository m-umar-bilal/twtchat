import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {SignupEmailPage} from "../signup-email/signup-email";
import {RestService, ToastAlertsService} from "../../services";

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private rs: RestService, private ts: ToastAlertsService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  goToSignup() {
    this.navCtrl.push("SignupEmailPage");
  }

  fb() {
    this.rs.loginWithFacebook().subscribe((res) => {
      console.log(res)
      let data = {name: res.name, email: res.email};
      this.navCtrl.push("SignupEmailPage", data);

    }, err => {
      let toast = this.ts.createToast("Facebook login cancelled.");
      toast.present();
    })
  }

  google() {
    this.rs.loginWithGoogle().then((res: any) => {
      console.log(res);
      let data = {name: res.displayName, email: res.email};
      this.navCtrl.push("SignupEmailPage", data);

    }).catch((err) => {
      console.log(err);
      let toast = this.ts.createToast("Google login cancelled.");
      toast.present();
    })

  }
}
