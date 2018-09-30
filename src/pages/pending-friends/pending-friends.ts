import {Component} from '@angular/core';
import {Events, IonicPage, Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import {environment} from "../../env";
import {RestService, ToastAlertsService} from "../../services";

/**
 * Generated class for the PendingFriendsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pending-friends',
  templateUrl: 'pending-friends.html',
})
export class PendingFriendsPage {
  private loading: Loading;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public serverURL: string = environment.API_URL;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private toastsAlertService: ToastAlertsService,
              public events: Events,public svc:RestService, public loadingCtrl: LoadingController) {
    events.subscribe('user:updated', (user, time) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome', user, 'at', time);
      this.currentUser = user;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PendingGroupsPage');
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

      this.loading = this.loadingCtrl.create({
        content: 'Loading...',
      });

    this.loading.present();
    this.svc.handlefriendRequest(this.currentUser.email, this.currentUser.password,user_id,status).subscribe(()=>{
      this.getGroups();
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
    this.svc.handlefriendRequest(this.currentUser.email, this.currentUser.password,user_id,status).subscribe(()=>{
      this.getGroups();
    },error2 => {
      let toast = this.toastsAlertService.createToast("Error");
      toast.present();
    })

  }

}
