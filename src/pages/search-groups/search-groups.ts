import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddGroupPage } from '../add-group/add-group';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchGroupsPage');
  }
  addgroups(){
    this.navCtrl.push("AddGroupPage");
  }
}
