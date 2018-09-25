import {Injectable} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { RestService } from '../services/rest.service';
import 'rxjs/add/operator/map';
import {UserService} from "./user.service";



@Injectable()
export class ResumeService {
  public currentprofile:any;

  constructor(
    private rs: RestService,
    private us: UserService

  ) { 
    this.currentprofile=JSON.parse(localStorage.getItem('profile'));
  }

  // Resumes Requests Section Start

  public saveResume(body: Object): Observable<any> {
    return this.rs.requestPOST(`${this.rs.serverURL}/resume`, body);
  }

  public updateResume(body: Object, id): Observable<any> {
    return this.rs.requestPUT(`${this.rs.serverURL}/resume/${id}`,body);
  }

  public getResume(): Observable<any> {
    return this.rs.requestGET(`${this.rs.serverURL}/resumes/${this.currentprofile.id}`);
  }
  public deleteResume(body: Object, id){
    console.log(id);
  }
  public getreferrals(): Observable<any> {
    return this.rs.requestGET(`${this.rs.serverURL}/referrals/${this.currentprofile.id}`);
  }
  public saveReferral(body: Object): Observable<any> {
    return this.rs.requestPOST(`${this.rs.serverURL}/referral`, body);
  }
  // Resumes Requests Section End

}
