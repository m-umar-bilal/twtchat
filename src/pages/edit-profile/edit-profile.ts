import {Component} from '@angular/core';
import {
  ActionSheetController, IonicPage, Loading, LoadingController, NavController, NavParams,
  Platform
} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {File} from "@ionic-native/file";
import {RestService, ToastAlertsService} from "../../services";
import {ForgotPasswordPage} from "../forgot-password/forgot-password";
import {TabsPage} from "../tabs/tabs";
import {ChangePasswordPage} from "../change-password/change-password";
import {Events} from 'ionic-angular';
import {FilePath} from "@ionic-native/file-path";
import {Transfer, TransferObject} from "@ionic-native/transfer";
import {environment} from "../../env";

declare var cordova: any;

/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  currentUser;
  private lastImage: any;
  private loading: Loading;
  public serverURL: string = environment.API_URL;

  constructor(public navCtrl: NavController, public navParams: NavParams, private svc: RestService, private toastsAlertService: ToastAlertsService, public events: Events, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public platform: Platform, public loadingCtrl: LoadingController) {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
  }

  ionViewDidLoad() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));

    console.log('ionViewDidLoad EditProfilePage');
  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      targetWidth: 300,
      targetHeight: 300,
      allowEdit:true,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }


  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

// Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      this.uploadImage();
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  private presentToast(text) {
    let toast = this.toastsAlertService.createToast({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

// Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  // var options			= new FileUploadOptions();
  // options.fileKey		= "file";
  // options.fileName		= imageURI.substr(imageURI.lastIndexOf('/')+1);
  // options.mimeType		= "image/jpeg";
  // options.httpMethod		= 'POST';
  //
  //
  // var params				= new Object();
  // params.email			= email_app;
  // params.password		= password_app;
  //
  // options.params			= params;
  // options.chunkedMode	= false;
  //
  // var ft = new FileTransfer();
  // ft.upload(imageURI, encodeURI(url_serv+"changePhotoProfil.php"), winProfil, fail, options);
  public uploadImage() {
    // Destination URL
    var url = this.serverURL + "changePhotoProfil.php";

    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);

    // File name only
    var filename = this.lastImage;
    let params = {email:this.currentUser.email,password:this.currentUser.password};

    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: {...params,'fileName': filename}
    };

    const fileTransfer: TransferObject = this.transfer.create();

    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });
    this.loading.present();

    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(data => {
      this.loading.dismissAll()
      this.currentUser["photoProfil"]=data["photoProfil"];
      localStorage.setItem("currentUser",JSON.stringify(this.currentUser));
      this.events.publish('user:updated', this.currentUser, Date.now());

      console.log(data);
      this.presentToast('Image succesful uploaded.');
    }, err => {
      this.loading.dismissAll()
      this.presentToast('Error while uploading file.');
    });
  }

  updateUserProfile() {
    this.svc.updateProfile(this.currentUser.email, this.currentUser.name, this.currentUser.status_text, this.currentUser.password)
      .subscribe((res: any) => {
          if (!res.success) {
            this.svc.toastMessage(res.error_message);

          } else {
            this.events.publish('user:updated', this.currentUser, Date.now());
            this.svc.toastMessage("Profile Updated");

            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            localStorage.setItem('active', 'show');
            this.navCtrl.pop();
          }
        },
        err => {
          console.log(err);
          if (err !== false) {
            let toast = this.toastsAlertService.createToast(err);
            toast.present();
          }
        })
  }


  goToChangePassword() {
    this.navCtrl.push(ChangePasswordPage);

  }
}
