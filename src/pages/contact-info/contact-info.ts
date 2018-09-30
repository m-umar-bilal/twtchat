import {Component} from '@angular/core';
import {Events, IonicPage, Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
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
  public friend = null;

  constructor(public navCtrl: NavController,  private toastsAlertService: ToastAlertsService, public navParams: NavParams, private svc: RestService, private toast: ToastAlertsService, public loadingCtrl: LoadingController, public events: Events) {
    events.subscribe('user:updated', (user, time) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome', user, 'at', time);
      this.currentUser = user;
    });
    this.user_id = navParams.get("id");
    this.getGroup();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupInfoPage');
  }

  checkIfriend(): boolean {
    if (this.svc.userData.users && this.svc.userData.users.filter(user => user.user_id === this.user_id).length > 0) {
      return true;
    }
    else {
      return false
    }
  }
  checkIfriendRequest(): boolean {
    if (this.svc.userData.users_pending && this.svc.userData.users_pending.filter(user => user.user_id === this.user_id).length > 0) {
      return true;
    }
    else {
      return false
    }
  }


  getGroups() {
    if (localStorage.getItem('currentUser')) {

      this.svc.getGroups(this.currentUser.email, this.currentUser.password)
        .subscribe((res: any) => {

            this.loading.dismissAll();

            if (res.error_message === "") {
              localStorage.setItem("UserData", JSON.stringify(res));
              this.svc.userData = res;
              // console.log(res);

            } else {

            }
          },
          err => {
            // console.log(err);
            this.loading.dismissAll()

            if (err !== false) {
              // let toast = this.toastsAlertService.createToast(err);
              // toast.present();
            }
          })
    }
  }
  acceptFriendRequest(user_id,status) {
    // if(!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: 'Loading...',
      });
    // }
    this.loading.present();
    this.svc.handlefriendRequest(this.currentUser.email, this.currentUser.password,user_id,status).subscribe(()=>{
      this.getGroups();
      this.friend=true;

    },error2 => {
      let toast = this.toastsAlertService.createToast("Error");
      toast.present();
    })

  }
  declineFriendRequest(user_id,status) {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();
    this.svc.handlefriendRequest(this.currentUser.email, this.currentUser.password, user_id, status).subscribe(() => {
      this.getGroups();
      this.friend=false;

    }, error2 => {
      let toast = this.toastsAlertService.createToast("Error");
      toast.present();
    })

  }
    getGroup() {

    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();
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
