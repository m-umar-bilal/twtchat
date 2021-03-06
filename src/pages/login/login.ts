import {Component} from '@angular/core';
import {App, IonicPage, Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
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
  private loading: Loading;

  constructor(    public app: App,
                  public navCtrl: NavController, public navParams: NavParams,  public loadingCtrl: LoadingController,private svc: RestService, private toastsAlertService: ToastAlertsService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  setAppRoot(rootPage) {
    // this.app.getActiveNavs()[0].setRoot(rootPage);
    var nav = this.app.getRootNavs()[0];


        nav.setRoot(rootPage).then(()=>{
          nav.popToRoot()
            .then(() => {
              nav.setRoot(rootPage).catch(()=>{});

            }).catch(()=>{});
        });



    // this.nav = this.app.getRootNavById('n4'); //WORKS! no console warning
    // this.nav.setRoot(rootPage);
  }

  home() {

    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();
    this.svc.login(this.user.email, this.user.password)
      .subscribe(res => {
          this.loading.dismissAll()

          if (!res.success) {
            let toast = this.toastsAlertService.createToast(res.error_message);
            toast.present();

          } else {
            let pass =  encodeURIComponent(CryptoJS.MD5(this.user.password));
            console.log(pass);
            localStorage.setItem('currentUser', JSON.stringify({...res, password:pass}));
            localStorage.setItem('active', 'show');
            this.setAppRoot("TabsPage");
          }
        },
        err => {
          this.loading.dismissAll()

          console.log(err);
          if (err !== false) {
            let toast = this.toastsAlertService.createToast("Invalid email or password");
            toast.present();
          }
        })
  }

  goToForgotPass() {
    this.navCtrl.push("ForgotPasswordPage");
  }
}
