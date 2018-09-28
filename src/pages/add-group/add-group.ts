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
import {GroupsPage} from "../groups/groups";
import {DomSanitizer} from "@angular/platform-browser";

declare var cordova: any;


/**
 * Generated class for the AddGroupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-group',
  templateUrl: 'add-group.html',
})
export class AddGroupPage {


  currentUser;
  subject;
  description;
  private lastImage: any;
  private loading: Loading;
  public serverURL: string = environment.API_URL;
  private capturedImage: any;

  constructor(private domSanitizer: DomSanitizer,public navCtrl: NavController, public navParams: NavParams, private svc: RestService, private toastsAlertService: ToastAlertsService, public events: Events, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public platform: Platform, public loadingCtrl: LoadingController) {
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
      allowEdit: true,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {

      this.file.resolveLocalFilesystemUrl(imagePath).then((entry: any)=>{
        entry.file(function (file) {
          var reader = new FileReader();
          reader.onloadend = function (encodedFile: any) {
            var src = encodedFile.target.result;
            src = src.split("base64,");
            var contentAsBase64EncodedString = src[1];
            window.localStorage.setItem('img','data:image/jpeg;base64,' + contentAsBase64EncodedString);
            console.log("contentAsBase64EncodedString");
          };
          reader.readAsDataURL(file);
        });
      });



      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            console.log("lasrimage")
            console.log(imagePath)
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
      this.capturedImage = imagePath;
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

    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  private presentToast(text) {
    let toast = this.toastsAlertService.createToast(text
    );
    toast.present();
  }
  previewImage(){
    return window.localStorage.getItem('img');
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
    if (!this.lastImage) {
      this.presentToast('Please upload group image.');
    } else if (!this.subject) {
      this.presentToast('Please add group name.');
    } else if (!this.description) {
      this.presentToast('Please add group description.');
    } else {
      var url = this.serverURL + "createGroup.php";

      // File for Upload
      var targetPath = this.pathForImage(this.lastImage);

      // File name only
      var filename = this.lastImage;
      let params = {email: this.currentUser.email, password: this.currentUser.password,name:this.subject,info:this.description};

      var options = {
        fileKey: "file",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        httpMethod: 'POST',
        params: {...params, 'fileName': filename}
      };

      const fileTransfer: TransferObject = this.transfer.create();

      this.loading = this.loadingCtrl.create({
        content: 'Creating...',
      });
      this.loading.present();

      // Use the FileTransfer to upload the image
      fileTransfer.upload(targetPath, url, options).then((data: any) => {
        this.loading.dismissAll()

        this.presentToast('Group Created Successfully.');
        this.navCtrl.popTo("GroupsPage");
      }, err => {
        this.loading.dismissAll()
        this.presentToast('Error while creating group.');
      });
    }
  }

  updateUserProfile() {
    this.svc.updateProfile(this.currentUser.email, this.currentUser.name, this.currentUser.status_text, this.currentUser.password)
      .subscribe((res: any) => {
          if (!res.success) {
            let toast = this.toastsAlertService.createToast(res.error_message);
            toast.present();
          } else {
            this.events.publish('user:updated', this.currentUser, Date.now());
            let toast = this.toastsAlertService.createToast("Profile Updated");
            toast.present();

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
    this.navCtrl.push("ChangePasswordPage");

  }
}
