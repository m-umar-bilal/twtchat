import {Injectable, Injector} from '@angular/core';
import 'rxjs/add/operator/map';
import {App, MenuController, ModalController, NavController} from "ionic-angular";
import {PopoverController} from "ionic-angular/components/popover/popover-controller";

// import {JobsPage} from "../pages/jobs/jobs";


@Injectable()
export class CommonModalsService {

  nav;

  constructor(protected app: App, protected injector: Injector) {

  }


  get navCtrl(): NavController {
    return this.app.getRootNavs()[0];
  }

  get popoverCtrl(): PopoverController {
    return this.injector.get(PopoverController);
  }
  get modalCtrl(): ModalController {
    return this.injector.get(ModalController);
  }

  get menuCtrl(): MenuController {
    return this.injector.get(MenuController);
  }


  goToSearch() {
    this.navCtrl.push("SearchPage", {})
      .then(() => {
        console.log('Welcome to search');
      });
    if (this.menuCtrl.isOpen()) {
      this.menuCtrl.close().then(() => {

      });
    }
  }


  // presentPopover(event) {
  //   event.stopPropagation();
  //
  //   let popover = this.popoverCtrl.create(PostPopoverComponent, {}, {
  //     cssClass: 'my-popover'
  //   });
  //   popover.present({
  //     ev: event
  //   });
  // }

  goToPost(postId) {
    this.navCtrl.push("PostPage", {
      postId: postId
    })
      .then(() => {
        console.log('Welcome to post:', postId);
      });
  }


  goToSettings() {
    this.navCtrl.push("SettingsPage")
      .then(() => {
        console.log('Welcome to Settings');
      })
    if (this.menuCtrl.isOpen()) {
      this.menuCtrl.close().then(() => {

      });
    }
  }

  goToUpdateProfile() {
    this.navCtrl.push("ProfilePage", {})
      .then(() => {
        console.log('Welcome to profile');
      })

    if (this.menuCtrl.isOpen()) {
      this.menuCtrl.close().then(() => {

      });
    }


  }

  goToProfile() {
    this.navCtrl.push("ProfilePage", {})
      .then(() => {
        console.log('Welcome to profile');
      })
  }

  // goToComplianceReports() {
  //   this.navCtrl.push(ComplianceReportsPage, {})
  //     .then(() => {
  //       console.log('Welcome to profile');
  //     })

  //   if (this.menuCtrl.isOpen()) {
  //     this.menuCtrl.close().then(() => {

  //     });
  //   }
  // }

  // newPost() {
  //   let modal = this.modalCtrl.create(NewPostPage);
  //   modal.present();
  // }


  // goToReport(id) {
  //   console.log("goToReport function");
  //   this.navCtrl.push(ComplianceReportsPage, {})
  //     .then(() => {
  //       // console.log('Welcome to Report');
  //     })
  //   if (this.menuCtrl.isOpen()) {
  //     this.menuCtrl.close().then(() => {

  //     });
  //   }
  // }




  setAppRoot(rootPage) {
    // this.app.getActiveNavs()[0].setRoot(rootPage);
    var nav = this.app.getRootNavs()[0];
    nav.popToRoot()
      .then(() => {
        nav.setRoot(rootPage);
      });


    // this.nav = this.app.getRootNavById('n4'); //WORKS! no console warning
    // this.nav.setRoot(rootPage);
  }
}
