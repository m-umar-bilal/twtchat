import { Component } from '@angular/core';
import {Events, IonicPage, Loading, ModalController, NavController, NavParams, Platform} from 'ionic-angular';
import { MyStatusPage } from '../my-status/my-status';
import {environment} from "../../env";
import {RestService} from "../../services";
import {PhotoViewer} from "@ionic-native/photo-viewer";
import {MediaCapture} from "@ionic-native/media-capture";
import {VideoPlayer} from "@ionic-native/video-player";
import {VideoPlayerPage} from "../video-player/video-player";

/**
 * Generated class for the StatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-status',
  templateUrl: 'status.html',
})
export class StatusPage {

  public serverURL: string = environment.API_URL;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));

  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl:ModalController,public events: Events, public svc: RestService,
              public platform: Platform, private mediaCapture: MediaCapture,
              private photoViewer: PhotoViewer) {
    events.subscribe('user:updated', (user, time) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome', user, 'at', time);
      this.currentUser = user;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatusPage');
  }
mystatus(){
  this.navCtrl.push("MyStatusPage");
}

  showImage(url){
    this.photoViewer.show(url);
  }
  showVideo(url){
    let profileModal = this.modalCtrl.create("VideoPlayerPage", { url });
    profileModal.present();}

  // showVideo(src: string, onComplete?: (src: string) => void): void {
  //   var video: HTMLVideoElement = document.createElement('video');
  //
  //   video.setAttribute('playsinline', '');
  //   video.setAttribute('webkit-playsinline', '');
  //
  //   var srcElement: HTMLSourceElement = document.createElement('source');
  //
  //   srcElement.setAttribute('src', src);
  //   srcElement.setAttribute('type', 'video/mp4');
  //
  //   var onVideoLoaded = () => {
  //     video.removeEventListener('loadeddata', onVideoLoaded);
  //
  //     if (onComplete != null) onComplete(src);
  //   };
  //
  //   video.addEventListener('loadeddata', onVideoLoaded);
  //
  //   video.appendChild(srcElement);
  //   video.load();
  // }

}
