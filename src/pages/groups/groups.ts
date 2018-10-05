import {Component} from '@angular/core';
import {Events, IonicPage, Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import {SearchGroupsPage} from '../search-groups/search-groups';
import {PendingGroupsPage} from '../pending-groups/pending-groups';
import {environment} from "../../env";
import {RestService, ToastAlertsService} from "../../services";

/**
 * Generated class for the GroupsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html',
})
export class GroupsPage {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public serverURL: string = environment.API_URL;
  private loading: Loading;
  deletedGroup: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams,  private toastsAlertService: ToastAlertsService,
  public events: Events,public svc:RestService, public loadingCtrl: LoadingController) {
    events.subscribe('user:updated', (user, time) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome', user, 'at', time);
      this.currentUser = user;
    });
    events.subscribe('group:deleted', (data, time) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      this.deletedGroup = data;

    });
    if (localStorage.getItem(this.currentUser.user_id + 'deletedGroups')) {
      this.deletedGroup = JSON.parse(localStorage.getItem(this.currentUser.user_id + 'deletedGroups'));
    }
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupsPage');
  }

  searchgroups() {
    this.navCtrl.push("SearchGroupsPage");
  }

  pendinggroups() {
    this.navCtrl.push("PendingGroupsPage");
  }



}
