import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ContactInfoPage } from '../contact-info/contact-info';

@IonicPage()
@Component({
  selector: 'page-chatsend',
  templateUrl: 'chatsend.html',
})
export class ChatsendPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatsendPage');
  }
contactinfo(){
  this.navCtrl.push(ContactInfoPage);
}
}
