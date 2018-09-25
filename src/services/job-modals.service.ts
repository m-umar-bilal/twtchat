import {Injectable, Injector} from '@angular/core';
import {App, ModalController} from "ionic-angular";
import 'rxjs/add/operator/map';

@Injectable()
export class JobModalsService {


  constructor(public modalCtrl: ModalController,  protected app: App, protected injector: Injector) {
    
  }
  public recJobs:string []=[];

  openJobSearch(jobMatchType: string, jobMatchCode: string) {
    console.log("gotoSearch");
  }

  openJobPrefs() {
    let jobPrefsModal = this.modalCtrl.create("JobPreferencesPage");
    jobPrefsModal.onDidDismiss(data => {
      console.log(data);
    });
    jobPrefsModal.present();
  }

  openSavedJobs() {
    let savedjobsModal = this.modalCtrl.create("JobsSavedPage");
    savedjobsModal.onDidDismiss(data => {
    });
    savedjobsModal.present();
  }
  
  openAppliedJobs(){
    let savedjobsModal = this.modalCtrl.create("JobsAppliedPage");
    savedjobsModal.onDidDismiss(data => {
    });
    savedjobsModal.present();
  }


  jobsModalopenJobDetail(job,searchTerm){
    var recentSearch : any[]=JSON.parse(localStorage.getItem('RecentJobs'));
    if(recentSearch){
      for (let recJob of recentSearch){
        this.recJobs.push(recJob);
      }
    }
    if(searchTerm){
      this.recJobs.push(job.speciality);
      const recentJobs :any = JSON.stringify(this.recJobs);
      localStorage.removeItem('RecentJobs');
      localStorage.setItem('RecentJobs', recentJobs);
    }
  }
}
