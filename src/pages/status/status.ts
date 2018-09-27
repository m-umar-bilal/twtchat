import { Component } from '@angular/core';
import {Events, IonicPage, Loading, NavController, NavParams} from 'ionic-angular';
import { MyStatusPage } from '../my-status/my-status';
import {environment} from "../../env";

/**
 * Generated class for the StatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-status',
  templateUrl: 'status.html',
})
export class StatusPage {

  public serverURL: string = environment.API_URL;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));

  constructor(public navCtrl: NavController, public navParams: NavParams,public events: Events) {
    events.subscribe('user:updated', (user, time) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome', user, 'at', time);
      this.currentUser = user;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatusPage');
  }
mystatus(){
  this.navCtrl.push("MyStatusPage");
}
}
