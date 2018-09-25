import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {RestService} from "../../src/services/rest.service";

import {HttpService} from "./http-service";
import {SecureStorage, SecureStorageObject} from '@ionic-native/secure-storage';
import {ToastController} from "ionic-angular";
// import {HttpService} from '../services/http-service';

declare var $: any;
// Service to make a call for all diferent API endpoints
// related with any activity on a user
@Injectable()
export class UserService {

  public user: User = new User();
  public count = 0;
  public userProfile: any;
  public userProfiles: any;
  public proRecentQueue: any[];
  public proAddQueue: any[];
  public agencyRecentQueue: any[];
  public hospitalRecentQueue: any[];

  private profiles: any;

  private loggedIn = new BehaviorSubject<boolean>(false);
  loggedInUser = this.loggedIn.asObservable();

  constructor(private http: Http, private rs: RestService, private secureStorage: SecureStorage, public toastCtrl: ToastController) {
    this.userProfile = this.getUserProfile();
    try {
      if (!this.proRecentQueue) {

        this.proRecentQueue = this.userProfile.proRecentQueue;
        if (!this.proRecentQueue) {
          this.proRecentQueue = [];
        }
      }
    } catch (e) {
      this.proRecentQueue = [];
    }

    try {
      if (!this.hospitalRecentQueue) {

        this.hospitalRecentQueue = this.userProfile.hospitalRecentQueue;
        if (!this.hospitalRecentQueue) {
          this.hospitalRecentQueue = [];
        }
      }
    } catch (e) {
      this.hospitalRecentQueue = [];
    }

    try {
      if (!this.agencyRecentQueue) {

        this.agencyRecentQueue = this.userProfile.agencyRecentQueue;
        if (!this.agencyRecentQueue) {
          this.agencyRecentQueue = [];
        }
      }
    } catch (e) {
      this.agencyRecentQueue = [];
    }


  }

  public popProRecentQueue() {
    if (this.proRecentQueue.length > 5) {
      this.proRecentQueue.shift();
    }
    return this.proRecentQueue;
  }

  popHospitalRecentQueue() {
    if (this.hospitalRecentQueue.length > 5) {
      this.hospitalRecentQueue.shift();
    }

    return this.hospitalRecentQueue;

  }

  public pushPR(obj) {
    if (!this.proRecentQueue) {
      this.proRecentQueue = [];
    }

    let index = this.proRecentQueue.findIndex(d => d.id === obj.id);

    if (index === 0 || index && index !== -1) {
      this.proRecentQueue.splice(index, 1);
    }
    obj['recentTime'] = Date.now();
    this.proRecentQueue.push(obj);
    this.userProfile['proRecentQueue'] = this.proRecentQueue;
    localStorage.setItem('profile', JSON.stringify(this.userProfile));
    return this.proRecentQueue;
  }

  public pushAR(obj) {
    if (!this.agencyRecentQueue) {
      this.agencyRecentQueue = [];
    }

    let index = this.agencyRecentQueue.findIndex(d => d.id === obj.id);
    if (index === 0 || index && index !== -1) {
      this.agencyRecentQueue.splice(index, 1);
    }
    obj['recentTime'] = Date.now();
    this.agencyRecentQueue.push(obj);
    this.userProfile['agencyRecentQueue'] = this.agencyRecentQueue;
    localStorage.setItem('profile', JSON.stringify(this.userProfile));
    return this.agencyRecentQueue;
  }


  public pushHR(obj) {
    if (!this.hospitalRecentQueue) {
      this.hospitalRecentQueue = [];
    }

    let index = this.hospitalRecentQueue.findIndex(d => d.id === obj.id);
    if (index === 0 || index && index !== -1) {
      this.hospitalRecentQueue.splice(index, 1);
    }
    obj['recentTime'] = Date.now();
    this.hospitalRecentQueue.push(obj);
    this.userProfile['hospitalRecentQueue'] = this.hospitalRecentQueue;
    localStorage.setItem('profile', JSON.stringify(this.userProfile));
    return this.hospitalRecentQueue;
  }

  popAgencyRecentQueue() {

    if (this.agencyRecentQueue.length > 5) {
      this.agencyRecentQueue.shift();
    }
    return this.agencyRecentQueue;

  }

  public signUp(body: Object): Observable<any> {
    //return this.rs.requestPOST(`${this.rs.serverURL}/user`, body);
    return this.rs.requestPOST(`${this.rs.serverURL}/user/signup_mobile/employee`, body);
  }

  public requestVerification(id, type): Observable<any> {
    return this.rs.requestGET(`${this.rs.serverURL}/request/verification/${id}/${type}`);
  }

  public getUserByEmail(email: any): Observable<any> {
    return this.rs.requestGET(`${this.rs.serverURL}/profiles?email=${email}`);
  }

  public verifyAccount(body: Object): Observable<any> {
    return this.rs.requestPOST(`${this.rs.serverURL}/user/verify`, body);
  }

  public resetPassword(body: Object): Observable<any> {
    return this.rs.requestPOST(`${this.rs.serverURL}/set_pass`, body);
  }

  public login(email, password): Observable<any> {
    return this.rs.login(email, password)
      .map((res) => {

        console.log(res)
        if(res["success   "]===true){

          const user = JSON.stringify(res);
          localStorage.setItem('currentUser', user);
          localStorage.setItem('active', 'show');
          this.loggedIn.next(true);
        }
        else {
          return Observable.throw(res.error_message || 'Server error')

        }

      })
      .catch((error: any) => {
        return Observable.throw(error|| 'Server error')
      });
  }

  public logout() {
    let user = this.getUserProfile();
    if(user){
      this.updateProfile(user.id, user._type, {'device_token': null})
        .subscribe(res => {
          // alert("device token uploaded to profile");

        }, err => {
          // alert("error while saving device token");
          console.log(err);
        }, ()=>{
          // alert("uploading request completed");
        });
    }

    localStorage.removeItem('currentUser');
    localStorage.removeItem('profile');
    this.userProfile = {};
    this.loggedIn.next(false);
  }

  public getCurrentUser(): Observable<any> {
    return this.rs.requestGET(`${this.rs.serverURL}/user/${this.userID}`);
  }

  public getUser(query: Object): Observable<any> {
    return this.rs.requestGET(`${this.rs.serverURL}/user/${query['id']}`);
  }

  public getUserDocs(id: Object): Observable<any> {
    return this.rs.requestGET(`${this.rs.serverURL}/userDocs/${id}`);
  }

  public requestNewPassword(body: Object): Observable<any> {
    return this.rs.requestPOST(`${this.rs.serverURL}/forgot_pass/mobile`, body);
  }

  public updateUser(id: Object, body: Object): Observable<any> {
    return this.rs.requestPUT(`${this.rs.serverURL}/user/${id}`, body);
  }

  public deleteUser(query: any, body: any): Observable<any> {
    return this.rs.requestDelete(`${this.rs.serverURL}/user/${query}`, body);
  }

  public updateProfile(id: Object, type: Object, body: Object): Observable<any> {
    return this.rs.requestPUT(`${this.rs.serverURL}/profile/${id}/${type}`, body);
  }


  public shareProfile(body: Object): Observable<any> {
    return this.rs.requestPOST(`${this.rs.serverURL}/share`, body);
  }


  public getProfile(body: Object): Observable<any> {
    console.log(body['id']);
    return this.http.get(`${this.rs.serverURL}/user/${body['id']}`)
      .map((res: Response) => {
        const user = JSON.stringify(res.json());
        localStorage.setItem('profile', user);
        return res.json();
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  public getProfiles(body: Object): Observable<any> {
    return this.rs.requestGET(`${this.rs.serverURL}/profiles?email=${body['email']}`);
  }

  public getSession() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  public getUserProfile() {
    if (!this.userProfile) {
      return JSON.parse(localStorage.getItem('profile'));
    }
    else {
      return this.userProfile;
    }
  }

  public updateLocal() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const body = {
      id: user['userId']
    };
    this.getProfile(body).subscribe();
    return user;
  }

  get profileID() {
    return this.userProfile.profileId;
  }

  get profileType() {
    return this.userProfile.profileType;
  }

  get userID() {
    const user = this.updateLocal();
    return user.userId;
  }

  public validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }


  public getProfilesEmployeeLogin(user) {
    return new Promise((resolve, reject) => {
      const body = {
        email: user.email
      };

      const result = this.validateEmail(user.email);
      if (result) {
        this.getProfiles(body).subscribe(
          (data) => {
            this.profiles = (data.length > 0) ? data : null;
            this.userProfiles = this.profiles;
            // if only one profile load only that
            if (this.profiles) {
              let selectedProfile = this.profiles.filter(profile => profile._type === 'employee')[0];
              if (selectedProfile) {
                // load the only user profile
                let prof = {...selectedProfile, ...{name: user.name}};
                // prof['name'] = user.name;

                if ('verified' in prof && prof['verified'] === 'true') {
                  this.userProfile = prof;

                  localStorage.setItem('profile', JSON.stringify(prof));
                  localStorage.setItem('profile', JSON.stringify(prof));
                  // this.router.navigate(['/dashboard']);
                  resolve(true);
                }
                else {
                  this.removeCredentials();
                  // let toast = this.toastCtrl.create({
                  //   message: 'Please verify your email!',
                  //   duration: 3000,
                  //   position: 'bottom'
                  // });

                  // toast.onDidDismiss(() => {
                  //   console.log('Dismissed toast');
                  //   //this.userService.logout();
                  // });

                  // toast.present();
                  reject('Please verify your email!');
                }

                // this.loadProfile();
              }
              // else if(){}
              else {
                this.removeCredentials();
                localStorage.removeItem('currentUser');
                localStorage.removeItem('profile');
                let toast = this.toastCtrl.create({
                  message: 'No Profile Exists',
                  duration: 3000,
                  position: 'bottom'
                });

                toast.onDidDismiss(() => {
                  console.log('Dismissed toast');
                  //this.userService.logout();
                });

                toast.present();
                resolve(false);
              }
            }
          },
          (error) => {
            console.log(error);
            // this.cs.message(error);
            reject(false);
          });
      }
      else {
        console.log("else error from getProfilesEmployeeLogin");
        reject(false);
      }
    });

  }

  public loginUser(email,password) {

    return new Promise((resolve, reject) => {
      this.login(email,password).subscribe(
        () => {
          this.secureStorage.create('twtchat')
            .then((storage: SecureStorageObject) => {

              var user_credentials = {
                email: email,
                password: password
              }
              storage.set('user_credentials', JSON.stringify(user_credentials))
                .then(
                  data => {
                    //alert("secure storage success");
                    //alert(data)
                  },
                  error => {
                    // reject(error);
                    //alert("secure storage error");
                    //alert(error)
                  }
                );


            })
            .catch(err => {
              //alert(err);
              //alert("secure storage cordova error");
            });
          resolve("success");

        },
        (error) => {
          console.log(error);
          reject(error);
        });
    });

  }

  removeCredentials(){
    this.secureStorage.create('amicompliantStorage')
      .then((storage: SecureStorageObject) => {

        storage.remove('user_credentials')
          .then(
            data => {
              //alert("secure storage success");
              //alert(data)
            },
            error => {
              //alert("secure storage error");
              //alert(error)
            }
          );


      })
      .catch(err => {
        //alert(err);
        //alert("secure storage cordova error");
      });
  }

}

export class User {
  token: string;
  email: string;
  userId: string;
  agent: string;
  signupToken: string;
  name: string;
  ip: string;
}
