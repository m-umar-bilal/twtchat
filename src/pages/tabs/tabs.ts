import {Component} from '@angular/core';

import {SettingsPage} from '../settings/settings';
import {FriendsPage} from '../friends/friends';
import {StatusPage} from '../status/status';
import {GroupsPage} from '../groups/groups';
import {ChatPage} from '../chat/chat';
import {RestService, ToastAlertsService} from "../../services";
import {Events, Loading, LoadingController} from "ionic-angular";
import {environment} from "../../env";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ChatPage;
  tab2Root = GroupsPage;
  tab3Root = StatusPage;
  tab4Root = FriendsPage;
  tab5Root = SettingsPage;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public serverURL: string = environment.API_URL;
  private loading: Loading;

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
  }

  getGroups() {
    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });
    this.loading.present();
    this.svc.getGroups(this.currentUser.email, this.currentUser.password)
      .subscribe((res: any) => {

          this.loading.dismissAll();

          if (res.error_message === "") {
            localStorage.setItem("UserData", JSON.stringify(res));
            this.svc.userData = res;
            console.log(res);

          } else {

          }
        },
        err => {
          console.log(err);
          this.loading.dismissAll()

          if (err !== false) {
            let toast = this.toastsAlertService.createToast(err);
            toast.present();
          }
        })
  }

}
