import {Component} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {AddGroupPage} from '../add-group/add-group';
import {environment} from "../../env";
import {RestService} from "../../services";
import {FormControl} from "@angular/forms";

/**
 * Generated class for the SearchGroupsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-groups',
  templateUrl: 'search-groups.html',
})
export class SearchGroupsPage {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public serverURL: string = environment.API_URL;
  searching: boolean;
  query: any = "";
  groups: any[] = [];
  searchControl: FormControl;

  constructor(public navCtrl: NavController, public navParams: NavParams, private svc: RestService,
              public events: Events) {
    this.searchControl = new FormControl();
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

    this.searchGroups();

    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {

      this.searchGroups();

    });


  }

  searchGroups() {
    this.searching = true;

    this.svc.searchGroups(this.currentUser.email, this.currentUser.password, this.query.toLowerCase()).subscribe((data: any) => {
      this.searching = false;

      if (data.error_message === "") {
        this.groups = data.groups;
      } else {
        this.groups = [];
      }
    }, error2 => {
      this.searching = false;

      this.groups = [];

    })
  }

  addGroup(id) {
    this.searching = true;
    this.svc.sendGroupRequest(this.currentUser.email, this.currentUser.password, id).subscribe((data: any) => {
      this.searchGroups();
    }, error2 => {
      this.searchGroups();

    })
  }
}
