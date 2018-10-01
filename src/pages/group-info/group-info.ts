import {Component} from '@angular/core';
import {
  ActionSheetController, AlertController, Events, IonicPage, Loading, LoadingController, ModalController, NavController,
  NavParams, Platform
} from 'ionic-angular';
import {environment} from "../../env";
import {RestService, ToastAlertsService} from "../../services";
import {Camera} from "@ionic-native/camera";
import {FilePath} from "@ionic-native/file-path";
import {File} from "@ionic-native/file";
import {Transfer, TransferObject} from "@ionic-native/transfer";
import {AddFriendsGroupPage} from "../add-friends-group/add-friends-group";

declare var cordova: any;

/**
 * Generated class for the GroupInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-group-info',
  templateUrl: 'group-info.html',
})
export class GroupInfoPage {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public serverURL: string = environment.API_URL;
  private group_id: any;
  groupData;
  private loading: Loading;
  public admin: boolean;
  isToggled;
  private lastImage: any;

  private capturedImage: any;

  constructor(public navCtrl: NavController, public platform: Platform, public modalCtrl: ModalController, public navParams: NavParams, private svc: RestService, public loadingCtrl: LoadingController, public events: Events, private alertCtrl: AlertController, public toastsAlertService: ToastAlertsService, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController) {
    events.subscribe('user:updated', (user, time) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome', user, 'at', time);
      this.currentUser = user;
    });
    this.group_id = navParams.get("id");
    try {
      if (this.currentUser.user_id === navParams.get("user_admin")) {
        this.admin = true;
      } else {
        this.admin = false;
      }
    }
    catch (ex) {
      this.admin = false;

    }
    this.getGroup();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupInfoPage');
  }

  getGroup() {

    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();
    this.svc.getOneGroup(this.currentUser.email, this.currentUser.password, this.group_id).subscribe((data: any) => {
      this.loading.dismissAll()

      // this.searchGroups();
      if (data.error_message === "") {
        this.groupData = data.group;
        if (this.groupData.readonly && this.groupData.readonly === '1') {
          this.isToggled = true;
        }
        else {
          this.isToggled = false;
        }
      }
    }, error2 => {
      this.loading.dismissAll()

      // this.searchGroups();

    })
  }

  private presentToast(text) {
    let toast = this.toastsAlertService.createToast(text
    );
    toast.present();
  }

  presentNamePrompt(group) {
    if (this.admin) {
      let alert = this.alertCtrl.create({
        title: 'Update Name',
        inputs: [
          {
            name: 'groupName',
            placeholder: 'Group Name'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Update',
            handler: data => {
              if (data.groupName && data.groupName != "") {
                this.loading = this.loadingCtrl.create({
                  content: 'Loading...',
                });
                this.loading.present();

                this.svc.updateNameGroup(this.currentUser.email, this.currentUser.password, data.groupName, this.group_id).subscribe((data: any) => {
                  this.loading.dismissAll()

                  // this.searchGroups();
                  if (data.error_message === "") {
                    this.svc.userData.groups.filter(item => item.id === this.group_id)[0].name = data.new_name;
                    group.name = data.new_name;
                    this.presentToast("Updated");

                  }
                }, error2 => {
                  this.loading.dismissAll()

                  // this.searchGroups();

                })
                // logged in!
              } else {
                this.presentToast("Enter Valid Value");
                return false;
              }
            }
          }
        ]
      });
      alert.present();
    }
  }

  presentDescriptionPrompt(group) {
    if (this.admin) {
      let alert = this.alertCtrl.create({
        title: 'Update Description',
        inputs: [
          {
            name: 'groupName',
            placeholder: 'Group Description'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Update',
            handler: data => {
              if (data.groupName && data.groupName != "") {
                this.loading = this.loadingCtrl.create({
                  content: 'Loading...',
                });
                this.loading.present();

                this.svc.updateDescriptionGroup(this.currentUser.email, this.currentUser.password, data.groupName, this.group_id).subscribe((data1: any) => {
                  this.loading.dismissAll()

                  // this.searchGroups();
                  if (data1.error_message === "") {
                    this.svc.userData.groups.filter(item => item.id === this.group_id)[0].name = data.description;

                    group.description = data.groupName;
                    this.presentToast("Updated");

                  }
                }, error2 => {
                  this.loading.dismissAll()

                  // this.searchGroups();

                })
                // logged in!
              } else {
                this.presentToast("Enter Valid Value");
                return false;
              }
            }
          }
        ]
      });
      alert.present();
    }
  }


  updateGroupRead() {

  }


  changeNoti() {
    console.log(this.isToggled)
    if (this.isToggled) {
      this.updateUserProfile("1");
    } else {
      this.updateUserProfile("0");

    }
  }

  updateUserProfile(status) {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();


    this.svc.changeReadOnly(this.currentUser.email, this.currentUser.password, status, this.group_id)
      .subscribe((res: any) => {
          if (res.error_message === "") {
            this.presentToast("Updated");
            this.svc.userData.groups.filter(item => item.id === this.group_id)[0].readonly = status;

            this.groupData.readonly = status;
          }
          this.loading.dismissAll()

        },
        err => {
          this.loading.dismissAll()

          // console.log(err);
          // if (err !== false) {
          //   let toast = this.toastsAlertService.createToast(err);
          //   toast.present();
          // }
        })
  }


  blockFromGroup(user) {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();


    this.svc.blockUserGroup(this.currentUser.email, this.currentUser.password, user.id, this.group_id)
      .subscribe((res: any) => {
          this.loading.dismissAll()

          if (res.error_message === "") {
            this.presentToast("Updated");

          }
          this.getGroup();

        },
        err => {
          this.loading.dismissAll()

          // console.log(err);
          // if (err !== false) {
          //   let toast = this.toastsAlertService.createToast(err);
          //   toast.present();
          // }
        })
  }

  deleteFromGroup(user) {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();


    this.svc.deleteUserGroup(this.currentUser.email, this.currentUser.password, user.id, this.group_id)
      .subscribe((res: any) => {
          this.loading.dismissAll()

          if (res.error_message === "") {
            this.presentToast("Updated");
          }
          this.getGroup();
        },
        err => {
          this.loading.dismissAll()

        })
  }


  public presentActionSheet() {
    if (this.admin) {
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

      this.file.resolveLocalFilesystemUrl(imagePath).then((entry: any) => {
        entry.file(function (file) {
          var reader = new FileReader();
          reader.onloadend = function (encodedFile: any) {
            var src = encodedFile.target.result;
            src = src.split("base64,");
            var contentAsBase64EncodedString = src[1];
            window.localStorage.setItem('img', 'data:image/jpeg;base64,' + contentAsBase64EncodedString);
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

      this.uploadImage()
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }


// Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }


  public uploadImage() {
    // Destination URL

    var url = this.serverURL + "updatePhotoGroup.php";

    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);

    // File name only
    var filename = this.lastImage;
    let params = {email: this.currentUser.email, password: this.currentUser.password, group_id: this.group_id};

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

      this.getGroup();

      this.presentToast('Updated');

    }, err => {
      this.loading.dismissAll()
      this.presentToast('Error while uploading');
    });
  }

  addParticipant() {
    let profileModal = this.modalCtrl.create("AddFriendsGroupPage", this.groupData);
    profileModal.onDidDismiss(data => {
      this.getGroup();
    });
    profileModal.present();
  }

  leaveGroup() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();


    this.svc.exitGroup(this.currentUser.email, this.currentUser.password, this.group_id)
      .subscribe((res: any) => {
          this.loading.dismissAll()

          if (res.error_message === "") {
            this.presentToast("Group Exited");
            this.navCtrl.pop();
          }
        },
        err => {
          this.loading.dismissAll()

        })
  }
}
