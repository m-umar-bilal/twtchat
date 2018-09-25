import {Injectable} from '@angular/core';
import { ActionSheetController, ModalController, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
// import {TestPage} from "../pages/test/test";
import {Http} from '@angular/http';

declare var cordova:any;

@Injectable()
export class CommonService {

  images = [];

  constructor(
    public http: Http,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private imagePicker: ImagePicker,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController
  ) {
    let localData = this.http.get('assets/document-type-processing-images.json').map(res => res.json().imagesCollection);
    localData.subscribe(data => {

      data.forEach(element => {
        this.images.push(element.image);
      });
      console.log(this.images);
    });
  }

  documentActionSheet(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select',
      buttons: [
        {
          text: 'Camera',
          handler: () => {
            console.log('Camera clicked');
            this.images = [];
            this.media(1);

          }
        },
        {
          text: 'Photo Gallery',
          handler: () => {
            console.log('Photo Gallery clicked');
            //this.media(0);

            this.imagePicker.getPictures({}).then((results) => {
              //this.images = [];
              alert("results length:"+results.length);
              alert(JSON.stringify(results));
              this.images = results;
              let documentModal = this.modalCtrl.create("DocProcessingPage", {images: this.images});
                  documentModal.present();
              // this.imageScanningProcess(results)
              //   .then(res => {
              //     alert("Go to Doc Processing Page 1");
              //     let documentModal = this.modalCtrl.create(DocProcessingPage, {images: this.images});
              //     documentModal.present();
              //   })
            }, (err) => {
              alert(err);
            });
          }
        },
        {
          text: 'Browser Testing',
          handler: () => {
            let documentModal = this.modalCtrl.create("DocProcessingPage", {images: this.images});
            documentModal.present();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();

  }

  media(source){
    //Set the source of the picture. Defined in Camera.PictureSourceType.
    //Default is CAMERA. PHOTOLIBRARY : 0, CAMERA : 1, SAVEDPHOTOALBUM : 2

    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: source,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      //let base64Image = 'data:image/jpeg;base64,' + imageData;
      alert("image captured");

      /* Remove this section start*/
      this.images.push(imageData);
      let ionicAlert = this.alertCtrl.create({
        title: 'Confirmation',
        message: 'Do you want to add another image?',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              alert('Camera opening again');
              this.media(1);
            }
          },
          {
            text: 'No',
            handler: () => {
              alert('Opening DocProcessingPage Modal');
              let documentModal = this.modalCtrl.create("DocProcessingPage", {images: this.images});
              documentModal.present();
            }
          }
        ]
      });
      ionicAlert.present();
      /* Remove this section end*/

      /* Scan Doc Plugin start*/

      // this.scanDoc(imageData)
      //   .then(res => {
      //     this.images.push(res);
      //     let ionicAlert = this.alertCtrl.create({
      //       title: 'Confirmation',
      //       message: 'Do you want to add another image?',
      //       buttons: [
      //         {
      //           text: 'Yes',
      //           handler: () => {
      //             alert('Camera opening again');
      //             this.media(1);
      //           }
      //         },
      //         {
      //           text: 'No',
      //           handler: () => {
      //             alert('Opening DocTypeProcessingPage Modal');
      //             let documentModal = this.modalCtrl.create(DocProcessingPage, {images: this.images});
      //             documentModal.present();
      //           }
      //         }
      //       ]
      //     });
      //     ionicAlert.present();

      //   })
      //   .catch(err => {
      //     alert(err);
      //   });

      /* Scan plugin stop */

    }, (err) => {
      alert("image capture error");
      console.log(err);
    });

  }

  scanDoc(imageData){
    return new Promise((resolve, reject) => {
      cordova.plugins.GeniusScan.scan(imageData, (res)=>{
        //alert("scan res");
        resolve(res);
      }, (err)=>{
        alert(err);
        alert(JSON.stringify(err));
        alert("scan err");
        reject(err);
      });
    });
  }

  imageScanningProcess(results){
    var count = 0;
    this.images = [];
    return new Promise((resolve, reject) => {
      // results.forEach(image => {
      //   this.scanDoc(image)
      //     .then(res => {
      //       this.images.push(res);
      //       count++;
      //       if(count === results.length){
      //         alert("resolve true:"+count);
      //         resolve(true);
      //       }
      //       else{
      //         alert("resolve false:"+count);
      //       }
      //     });
      // });


      // this.scanDoc(results[0])
      //   .then(res => {
      //     this.images.push(res);
      //     alert("one pushed");

      //     setTimeout(()=> {
      //       this.scanDoc(results[1])
      //         .then(res => {
      //           alert("second pushed");
      //           this.images.push(res);

      //           this.scanDoc(results[2])
      //             .then(res => {
      //               alert("third pushed");
      //               this.images.push(res);
      //               resolve(true);
      //             })

      //         });
      //     }, 30000);
      //   });

    });

  }

}
