import { Component } from '@angular/core';
import {Events, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import { GroupInfoPage } from '../group-info/group-info';
import {environment} from "../../env";
import {RestService, ToastAlertsService} from "../../services";

@IonicPage()
@Component({
  selector: 'page-settings-groups',
  templateUrl: 'settings-groups.html',
})
export class SettingsGroupsPage {
  terms;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public serverURL: string = environment.API_URL;
  constructor(public navCtrl: NavController, public navParams: NavParams,  private toastsAlertService: ToastAlertsService,
              public events: Events,public svc:RestService, public loadingCtrl: LoadingController) {
    events.subscribe('user:updated', (user, time) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome', user, 'at', time);
      this.currentUser = user;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsGroupsPage');
  }
  groupinfo(){
  this.navCtrl.push("GroupInfoPage");
}
}
