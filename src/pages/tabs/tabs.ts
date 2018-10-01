import {Component} from '@angular/core';

import {SettingsPage} from '../settings/settings';
import {FriendsPage} from '../friends/friends';
import {StatusPage} from '../status/status';
import {GroupsPage} from '../groups/groups';
import {ChatPage} from '../chat/chat';
import {RestService, ToastAlertsService} from "../../services";
import {Events, IonicPage, Loading, LoadingController} from "ionic-angular";
import {environment} from "../../env";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = "ChatPage";
  tab2Root = "GroupsPage";
  tab3Root = "StatusPage";
  tab4Root = "FriendsPage";
  tab5Root = "SettingsPage";
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public serverURL: string = environment.API_URL;
  private loading: Loading;
  private sub: Subscription;

  constructor(private toastsAlertService: ToastAlertsService,
              public events: Events, private svc: RestService, public loadingCtrl: LoadingController) {
    events.subscribe('user:updated', (user, time) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome', user, 'at', time);
      this.currentUser = user;
    });
    let data = JSON.parse(localStorage.getItem("UserData"));
    if (data) {
      this.svc.userData = data;

    } else {
      this.getGroups();
    }


    this.sub = Observable.interval(5000)
      .subscribe((val) => {
        // console.log('called');
        this.getGroups_();
      });
  }

  getGroups() {
    if (localStorage.getItem('currentUser')) {
      this.loading = this.loadingCtrl.create({
        content: 'Loading...',
      });
      this.loading.present();
      this.svc.getGroups(this.currentUser.email, this.currentUser.password)
        .subscribe((res: any) => {

            this.loading.dismissAll();

            if (res.error_message === "") {
              localStorage.setItem("UserData", JSON.stringify(res));
              this.svc.userData = res;
              // console.log(res);

            } else {

            }
          },
          err => {
            // console.log(err);
            this.loading.dismissAll()

            if (err !== false) {
              // let toast = this.toastsAlertService.createToast(err);
              // toast.present();
            }
          })
    }
  }


  getGroups_() {
    if (localStorage.getItem('currentUser')) {
      this.svc.getGroups(this.currentUser.email, this.currentUser.password)
        .subscribe((res: any) => {


            if (res.error_message === "") {
              localStorage.setItem("UserData", JSON.stringify(res));
              this.svc.userData = res;
              this.events.publish('chat:updated', res, Date.now());

              console.log(res);

            } else {

            }
          },
          err => {
            console.log(err);

            if (err !== false) {
              // let toast = this.toastsAlertService.createToast(err);
              // toast.present();
            }
          })
    }
  }

}
