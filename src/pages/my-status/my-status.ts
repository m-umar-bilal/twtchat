import {Component} from '@angular/core';
import {
  ActionSheetController, Events, IonicPage, Loading, LoadingController, ModalController, NavController, NavParams,
  Platform
} from 'ionic-angular';
import {environment} from "../../env";
import {CaptureError, CaptureVideoOptions, MediaCapture, MediaFile} from "@ionic-native/media-capture";
import {File, FileEntry} from "@ionic-native/file";
import {Transfer, TransferObject} from "@ionic-native/transfer";
import {FilePath} from "@ionic-native/file-path";
import {Camera} from "@ionic-native/camera";
import {RestService, ToastAlertsService} from "../../services";

declare var cordova: any;
import {PhotoViewer} from '@ionic-native/photo-viewer';
import {VideoPlayer} from "@ionic-native/video-player";

/**
 * Generated class for the MyStatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-status',
  templateUrl: 'my-status.html',
})
export class MyStatusPage {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public serverURL: string = environment.API_URL;
  private videoId: string;
  private loading_: Loading;
  private lastImage: any;
  private capturedImage: any;

  constructor(public navParams: NavParams, public navCtrl: NavController,
              public loadingCtrl: LoadingController, public toastsAlertService: ToastAlertsService,
              private events: Events, private svc: RestService, public actionSheetCtrl: ActionSheetController,
              private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath,
              public platform: Platform, private mediaCapture: MediaCapture,
              private photoViewer: PhotoViewer, public modalCtrl: ModalController) {
    events.subscribe('user:updated', (user, time) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome', user, 'at', time);
      this.currentUser = user;
    });
  }


  showImage(url) {
    this.photoViewer.show(url);
  }

  showVideo(url) {
    let profileModal = this.modalCtrl.create("VideoPlayerPage", {url});
    profileModal.present();
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      // title: 'Modify your album',
      buttons: [
        {
          text: 'Upload photo',
          icon: "image",
          handler: () => {
            this.presentCameraActionSheet();
          }
        }, {
          text: 'Upload video',
          icon: "camera",

          handler: () => {
            this.presentVideoActionSheet();
            console.log('Destructive clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: "close",

          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }


  public presentVideoActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: "Select Image Source",
      buttons: [
        {
          text: "Load from Gallery",
          handler: () => {
            this.getVideo();
          }
        },
        {
          text: "Use Camera",
          handler: () => {
            this.captureVideo();
          }
        },
        {
          text: "Cancel",
          role: "cancel"
        }
      ]
    });
    actionSheet.present();
  }

  public uploadVideo(type) {

    let url = this.serverURL + "statusFile.php";

    let targetPath = this.file.dataDirectory + this.videoId;


    let filename = this.videoId;

    let params = {
      email: this.currentUser.email, password: this.currentUser.password,
      type_status: "video"
    };

    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "video/mp4",
      httpMethod: 'POST',
      params: {...params, 'fileName': filename}
    };

    const fileTransfer: TransferObject = this.transfer.create();

    console.log('FAke while uploading file.');
    console.log(targetPath)
    this.loading_ = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading_.present();
    fileTransfer.upload(targetPath, url, options).then((data: any) => {
      this.loading_.dismissAll();
      this.getGroups_();
      this.presentToast('Status Uploaded');
      console.log('Group Created Successfully.');
      console.log(JSON.stringify(data))

    }, err => {
      this.presentToast('Error while uploading file.');
      console.log('Error while uploading file.');
      console.log(JSON.stringify(err))
    });
    // this.messages.push(newMsg);
    // this.scrollToBottom();


  }

  getGroups_() {
    if (localStorage.getItem('currentUser')) {
      if (!this.loading_) {
        this.loading_ = this.loadingCtrl.create({
          content: 'Loading...',
        });
        this.loading_.present();
      }
      else {
        this.loading_ = this.loadingCtrl.create({
          content: 'Loading...',
        });
        this.loading_.present();

      }
      this.svc.getGroups(this.currentUser.email, this.currentUser.password)
        .subscribe((res: any) => {
            this.loading_.dismissAll();

            if (res.error_message === "") {
              localStorage.setItem("UserData", JSON.stringify(res));
              this.svc.userData = res;
              this.events.publish('chat:updated', res, Date.now());

              console.log(res);

            } else {

            }
          },
          err => {
            console.log(err);

            if (err !== false) {
              // let toast = this.toastsAlertService.createToast(err);
              // toast.present();
            }
          })
    }
  }

  getVideo() {
    var options = {
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      mediaType: this.camera.MediaType.VIDEO,
      destinationType: this.camera.DestinationType.FILE_URI
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {


      // if (this.platform.is('android')) {
      this.file.resolveLocalFilesystemUrl('file://' + imagePath,).then((FE: FileEntry) => {

        console.log("lasrimage")
        // console.log(  FE.isFile)
        FE.file(file => {

          let capturedFile = file;
          let fileName = capturedFile.name;
          let dir = capturedFile['localURL'].split('/');
          dir.pop();
          let fromDirectory = dir.join('/');
          var toDirectory = this.file.dataDirectory;

          this.file.copyFile(fromDirectory, fileName, toDirectory, fileName).then((res) => {
            this.videoId = fileName;
            this.uploadVideo('video');
            // this.storeMediaFiles([{name: fileName, size: capturedFile.size}]);
          }, err => {
            console.log('err: ', err);
          });


        })

      }, err => {
        console.log("nae chala");
        console.log(JSON.stringify(err));


      });

    }, err => {
      console.log("YA Allah MADAD");
      console.log(JSON.stringify(err));


    })
      .catch(e => console.log(e));
  }


  captureVideo() {
    let options: CaptureVideoOptions = {
      limit: 1,
      duration: 30
    }
    this.mediaCapture.captureVideo(options).then((res: MediaFile[]) => {

        let capturedFile = res[0];

        let fileName = capturedFile.name;
        let dir = capturedFile['localURL'].split('/');
        dir.pop();
        let fromDirectory = dir.join('/');
        var toDirectory = this.file.dataDirectory;

        this.file.copyFile(fromDirectory, fileName, toDirectory, fileName).then((res) => {
          this.videoId = fileName;
          this.uploadVideo('video');
          // this.storeMediaFiles([{name: fileName, size: capturedFile.size}]);
        }, err => {
          console.log('err: ', err);
        });
      },
      (err: CaptureError) => console.error(err));
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad MyStatusPage');
  }


  public presentCameraActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          icon: "images",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          icon: "image",
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

  public takePicture(sourceType, mediaType = this.camera.MediaType.PICTURE) {
    // Create options for the Camera Dialog
    var options = {
      targetWidth: 300,
      targetHeight: 300,
      allowEdit: true,
      sourceType: sourceType,
      mediaType: mediaType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {

      this.file.resolveLocalFilesystemUrl(imagePath).then((entry: any) => {
        entry.file(function (file) {
          var reader = new FileReader();
          reader.onloadend = function (encodedFile: any) {
            var src = encodedFile.target.result;
            src = src.split("base64,");
            var contentAsBase64EncodedString = src[1];
            window.localStorage.setItem('statusimg', 'data:image/jpeg;base64,' + contentAsBase64EncodedString);
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
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName("photo"), "photo");
          });
      }
      else {
        let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName("photo"), "photo");
      }
      this.capturedImage = imagePath;
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }


  private createFileName(type) {
    let d;
    let n;
    if (type === 'video') {
      d = new Date();
      n = d.getTime();
      return n + ".mp4";
    } else if (type === 'photo') {
      d = new Date();
      n = d.getTime();
      return n + ".jpg";
    }

  }

// Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName, type) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      if (type === "video") {
        this.videoId = newFileName;

        this.uploadVideo("video");
      } else {

        this.lastImage = newFileName;

        this.uploadImage(type);
      }
    }, error => {
      console.log("sadjasj");
      console.log(JSON.stringify(error));
      this.presentToast('Error while storing file.');
    });
  }

  private presentToast(text) {
    let toast = this.toastsAlertService.createToast(text
    );
    toast.present();
  }

  previewImage() {
    return window.localStorage.getItem('statusimg');
  }


// Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadImage(type) {

    var url = this.serverURL + "statusFile.php";

    var targetPath = this.pathForImage(this.lastImage);

    var filename = this.lastImage;

    let params = {
      email: this.currentUser.email, password: this.currentUser.password,
      type_status: "photo"
    };

    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      httpMethod: 'POST',
      params: {...params, 'fileName': filename}
    };

    const fileTransfer: TransferObject = this.transfer.create();

    this.loading_ = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading_.present();
    fileTransfer.upload(targetPath, url, options).then((data: any) => {
      this.loading_.dismissAll();

      this.getGroups_();
      this.presentToast('Status uploaded Successfully.');

    }, err => {
      this.presentToast('Error while uploading file.');
    });


  }


  removeStatus(id) {
    this.loading_ = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading_.present();
    this.svc.deleteSnap(this.currentUser.email, this.currentUser.password, id).subscribe((res: any) => {
      this.loading_.dismissAll();
      if (res.del_status) {
        this.getGroups_();
        this.presentToast('Status Deleted');
      }
    })
  }
}
