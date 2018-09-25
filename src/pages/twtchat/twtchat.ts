import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AboutPage } from '../about/about';
import { PrivatePoliyPage } from '../private-poliy/private-poliy';

/**
 * Generated class for the TwtchatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-twtchat',
  templateUrl: 'twtchat.html',
})
export class TwtchatPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TwtchatPage');
  }
  about(){
    this.navCtrl.push(AboutPage);
  }
  privatepoliy(){
    this.navCtrl.push(PrivatePoliyPage);
  }
}
