import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ContactInfoPage } from '../contact-info/contact-info';
import { AddFriendsPage } from '../add-friends/add-friends';
import { PendingFriendsPage } from '../pending-friends/pending-friends';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendsPage');
  }
contactinfo(){
  this.navCtrl.push(ContactInfoPage);
}
addfrinds(){
  this.navCtrl.push(AddFriendsPage);
}
pendingfriends(){
  this.navCtrl.push(PendingFriendsPage);
}
}
