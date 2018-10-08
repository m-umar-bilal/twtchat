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
  loading_ = false;
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


    this.sub = Observable.interval(10000)
      .subscribe((val) => {
        // console.log('called');
        if (!this.loading_ && localStorage.getItem("UserData")) {
          this.getGroups_();
        }
        else {
          if (!this.loading_) {
            this.getGroups()
          }
        }
      });
  }

  getGroups() {
    if (localStorage.getItem('currentUser')) {
      this.loading = this.loadingCtrl.create({
        content: 'Loading...',
      });
      this.loading.present();
      this.loading_ = true;
      this.svc.getGroups(this.currentUser.email, this.currentUser.password)
        .subscribe((res: any) => {

            this.loading.dismissAll();

            if (res.error_message === "") {
              localStorage.setItem("UserData", JSON.stringify(res));
              this.svc.userData = res;
              // console.log(res);

            } else {

            }
            this.loading_ = false;
          },
          err => {
            // console.log(err);
            this.loading_ = false;

            this.loading.dismissAll()

            if (err !== false) {
              // let toast = this.toastsAlertService.createToast(err);
              // toast.present();
            }
          })
    }
  }


  ionViewWillLeave() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  updateDeletedChat(id, date) {

    if (localStorage.getItem(this.currentUser.user_id + 'deletedPrivates')) {

      let deletedPrivates = JSON.parse(localStorage.getItem(this.currentUser.user_id + 'deletedPrivates'));
      if (id + '-' + date in deletedPrivates && deletedPrivates[id + '-' + date] != undefined) {
        deletedPrivates[id + '-' + date] = undefined
        localStorage.setItem(id + 'deletedPrivates', JSON.stringify(deletedPrivates))
      }
    }

  }

  getGroups_() {
    if (localStorage.getItem('currentUser')) {
      this.loading_ = true;

      this.svc.getGroups(this.currentUser.email, this.currentUser.password)
        .subscribe((res: any) => {


            if (res.error_message === "") {
              localStorage.setItem("UserData", JSON.stringify(res));
              this.svc.userData = res;
              this.events.publish('chat:updated', res, Date.now());

              // if(this.svc.userData.privates){
              //   this.svc.userData.privates.forEach((item)=>this.updateDeletedChat())
              // }
              console.log(res);

            } else {

            }
            this.loading_ = false;

          },
          err => {
            console.log(err);

            if (err !== false) {
              // let toast = this.toastsAlertService.createToast(err);
              // toast.present();
            }
            this.loading_ = false;

          })
    }
  }

}
