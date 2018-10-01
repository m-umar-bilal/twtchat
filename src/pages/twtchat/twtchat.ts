import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

import {AboutPage} from '../about/about';
import {PrivatePoliyPage} from '../private-poliy/private-poliy';
import {EmailComposer} from "@ionic-native/email-composer";

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private emailComposer: EmailComposer) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TwtchatPage');
  }

  about() {
    this.navCtrl.push("AboutPage");
  }

  privatepoliy() {
    this.navCtrl.push("PrivatePoliyPage");
  }

  contact() {

    this.emailComposer.isAvailable().then((available: boolean) => {
      if (available) {
        //Now we know we can send
      }
    });

    let email = {
      to: 'info@twtchat.net',

      subject: 'Support',
      body: 'I need help about?',
      isHtml: true
    };

// Send a text message using default options
    this.emailComposer.open(email);
  }
}
