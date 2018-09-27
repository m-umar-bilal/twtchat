import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import { ChatsendPage } from '../chatsend/chatsend';
import {RestService} from "../../services";
import {environment} from "../../env";

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public serverURL: string = environment.API_URL;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public events: Events,public svc:RestService) {
    events.subscribe('user:updated', (user, time) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome', user, 'at', time);
      this.currentUser = user;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }
chatsend(){
  this.navCtrl.push("ChatsendPage");
}
}
