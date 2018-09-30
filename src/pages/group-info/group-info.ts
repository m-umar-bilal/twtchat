import { Component } from '@angular/core';
import {Events, IonicPage, Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import {environment} from "../../env";
import {RestService} from "../../services";

/**
 * Generated class for the GroupInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-group-info',
  templateUrl: 'group-info.html',
})
export class GroupInfoPage {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public serverURL: string = environment.API_URL;
  private group_id: any;
  groupData;
  private loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, private svc: RestService, public loadingCtrl: LoadingController, public events: Events) {
    events.subscribe('user:updated', (user, time) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome', user, 'at', time);
      this.currentUser = user;
    });
    this.group_id = navParams.get("id");
    this.getGroup();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupInfoPage');
  }
  getGroup() {

    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();
    this.svc.getOneGroup(this.currentUser.email, this.currentUser.password, this.group_id).subscribe((data: any) => {
      this.loading.dismissAll()

      // this.searchGroups();
      if(data.error_message===""){
        this.groupData = data.group;
      }
    }, error2 => {
      this.loading.dismissAll()

      // this.searchGroups();

    })
  }
}
