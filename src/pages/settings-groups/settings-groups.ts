import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GroupInfoPage } from '../group-info/group-info';

@IonicPage()
@Component({
  selector: 'page-settings-groups',
  templateUrl: 'settings-groups.html',
})
export class SettingsGroupsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsGroupsPage');
  }
  groupinfo(){
  this.navCtrl.push(GroupInfoPage);
}
}
