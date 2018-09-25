import {Injectable} from '@angular/core';
import {ToastController, LoadingController} from 'ionic-angular';



@Injectable()
export class ToastAlertsService {



  constructor(
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) { }


  createToast(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'X'
    });

    // toast.onDidDismiss(() => {
    //   console.log('Dismissed toast');
    //   this.goToLogin();
    // });

    return toast;

  }

  loading(){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    return loading;
  }

  loadingWithContent(msg){
    let loading = this.loadingCtrl.create({
      content: msg
    });

    loading.present();

    return loading;
  }

}
