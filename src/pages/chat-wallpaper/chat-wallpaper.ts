import {Component} from '@angular/core';
import {
  ActionSheetController, Events, IonicPage, LoadingController, NavController, NavParams,
  Platform
} from 'ionic-angular';
import {environment} from "../../env";
import {Camera} from "@ionic-native/camera";
import {FilePath} from "@ionic-native/file-path";
import {RestService, ToastAlertsService} from "../../services";
import {File} from "@ionic-native/file";
import {Transfer} from "@ionic-native/transfer";

/**
 * Generated class for the ChatWallpaperPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat-wallpaper',
  templateUrl: 'chat-wallpaper.html',
})
export class ChatWallpaperPage {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public serverURL: string = environment.API_URL;

  constructor(public navCtrl: NavController, public navParams: NavParams, private svc: RestService, private toastsAlertService: ToastAlertsService, public events: Events, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public platform: Platform, public loadingCtrl: LoadingController) {
    events.subscribe('user:updated', (user, time) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome', user, 'at', time);
      this.currentUser = user;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatWallpaperPage');
  }

  setWallpaper() {
    this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
  }
  setImageWallpaper(path) {
    this.events.publish('wallpaper:updated',path , Date.now());

    window.localStorage.setItem('wallimg' + this.currentUser.user_id, path);
    console.log("contentAsBase64EncodedString");
    this.presentToast('Wallpaper is set successfully.');
  }

  private presentToast(text) {
    let toast = this.toastsAlertService.createToast(text
    );
    toast.present();
  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      allowEdit: true,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      this.file.resolveLocalFilesystemUrl(imagePath).then((entry: any) => {
        let userId = this.currentUser.user_id;
        let event = this.events;
        entry.file((file) => {
          let reader = new FileReader();
          reader.onloadend = (encodedFile: any) => {
            let src = encodedFile.target.result;
            src = src.split("base64,");
            let contentAsBase64EncodedString = src[1];
            this.events.publish('wallpaper:updated', 'data:image/jpeg;base64,' + contentAsBase64EncodedString, Date.now());

            window.localStorage.setItem('wallimg' + this.currentUser.user_id, 'data:image/jpeg;base64,' + contentAsBase64EncodedString);
            console.log("contentAsBase64EncodedString");
            this.presentToast('Wallpaper is set successfully.');

          };
          reader.readAsDataURL(file);
        });
      });
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }
}
