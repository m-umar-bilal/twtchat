import {Component, Input} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the VideoPlayerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-video-player',
  templateUrl: 'video-player.html',
})
export class VideoPlayerPage {


  url:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.url= this.navParams.get("url");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideoPlayerPage');
  }


}
