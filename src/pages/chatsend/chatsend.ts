import {Component, ElementRef, ViewChild} from '@angular/core';
import {
  ActionSheetController, Content, Events, IonicPage, Loading, LoadingController, NavController,
  NavParams, Platform
} from 'ionic-angular';
import {ContactInfoPage} from '../contact-info/contact-info';
import {environment} from "../../env";
import {RestService} from "../../services";
import {animate, state, style, transition, trigger} from "@angular/animations";
// import {cordova} from "../add-group/add-group";
import {Transfer, TransferObject} from "@ionic-native/transfer";
import {Camera} from "@ionic-native/camera";
import {FilePath} from "@ionic-native/file-path";
import {File, FileEntry} from "@ionic-native/file";
import {CaptureVideoOptions, MediaCapture, CaptureError, MediaFile} from "@ionic-native/media-capture";
import {StreamingMedia} from "@ionic-native/streaming-media";
import {FileChooser} from "@ionic-native/file-chooser";
import {DomSanitizer} from "@angular/platform-browser";
import {Media, MediaObject} from '@ionic-native/media';
import {PagerService} from "../../services/pager.service";

declare let cordova: any;
const MEDIA_FILES_KEY = 'mediaFiles';

@IonicPage()
@Component({
  selector: 'page-chatsend',
  templateUrl: 'chatsend.html',
  animations: [
    trigger('shift', [
      state('previous', style({
        opacity: 0,
        transform: 'translateX(-100%)',
        '-webkit-transform': '-webkit-translateX(-100%)'
      })),
      state('current', style({
        opacity: 1,
        transform: 'translateX(0%)',
        '-webkit-transform': '-webkit-translateX(0%)'
      })),
      state('next', style({
        opacity: 0,
        transform: 'translateX(100%)',
        '-webkit-transform': '-webkit-translateX(100%)'
      })),
      transition('* => *', animate('.5s'))
    ])
  ]
})
export class ChatsendPage {

  mediaFiles = [];
  @ViewChild('content') content: Content;
  @ViewChild('chat_input') messageInput: ElementRef;
  editorMsg = '';
  showEmojiPicker = false;
  pageNumber: number = 1;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public serverURL: string = environment.API_URL;
  public groupData: any;
  public messages: any;
  private loading: Loading;
  private capturedImage: any;
  showMessages;
  private lastImage: any;
  pageSize = -10;
  loader: any;
  videoId: any;
  flag_upload = true;
  flag_play = true;
  pagedItems: any[] = [];
  pager: any = {};
  private loading_: Loading;
  recordingInput: any;
  recording: any;
  bgImage: any="../../assets/imgs/bg.jpg";


  filePathA: string;
  fileNameA: string;
  audio: MediaObject;
  audioList: any[] = [];


  curr_playing_file: MediaObject;
  recStart: boolean;
  private curfilename: string;


  constructor(public navParams: NavParams, public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              private events: Events, private svc: RestService, public actionSheetCtrl: ActionSheetController,
              private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath,
              public platform: Platform, private mediaCapture: MediaCapture, private pagerService: PagerService,
              private media: Media) {

    if(localStorage.getItem('wallimg' + this.currentUser.user_id)){
      this.bgImage = localStorage.getItem('wallimg' + this.currentUser.user_id)
    }
    events.subscribe('user:updated', (user, time) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome', user, 'at', time);
      this.currentUser = user;
    });
    events.subscribe('wallpaper:updated', (wallpaper, time) => {

      this.bgImage = wallpaper
    });
    // Get the navParams toUserId parameter
    console.log(navParams)
    this.forGroups();
    this.forPrivateChat();

  }

  setPage(page: number) {
    console.log("called")
    this.pager = this.pagerService.getPager(this.messages.length, page);

    // get current page of items
    if (page === 1) {
      this.pagedItems.push(...this.messages.slice(this.pager.startIndex, this.pager.endIndex + 1).reverse());
      this.scrollToBottom();
    } else {

      this.pagedItems.unshift(...this.messages.slice(this.pager.startIndex, this.pager.endIndex + 1).reverse());
    }
    console.log(this.pager)
    //   if (newPage) {
    //
    //     // console.log(newPage)
    //     newPage.forEach((item) => {
    //     this.pagedItems.push(item);
    //       console.log(this.pagedItems)
    //
    //     });
    // }
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      // title: 'Modify your album',
      buttons: [
        {
          text: 'Send photo',
          icon: "image",
          handler: () => {
            this.recordingInput = false;
            this.presentCameraActionSheet();
          }
        }, {
          text: 'Send video',
          icon: "camera",

          handler: () => {
            this.recordingInput = false;

            this.presentVideoActionSheet();
            console.log('Destructive clicked');
          }
        },
        {
          text: 'Send Audio',
          icon: "headset",

          handler: () => {
            this.startAduioStreaming();
            console.log('Archive clicked');
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

  async forGroups() {
    if (localStorage.getItem('currentUser')) {

      if (this.navParams.get("page") === "groups") {

        this.groupData = this.navParams.get("data");

        try {
          this.loading = this.loadingCtrl.create({
            content: 'Loading...',
          });
          this.loading.present();
          setTimeout(() => {
            try {
              this.messages = this.groupData.messages.map(x => Object.assign({}, x));
              // this.messages = this.messages.reverse();
              this.setPage(this.pageNumber);
              this.loading.dismissAll();
            }
            catch (ex) {
              console.log(ex)
              this.messages = [];
              this.loading.dismissAll();

            }

          }, 0);


        } catch (ex) {
          this.messages = [];
          this.loading.dismissAll();

        }

        this.events.subscribe('chat:updated', (chat, time) => {
          console.log(chat)
          // user and time are the same arguments passed in `events.publish(user, time)`

          let msgs = chat.groups.filter(item => item.id === this.groupData.id)[0].messages;
          if (msgs) {
            msgs.forEach((item) => {
              if (this.messages.filter(i => i.unique_code === item.unique_code).length === 0) {
                this.messages.push(item);
                this.pagedItems.push(item);
                if (this.loading_) {
                  this.loading_.dismissAll();
                }
                this.scrollToBottom();

              }
            });
            console.log("updated");
          }


        });

      }

    }
  }

  async forPrivateChat() {

    if (this.navParams.get("page") === "private") {

      if (this.svc.userData.privates) {

        try {
          this.loading = this.loadingCtrl.create({
            content: 'Loading...',
          });
          this.loading.present();
          this.groupData = this.svc.userData.privates.filter((item) => item.user_id === this.navParams.get("user_id"))[0];

          setTimeout(() => {
            try {
              this.messages = this.groupData.messages.map(x => Object.assign({}, x));
              // this.messages = this.messages.reverse();
              this.setPage(this.pageNumber);
              this.loading.dismissAll();
            }
            catch (ex) {
              console.log(ex)
              this.messages = [];
              this.loading.dismissAll();

            }

          }, 0);


        }
        catch
          (ex) {
          this.messages = [];
          this.loading.dismissAll();

        }

        this.events.subscribe('chat:updated', (chat, time) => {
          console.log(chat)
          // user and time are the same arguments passed in `events.publish(user, time)`

          let msgs = chat.privates.filter(item => item.id === this.groupData.id)[0].messages;
          if (msgs) {
            msgs.forEach((item) => {
              if (this.messages.filter(i => i.unique_code === item.unique_code).length === 0) {
                this.messages.push(item);
                this.pagedItems.push(item);
                if (this.loading_) {
                  this.loading_.dismissAll();
                }
                this.scrollToBottom();

              }
            });
            console.log("updated");
          }


        });
      }
    }
  }


  ionViewWillLeave() {
    // unsubscribe
    this.events.unsubscribe('chat:received');
  }

  ionViewDidEnter() {
    //get message list
    // Subscribe to received  new message events

  }

  onFocus() {
    this.showEmojiPicker = false;
    this.content.resize();
    this.scrollToBottom();
  }

  sendChat(message, obj) {
    let ty;
    if (this.navParams.get("page") === "private") {
      ty = "0";
    } else {
      ty = "1";
    }
    this.svc.sendChat(this.currentUser.email, this.currentUser.password, this.currentUser.user_id, this.groupData.id, ty, message, "text", obj)
      .subscribe((res: any) => {


          if (res.error_message === "") {
            // localStorage.setItem("UserData", JSON.stringify(res));
            // this.svc.userData = res;
            // console.log("yeh aaya");
            // console.log(res);
            this.scrollToBottom();

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


  /**
   * @name getMsg
   * @returns {Promise<ChatMessage[]>}
   */

  /**
   * @name sendMsg
   */
  sendMsg() {
    if (!this.editorMsg.trim()) return;

    // Mock message
    const id = new Date();
    let newMsg;
    if (this.currentUser.photoProfil) {

      let arr = this.currentUser.photoProfil.split('profil');
      newMsg = {


        create_date: id,
        directory: arr[0],
        message: this.editorMsg,
        mime: null,
        name: this.currentUser.name,
        name_file: null,
        photo_profil: "profil" + arr[1],
        type_message: "text",
        unique_code: (id).getTime() + "" + this.currentUser.user_id + "" + this.groupData.id + "" + this.groupData.private,
        user_id: this.currentUser.user_id,
      };
    }
    else {
      newMsg = {


        create_date: id,
        message: this.editorMsg,
        mime: null,
        name: this.currentUser.name,
        name_file: null,
        type_message: "text",
        unique_code: (id).getTime() + "" + this.currentUser.user_id + "" + this.groupData.id + "" + this.groupData.private,
        user_id: this.currentUser.user_id,
      };
    }
    this.sendChat(this.editorMsg, newMsg.unique_code);

    this.messages.push(newMsg);
    this.pagedItems.push(newMsg);

    this.editorMsg = '';
    this.scrollToBottom();

    if (!this.showEmojiPicker) {
      this.focus();
    }

    // this.chatService.sendMsg(newMsg)
    //   .then(() => {
    //     let index = this.getMsgIndexById(id);
    //     if (index !== -1) {
    //       this.msgList[index].status = 'success';
    //     }
    //   })
  }

  /**
   * @name pushNewMsg
   * @param msg
   */


  captureAudio() {
    this.mediaCapture.captureAudio().then(res => {
      console.log(JSON.stringify(res));
      console.log("Helllloowoepawpe");

      // this.storeMediaFiles(res);
      // this.uploadAudio("audio",res);
    }, (err: CaptureError) => {
      console.error(JSON.stringify(err))
    });
  }


  scrollToBottom() {
    let element = document.getElementById("myLabel");
    // setTimeout(() => {
    //   if (this.content && this.content._scroll && this.content.scrollToBottom) {
    //     this.content.scrollToBottom();
    //   }
    // }, 400)
    setTimeout(() => {
      element.scrollIntoView(true)
    }, 200);
  }

  private focus() {
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }
  }

  private setTextareaScroll() {
    const textarea = this.messageInput.nativeElement;
    textarea.scrollTop = textarea.scrollHeight;
  }

  contactinfo() {
    if (this.navParams.get("page") === "private") {
      this.navCtrl.push("ContactInfoPage", {id: this.groupData.user_id});
    } else {
      this.navCtrl.push("GroupInfoPage", this.groupData);

    }

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
    let options = {
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
          let reader = new FileReader();
          reader.onloadend = function (encodedFile: any) {
            let src = encodedFile.target.result;
            src = src.split("base64,");
            let contentAsBase64EncodedString = src[1];
            window.localStorage.setItem('chatimg', 'data:image/jpeg;base64,' + contentAsBase64EncodedString);
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
      // else  if (this.platform.is('android') && sourceType === this.camera.MediaType.VIDEO) {
      //   this.filePath.resolveNativePath(imagePath)
      //     .then(filePath => {
      //       console.log("lasrimage")
      //       console.log(imagePath)
      //       let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
      //       let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
      //       this.copyFileToLocalDir(correctPath, currentName, this.createFileName("video"),"video");
      //     });
      // }
      // else if(sourceType === this.camera.PictureSourceType.CAMERA||sourceType === this.camera.PictureSourceType.PHOTOLIBRARY){
      //   let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      //   let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      //   this.copyFileToLocalDir(correctPath, currentName, this.createFileName("photo"),"photo");
      // }
      // else if(sourceType === this.camera.MediaType.VIDEO){
      //   let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      //   let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      //   this.copyFileToLocalDir(correctPath, currentName, this.createFileName("video"),"video");
      // }
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
        this.flag_play = false;
        this.flag_upload = false;
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
    // let toast = this.toastsAlertService.createToast(text
    // );
    // toast.present();
  }

  previewImage() {
    return window.localStorage.getItem('chatimg');
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

    let url = this.serverURL + "messageFile.php";

    let targetPath = this.pathForImage(this.lastImage);

    const id = new Date();
    let newMsg;
    let filename = this.lastImage;

    if (this.currentUser.photoProfil) {

      let arr = this.currentUser.photoProfil.split('profil');
      newMsg = {


        create_date: id,
        directory: arr[0],
        local: true,
        message: this.previewImage(),
        mime: "multipart/form-data",
        name: this.currentUser.name,
        name_file: filename,
        photo_profil: "profil" + arr[1],
        type_message: type,
        unique_code: (id).getTime() + "" + this.currentUser.user_id + "" + this.groupData.id + "" + this.groupData.private,
        user_id: this.currentUser.user_id,
      };
    }
    else {
      newMsg = {

        local: true,
        create_date: id,
        message: this.previewImage(),
        mime: "multipart/form-data",
        name: this.currentUser.name,
        name_file: filename,
        type_message: type,
        unique_code: (id).getTime() + "" + this.currentUser.user_id + "" + this.groupData.id + "" + this.groupData.private,
        user_id: this.currentUser.user_id,
      };
    }
    let ty;
    if (this.navParams.get("page") === "private") {
      ty = "0";
    } else {
      ty = "1";
    }

    let postData = {
      conversation_id: this.groupData.id,
      type_conversation: ty,
      type_message: type,
      unique_code: newMsg.unique_code
    };
    let params = {
      email: this.currentUser.email, password: this.currentUser.password,
      array_messages: [postData]
    };

    let options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      httpMethod: 'POST',
      params: {...params, 'fileName': filename}
    };

    const fileTransfer: TransferObject = this.transfer.create();

    fileTransfer.upload(targetPath, url, options).then((data: any) => {

      this.presentToast('Group Created Successfully.');

    }, err => {
      this.presentToast('Error while uploading file.');
    });
    this.messages.push(newMsg);
    this.pagedItems.push(newMsg);
    this.scrollToBottom();


  }


  previewVideo() {
    return window.localStorage.getItem('chatvideo');

  }

  public uploadVideo(type) {

    let url = this.serverURL + "messageFile.php";

    let targetPath = this.file.dataDirectory + this.videoId;

    const id = new Date();
    let newMsg;
    let filename = this.videoId;

    if (this.currentUser.photoProfil) {

      let arr = this.currentUser.photoProfil.split('profil');
      newMsg = {


        create_date: id,
        directory: arr[0],
        local: true,
        message: targetPath,
        mime: "video/mp4",
        name: this.currentUser.name,
        name_file: filename,
        photo_profil: "profil" + arr[1],
        type_message: type,
        unique_code: (id).getTime() + "" + this.currentUser.user_id + "" + this.groupData.id + "" + this.groupData.private,
        user_id: this.currentUser.user_id,
      };
    }
    else {
      newMsg = {

        local: true,
        create_date: id,
        message: targetPath,
        mime: "video/mp4",
        name: this.currentUser.name,
        name_file: filename,
        type_message: type,
        unique_code: (id).getTime() + "" + this.currentUser.user_id + "" + this.groupData.id + "" + this.groupData.private,
        user_id: this.currentUser.user_id,
      };
    }
    let ty;
    if (this.navParams.get("page") === "private") {
      ty = "0";
    } else {
      ty = "1";
    }
    let postData = {
      conversation_id: this.groupData.id,
      type_conversation: ty,
      type_message: type,
      unique_code: newMsg.unique_code
    };
    let params = {
      email: this.currentUser.email, password: this.currentUser.password,
      array_messages: [postData]
    };

    let options = {
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
      content: 'Uploading...',
    });
    this.loading_.present();
    fileTransfer.upload(targetPath, url, options).then((data: any) => {
      this.loading_.dismissAll();
      this.getGroups_();
      this.presentToast('Group Created Successfully.');
      console.log('Group Created Successfully.');
      console.log(JSON.stringify(data))

    }, err => {
      this.presentToast('Error while uploading file.');
      console.log('Error while uploading file.');
      console.log(JSON.stringify(err))
    });
    // this.getGroups_();
    // this.messages.push(newMsg);
    // this.scrollToBottom();


  }

  getGroups_() {
    if (localStorage.getItem('currentUser')) {
      if (!this.loading_) {
        this.loading_ = this.loadingCtrl.create({
          content: 'Uploading...',
        });
        this.loading_.present();
      }
      else {
        this.loading_ = this.loadingCtrl.create({
          content: 'Uploading...',
        });
        this.loading_.present();

      }
      this.svc.getGroups(this.currentUser.email, this.currentUser.password)
        .subscribe((res: any) => {
            // this.loading_.dismissAll();

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


  getVideo() {
    let options = {
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
          let toDirectory = this.file.dataDirectory;

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
        let toDirectory = this.file.dataDirectory;

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


  doInfinite(scroll: any) {
    console.log(this.pageNumber);
    console.log(this.pager.totalPages);
    if (this.pageNumber < this.pager.totalPages) {

      this.pageNumber++;
      this.setPage(this.pageNumber);
      scroll.complete();

    } else {
      scroll.complete();

    }

  }

  private startAduioStreaming() {
    this.recordingInput = true;
    // this.pressed();
  }


  pressed() {
    this.recording = true;
    console.log('Longpress');
    //voiceNum INCREASE
    let nItem = localStorage.getItem('recordvoiceNum');
    let numstr = 0;
    if (nItem == null) {
      numstr = 1;
    }
    else {
      let numstr = parseInt(nItem, 10)
      numstr = numstr + 1;
    }
    //Create media file
    this.curfilename = 'audio' + numstr + '.m4a';
    this.curr_playing_file = this.createAudioFile(this.curfilename);
    localStorage.setItem('recordvoiceNum', numstr.toString());
    try {
      console.log('start Recording');
      if (this.recStart == false) {
        this.curr_playing_file.startRecord();
        this.recStart = true;
      }
    } catch (e) {
      console.log('record error');
      console.log(e.message);
    }


  }

  createAudioFile(filename): MediaObject {
    if (this.platform.is('ios')) {  //ios
      console.log(filename.replace(/^file:\/\//, ''));
      return this.media.create(filename.replace(/^file:\/\//, ''));
    } else {  // android
      return this.media.create(filename);
    }
  }


  public uploadAudio(type, localurl) {

    let url = this.serverURL + "messageFile.php";

    let targetPath = localurl;

    const id = new Date();
    let newMsg;
    let filename = localurl;

    if (this.currentUser.photoProfil) {

      let arr = this.currentUser.photoProfil.split('profil');
      newMsg = {


        create_date: id,
        directory: arr[0],
        local: true,
        message: localurl,
        mime: "audio/mp4",
        name: this.currentUser.name,
        name_file: filename,
        photo_profil: "profil" + arr[1],
        type_message: type,
        unique_code: (id).getTime() + "" + this.currentUser.user_id + "" + this.groupData.id + "" + this.groupData.private,
        user_id: this.currentUser.user_id,
      };
    }
    else {
      newMsg = {

        local: true,
        create_date: id,
        message: localurl,
        mime: "audio/mp4",
        name: this.currentUser.name,
        name_file: filename,
        type_message: type,
        unique_code: (id).getTime() + "" + this.currentUser.user_id + "" + this.groupData.id + "" + this.groupData.private,
        user_id: this.currentUser.user_id,
      };
    }
    let ty;
    if (this.navParams.get("page") === "private") {
      ty = "0";
    } else {
      ty = "1";
    }

    let postData = {
      conversation_id: this.groupData.id,
      type_conversation: ty,
      type_message: type,
      unique_code: newMsg.unique_code
    };
    let params = {
      email: this.currentUser.email, password: this.currentUser.password,
      array_messages: [postData]
    };

    let options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "audio/mp4",
      httpMethod: 'POST',
      params: {...params, 'fileName': filename}
    };

    const fileTransfer: TransferObject = this.transfer.create();



    console.log("helloooooooo")
    fileTransfer.upload(targetPath, url, options).then((data: any) => {
      console.log(JSON.stringify(data))

      this.presentToast('Group Created Successfully.');

    }, err => {
      this.presentToast('Error while uploading file.');
    });
    // this.messages.push(newMsg);
    // this.pagedItems.push(newMsg);
    // this.scrollToBottom();


  }


  released() {

    setTimeout(() => {
      try {
        console.log('stop recording');
        //stop recording

        this.recording = false;
        let name = 'record' + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.m4a';
        ;

        let url = this.serverURL + "messageFile.php";
        let type = "audio";

        const id = new Date();
        let newMsg;


        if (this.currentUser.photoProfil) {

          let arr = this.currentUser.photoProfil.split('profil');
          newMsg = {


            create_date: id,
            directory: arr[0],
            local: true,
            message: this.file.externalRootDirectory + this.curfilename,
            mime: "audio/x-m4a",
            name: this.currentUser.name,
            name_file: name,
            photo_profil: "profil" + arr[1],
            type_message: type,
            unique_code: (id).getTime() + "" + this.currentUser.user_id + "" + this.groupData.id + "" + this.groupData.private,
            user_id: this.currentUser.user_id,
          };
        }
        else {
          newMsg = {

            local: true,
            create_date: id,
            message: this.file.externalRootDirectory + this.curfilename,
            mime: "audio/x-m4a",
            name: this.currentUser.name,
            name_file: name,
            type_message: type,
            unique_code: (id).getTime() + "" + this.currentUser.user_id + "" + this.groupData.id + "" + this.groupData.private,
            user_id: this.currentUser.user_id,
          };
        }
        let ty;
        if (this.navParams.get("page") === "private") {
          ty = "0";
        } else {
          ty = "1";
        }

        let postData = {
          conversation_id: this.groupData.id,
          type_conversation: ty,
          type_message: type,
          unique_code: newMsg.unique_code
        };
        let params = {
          email: this.currentUser.email, password: this.currentUser.password,
          array_messages: [postData]
        };

        let options = {
          fileKey: "file",
          fileName: name,
          chunkedMode: false,
          mimeType: "audio/mp4",
          httpMethod: 'POST',
          params: {...params, 'fileName': name}
        };


        this.curr_playing_file.stopRecord();
        this.curr_playing_file.release();
        // this.curr_playing_file.play();
        console.log('released');

        // let option: FileUploadOptions = {
        //   fileKey:'file',
        //   mimeType:'audio/3gp',
        //   httpMethod:'POST',
        //   fileName:'audiochat#'+name
        // }

        const fileTransfer: TransferObject = this.transfer.create();

        console.log('filename' + this.curfilename);
        console.log('filename'+ this.file.externalRootDirectory + this.curfilename);
        let path = this.file.externalRootDirectory + this.curfilename;


        this.loading_ = this.loadingCtrl.create({
          content: 'Uploading...',
        });
        this.loading_.present();

        fileTransfer.upload(path, url, options).then((result) => {
          this.loading_.dismissAll();
          this.recordingInput = false;
          this.getGroups_();


          console.log(JSON.stringify(result));
            // this.sendAudio(name);
            this.recStart = false;

          }
        ).catch(error => {
          console.log('uploaderror');
          console.log(error.message);
          this.recStart = false;
        });
        // this.messages.push(newMsg);
        // this.pagedItems.push(newMsg);
        // this.scrollToBottom();
      }
      catch (error) {
        console.log('stoperror');
        console.log(error.message);
      }
    }, 0);

  }


  startRecord() {
    if (this.platform.is('ios')) {
      this.fileNameA = 'record'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.3gp';
      this.filePathA = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileNameA;
      this.audio = this.media.create(this.filePathA);
    } else if (this.platform.is('android')) {
      this.fileNameA = 'record'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.3gp';
      this.filePathA = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileNameA;
      this.audio = this.media.create(this.filePathA);
    }
    this.audio.startRecord();
    this.recording = true;
  }

  stopRecord() {
    this.audio.stopRecord();
    let data = { filename: this.fileNameA };
    this.audioList.push(data);
    localStorage.setItem("audiolist", JSON.stringify(this.audioList));
    this.recording = false;
    console.log(this.playAudio(this.fileNameA,0));
    this.uploadAudio('audio',this.playAudio('file://'+this.fileNameA,0));
    // this.getAudioList();
  }
  playAudio(file,idx):string {
    if (this.platform.is('ios')) {
      this.filePathA = this.file.documentsDirectory.replace(/file:\/\//g, '') + file;
      this.audio = this.media.create(this.filePathA);
    } else if (this.platform.is('android')) {
      this.filePathA = this.file.externalDataDirectory.replace(/file:\/\//g, '') + file;
      this.audio = this.media.create(this.filePathA);
    }
    console.log("audio");
    console.log(JSON.stringify(this.audio))
    this.audio.play();
    this.audio.setVolume(0.8);
    return this.filePathA;

  }

}
