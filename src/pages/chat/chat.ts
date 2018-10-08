import {Component} from '@angular/core';
import {Events, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {ChatsendPage} from '../chatsend/chatsend';
import {RestService, ToastAlertsService} from "../../services";
import {environment} from "../../env";

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public serverURL: string = environment.API_URL;
  deletedChat = {};

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public events: Events, public svc: RestService, public loadingCtrl: LoadingController,
              public toastsAlertService: ToastAlertsService,) {
    events.subscribe('user:updated', (user, time) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome', user, 'at', time);
      this.currentUser = user;
    });
    if (localStorage.getItem(this.currentUser.user_id + 'deletedPrivates')) {
      this.deletedChat = JSON.parse(localStorage.getItem(this.currentUser.user_id + 'deletedPrivates'));
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');

  }

  chatsend() {
    this.navCtrl.push("ChatsendPage");
  }

  private presentToast(text) {
    let toast = this.toastsAlertService.createToast(text
    );
    toast.present();
  }

  deleteChat(id, date, private_id) {

    let loader = this.loadingCtrl.create({
      spinner: 'hide',
    });
    loader.present();


    this.svc.deletePrivateChat(this.currentUser.email, this.currentUser.password, private_id)
      .subscribe((res: any) => {
          loader.dismiss();
          this.presentToast("Chat deleted.");


          if (this.deletedChat) {

            let str = id + '-' + date;
            this.deletedChat[str] = true;
            localStorage.setItem(this.currentUser.user_id + 'deletedPrivates', JSON.stringify(this.deletedChat))
          }
          else {
            let str = id + '-' + date;

            this.deletedChat[str] = true;

            localStorage.setItem(this.currentUser.user_id + 'deletedPrivates', JSON.stringify(JSON.stringify(this.deletedChat)))
          }

        },
        err => {
          loader.dismiss();

          this.presentToast("Error deleting chat");
        })


  }

  updateGroup(id) {
    // this.svc.userData.privates.filter(item => item.id === id)[0].unread = "0";

    this.svc.updateUnreadGroup(this.currentUser.email, this.currentUser.password, id)
      .subscribe((res: any) => {
          if (res.error_message === "") {
            // this.presentToast("Updated");
            this.svc.userData.privates.filter(item => item.id === id)[0].unread = "0";

            // this.groupData.readonly = status;
          }

        },
        err => {

        })
  }
}
