import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import { ContactInfoPage } from '../contact-info/contact-info';
import { AddFriendsPage } from '../add-friends/add-friends';
import { PendingFriendsPage } from '../pending-friends/pending-friends';
import {RestService} from "../../services";
import {environment} from "../../env";

/**
 * Generated class for the FriendsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public serverURL: string = environment.API_URL;
  terms: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public events: Events,public svc:RestService) {
    events.subscribe('user:updated', (user, time) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome', user, 'at', time);
      this.currentUser = user;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendsPage');
  }
contactinfo(){
  this.navCtrl.push("ContactInfoPage");
}
addfrinds(){
  this.navCtrl.push("AddFriendsPage");
}
pendingfriends(){
  this.navCtrl.push("PendingFriendsPage");
}
}
