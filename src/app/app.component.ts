import {Component} from '@angular/core';
import {AlertController, App, Platform, ToastController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {WelcomePage} from '../pages/welcome/welcome';
import {ToastAlertsService} from "../services";

//import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // Defult TabsPage
  rootPage: any;

  private lastBack: number;
  private allowClose: boolean;


  constructor(public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private toastCtrl: ToastController,public app: App) {
    platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      platform.registerBackButtonAction(() => {
        const overlay = this.app._appRoot._overlayPortal.getActive();
        const nav = this.app.getActiveNav();
        const closeDelay = 2000;
        const spamDelay = 500;

        if(overlay && overlay.dismiss) {
          overlay.dismiss();
        } else if(nav.canGoBack()){
          nav.pop();
        } else if(Date.now() - this.lastBack > spamDelay && !this.allowClose) {
          this.allowClose = true;
          let toast = this.toastCtrl.create({
            message: "Exit app?",
            duration: closeDelay,
            dismissOnPageChange: true
          });
          toast.onDidDismiss(() => {
            this.allowClose = false;
          });
          toast.present();
        } else if(Date.now() - this.lastBack < closeDelay && this.allowClose) {
          this.platform.exitApp();
        }
        this.lastBack = Date.now();
      });


      this.rootPage = "WelcomePage"
      if (localStorage.getItem('currentUser')) {
        this.rootPage = "TabsPage"
      }
      else {
        // this.navCtrl.setRoot(WelcomePage);

        this.rootPage = "WelcomePage"

      }


      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

    });
  }


}
