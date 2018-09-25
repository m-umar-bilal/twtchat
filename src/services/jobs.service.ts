// import {Injectable} from '@angular/core';
// import {Http, Response} from '@angular/http';
// // import {User} from './user';
// import {Observable} from 'rxjs/Rx';
// // import {RestService} from '../services/rest.service';
// // import {MatSnackBar} from '@angular/material';
// import 'rxjs/add/operator/map';
// import {BehaviorSubject} from 'rxjs/BehaviorSubject';
// // import {HttpService} from "./http-service";
// import {RestService} from "./rest.service";
// import swal from 'sweetalert2';
// import {HttpService} from "./http-service";
// // import {HttpService} from '../services/http-service';
//
// declare var $: any;
// // Service to make a call for all diferent API endpoints
// // related with any activity on a user
// @Injectable()
// export class UserService {
//
//   public user: User = new User();
//   public userProfile: any;
//   public userProfiles: any;
//   public proRecentQueue: any[];
//   public proAddQueue: any[];
//   public agencyRecentQueue: any[];
//   public hospitalRecentQueue: any[];
//
//   private loggedIn = new BehaviorSubject<boolean>(false);
//   loggedInUser = this.loggedIn.asObservable();
//
//   constructor(private http: HttpService, private rs: RestService) {
//     this.userProfile = this.getUserProfile();
//     try {
//       if (!this.proRecentQueue) {
//
//         this.proRecentQueue = this.userProfile.proRecentQueue;
//         if (!this.proRecentQueue) {
//           this.proRecentQueue = [];
//         }
//       }
//     } catch (e) {
//       this.proRecentQueue = [];
//     }
//
//     try {
//       if (!this.hospitalRecentQueue) {
//
//         this.hospitalRecentQueue = this.userProfile.hospitalRecentQueue;
//         if (!this.hospitalRecentQueue) {
//           this.hospitalRecentQueue = [];
//         }
//       }
//     } catch (e) {
//       this.hospitalRecentQueue = [];
//     }
//
//     try {
//       if (!this.agencyRecentQueue) {
//
//         this.agencyRecentQueue = this.userProfile.agencyRecentQueue;
//         if (!this.agencyRecentQueue) {
//           this.agencyRecentQueue = [];
//         }
//       }
//     } catch (e) {
//       this.agencyRecentQueue = [];
//     }
//
//
//   }
//
//   public popProRecentQueue() {
//     if (this.proRecentQueue.length > 5) {
//       this.proRecentQueue.shift();
//     }
//     return this.proRecentQueue;
//   }
//
//   popHospitalRecentQueue() {
//     if (this.hospitalRecentQueue.length > 5) {
//       this.hospitalRecentQueue.shift();
//     }
//
//     return this.hospitalRecentQueue;
//
//   }
//
//   public pushPR(obj) {
//     if (!this.proRecentQueue) {
//       this.proRecentQueue = [];
//     }
//
//     let index = this.proRecentQueue.findIndex(d => d.id === obj.id);
//     console.clear();
//     console.log(index);
//
//     if (index === 0 || index && index !== -1) {
//       this.proRecentQueue.splice(index, 1);
//     }
//     obj['recentTime'] = Date.now();
//     this.proRecentQueue.push(obj);
//     this.userProfile['proRecentQueue'] = this.proRecentQueue;
//     localStorage.setItem('profile', JSON.stringify(this.userProfile));
//     return this.proRecentQueue;
//   }
//
//   public pushAR(obj) {
//     if (!this.agencyRecentQueue) {
//       this.agencyRecentQueue = [];
//     }
//
//     let index = this.agencyRecentQueue.findIndex(d => d.id === obj.id);
//     console.clear();
//     console.log(index);
//
//     if (index === 0 || index && index !== -1) {
//       this.agencyRecentQueue.splice(index, 1);
//     }
//     obj['recentTime'] = Date.now();
//     this.agencyRecentQueue.push(obj);
//     this.userProfile['agencyRecentQueue'] = this.agencyRecentQueue;
//     localStorage.setItem('profile', JSON.stringify(this.userProfile));
//     return this.agencyRecentQueue;
//   }
//
//
//   public pushHR(obj) {
//     if (!this.hospitalRecentQueue) {
//       this.hospitalRecentQueue = [];
//     }
//
//     let index = this.hospitalRecentQueue.findIndex(d => d.id === obj.id);
//     console.clear();
//     console.log(index);
//
//     if (index === 0 || index && index !== -1) {
//       this.hospitalRecentQueue.splice(index, 1);
//     }
//     obj['recentTime'] = Date.now();
//     this.hospitalRecentQueue.push(obj);
//     this.userProfile['hospitalRecentQueue'] = this.hospitalRecentQueue;
//     localStorage.setItem('profile', JSON.stringify(this.userProfile));
//     return this.hospitalRecentQueue;
//   }
//
//   popAgencyRecentQueue() {
//
//     if (this.agencyRecentQueue.length > 5) {
//       this.agencyRecentQueue.shift();
//     }
//     return this.agencyRecentQueue;
//
//   }
//
//   public signUp(body: Object): Observable<any> {
//     return this.rs.requestPOST(`${this.rs.serverURL}/user`, body);
//   }
//
//   public verifyAccount(body: Object): Observable<any> {
//     return this.rs.requestPOST(`${this.rs.serverURL}/user/verify`, body);
//   }
//
//   public resetPassword(body: Object): Observable<any> {
//     return this.rs.requestPOST(`${this.rs.serverURL}/set_pass`, body);
//   }
//
//   public login(body: Object): Observable<any> {
//     return this.http.post(`${this.rs.serverURL}/session`, body, this.rs.getOptions())
//       .map((res: Response) => {
//         if (res.json()['signupToken'] === 'false') {
//           const user = JSON.stringify(res.json());
//           localStorage.setItem('currentUser', user);
//           localStorage.setItem('active', 'show');
//           this.loggedIn.next(true);
//         } else {
//           swal({
//             title: 'Email not verified',
//             text: 'Please verify your email!',
//             type: 'warning',
//             showCancelButton: false,
//             confirmButtonClass: 'btn btn-success',
//             cancelButtonClass: 'btn btn-danger',
//             confirmButtonText: 'OK!',
//             buttonsStyling: false
//           }).then(function () {
//             // throw new Error('Email Not Verified');
//
//           });
//         }
//
//       })
//       .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
//   }
//
//   public logout() {
//     localStorage.removeItem('currentUser');
//     localStorage.removeItem('profile');
//     this.loggedIn.next(false);
//
//   }
//
//   public getCurrentUser(): Observable<any> {
//     return this.rs.requestGET(`${this.rs.serverURL}/user/${this.userID}`);
//   }
//
//   public getUser(query: Object): Observable<any> {
//     return this.rs.requestGET(`${this.rs.serverURL}/user/${query['id']}`);
//   }
//
//   public getUserDocs(id: Object): Observable<any> {
//     return this.rs.requestGET(`${this.rs.serverURL}/userDocs/${id}`);
//   }
//
//   public requestNewPassword(body: Object): Observable<any> {
//     return this.rs.requestPOST(`${this.rs.serverURL}/forgot_pass`, body);
//   }
//
//   public updateUser(id: Object, body: Object): Observable<any> {
//     return this.rs.requestPUT(`${this.rs.serverURL}/user/${id}`, body);
//   }
//
//   public deleteUser(query: any, body: any): Observable<any> {
//     console.log('Body');
//     console.log(query);
//     return this.rs.requestDelete(`${this.rs.serverURL}/user/${query}`, body, this.rs.getOptions());
//   }
//
//   public updateProfile(id: Object, type: Object, body: Object): Observable<any> {
//     return this.rs.requestPUT(`${this.rs.serverURL}/profile/${id}/${type}`, body);
//   }
//
//   public getProfile(body: Object): Observable<any> {
//     return this.http.get(`${this.rs.serverURL}/user/${body['id']}`, this.rs.getOptions())
//       .map((res: Response) => {
//         const user = JSON.stringify(res.json());
//         localStorage.setItem('profile', user);
//       })
//       .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
//   }
//
//   public getProfiles(body: Object): Observable<any> {
//     return this.rs.requestGET(`${this.rs.serverURL}/profiles?email=${body['email']}`);
//   }
//
//   public getSession() {
//     return JSON.parse(localStorage.getItem('currentUser'));
//   }
//
//   public getUserProfile() {
//     if (!this.userProfile) {
//       return JSON.parse(localStorage.getItem('profile'));
//     }
//     else {
//       return this.userProfile;
//     }
//   }
//
//   public updateLocal() {
//     const user = JSON.parse(localStorage.getItem('currentUser'));
//     const body = {
//       id: user['userId']
//     };
//     this.getProfile(body).subscribe();
//     return user;
//   }
//
//   get profileID() {
//     return this.userProfile.profileId;
//   }
//
//   get profileType() {
//     return this.userProfile.profileType;
//   }
//
//   get userID() {
//     const user = this.updateLocal();
//     return user.userId;
//   }
//
// }
