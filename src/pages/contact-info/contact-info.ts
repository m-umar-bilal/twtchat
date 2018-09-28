import {Component} from '@angular/core';
import {IonicPage, Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import {environment} from "../../env";
import {RestService, ToastAlertsService} from "../../services";

/**
 * Generated class for the ContactInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact-info',
  templateUrl: 'contact-info.html',
})
export class ContactInfoPage {

  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public serverURL: string = environment.API_URL;
  private user_id: any;
  userData;
  private loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, private svc: RestService, private toast: ToastAlertsService, public loadingCtrl: LoadingController) {
    this.user_id = navParams.get("id");
    this.getGroup();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupInfoPage');
  }

  getGroup() {

    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.svc.getOneProfil(this.currentUser.email, this.currentUser.password, this.user_id).subscribe((data: any) => {
      // this.searchGroups();
      this.loading.dismissAll()

      if (data.error_message === "") {
        this.userData = data;
      }
    }, error2 => {
      this.loading.dismissAll()

      // this.searchGroups();

    })
  }

  sendFriendRequest() {

    this.loading = this.loadingCtrl.create({
      content: 'Sending friend request...',
    });
    this.loading.present();
    this.svc.sendFriendRequest(this.currentUser.email, this.currentUser.password, this.user_id).subscribe((data: any) => {
      this.loading.dismissAll()

      if (data.success) {
        let alert = this.toast.createToast("Friend request is sent successfully");
        alert.present();
      }
      else {
        let alert = this.toast.createToast("Friend request was sent already.");
        alert.present();
      }
      // this.searchGroups();
      // if(data.error_message===""){
      //   this.userData = data.group;
      // }
    }, error2 => {
      this.loading.dismissAll()

      // this.searchGroups();

    })
  }
}
