import {Component} from '@angular/core';
import {AlertController, Events, IonicPage, Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import {environment} from "../../env";
import {FormControl} from "@angular/forms";
import {RestService, ToastAlertsService} from "../../services";

/**
 * Generated class for the AddFriendsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-friends-group',
  templateUrl: 'add-friends-group.html',
})
export class AddFriendsGroupPage {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public serverURL: string = environment.API_URL;
  searching: boolean;
  query: any = "";
  groups: any[] = [];
  searchControl: FormControl;
  groupData;
  groupUsers: any;
  private loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, private svc: RestService,
              public events: Events, public loadingCtrl: LoadingController, private alertCtrl: AlertController, public toastsAlertService: ToastAlertsService) {
    this.searchControl = new FormControl();

    this.groupData = navParams.data;

    events.subscribe('user:updated', (user, time) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome', user, 'at', time);
      this.currentUser = user;
    });
  }

  addgroups() {
    this.navCtrl.push("AddGroupPage");
  }

  ionViewDidLoad() {

    this.groupUsers = this.svc.userData.users;

    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {

      this.searchGroups(search);

    });


  }


  getGroup() {

    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();
    this.svc.getOneGroup(this.currentUser.email, this.currentUser.password, this.groupData.id).subscribe((data: any) => {
      this.loading.dismissAll()
      this.searching = false;
      // this.searchGroups();
      if (data.error_message === "") {
        this.groupData = data.group;
      }
    }, error2 => {
      this.loading.dismissAll()
      this.searching = false;


      // this.searchGroups();

    })
  }

  private presentToast(text) {
    let toast = this.toastsAlertService.createToast(text
    );
    toast.present();
  }

  searchGroups(search) {
    this.searching = true;

    this.groupUsers = this.svc.userData.users.filter(it => {
      return it.name.toLowerCase().includes(search); // only filter country name
    });
    this.searching = false;
  }

  addGroup(id) {
    this.searching = true;
    this.svc.addToGroup(this.currentUser.email, this.currentUser.password, id, this.groupData.id).subscribe((data: any) => {
      this.presentToast("Participant Added");
      this.getGroup();
    }, error2 => {
      this.getGroup();


    })
  }

  Exists(id) {
    if (this.groupData.users.some((item) => item.id == id))
      return true;
    else
      return false;
  }
}
