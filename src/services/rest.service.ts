import {Injectable} from '@angular/core';

// import {environment} from '../../environments/environment';
// import {Router} from '@angular/router';
import * as CryptoJS from 'crypto-js';
import {HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {HttpClient} from '@angular/common/http';
// import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {catchError, retry} from 'rxjs/operators';
// import {throwError as observableThrowError} from 'rxjs';
import {environment} from "../env";
import {Observable} from "rxjs/Rx";
import {Device} from '@ionic-native/device';
import {Platform} from "ionic-angular";
import {GooglePlus} from "@ionic-native/google-plus";
import {Facebook} from "@ionic-native/facebook";

// Service to set the API headers
@Injectable()
export class RestService {
  get userData() {
    return this._userData;
  }

  set userData(value) {
    this._userData = value;
  }

  public serverURL = environment.API_URL;
  user;
  profile;
  private _userData;

  constructor(private http: HttpClient, private device: Device, private fb: Facebook,
              private platform: Platform,
              private googlePlus: GooglePlus) {
    this.user = this.getSession();
    this.profile = this.getprofile();
  }

  public getSession() {
    if (!this.user) {
      return JSON.parse(localStorage.getItem('currentUser'));
    } else {
      return this.user;
    }
  }

  public getprofile() {
    if (!this.profile) {
      return JSON.parse(localStorage.getItem('profile'));
    } else {
      return this.profile;
    }
  }

  //
  // public toastMessage(message) {
  //
  //   this.toast.create(message).present();
  //
  //   // this.toast.create({
  //   //   message: message,
  //   //   duration: 4000, // 2000 ms
  //   //   position: "bottom",
  //   //   cssClass: "styling"
  //   // }).present();
  // }

  public getOptions() {

    const user = this.getSession();
    if (user) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': user.token
        })
      };
      return httpOptions;

    } else {
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      };
      return options;
    }
  }

  public requestByIdGET(link) {
    return this.http.get(`${link}/${this.getprofile().id}`, this.getOptions())
      .pipe(
        retry(0),
        catchError(this.handleError)
      );
  }


  public requestGET(link) {
    return this.http.get(link, this.getOptions())
      .pipe(
        retry(0),
        catchError(this.handleError)
      );
  }

  public requestGETCustomAuthorization(link, options) {
    return this.http.get(link, options)
      .pipe(
        retry(0),
        catchError(this.handleError)
      );
  }

  login(username, password): Observable<any> {
    // var model = device.model;
    // var deviceID = Device.uuid;
    // var string = device.version;
    // .set('password', encodeURIComponent(CryptoJS.MD5(password)))

    const body = new HttpParams()
      .set('email', username)
      .set('password', CryptoJS.MD5(password))
      .set('deviceType', this.device.model || "android")
      .set('registrationId', "ecK5Bc6ksDI:APA91bHaJAkXP9vzdB9JorTSjiAAPKA8zVuhFDINGz_gJ2akeMQiPezROAy0s0JNvSDO-3HRLoUFEs1mCqUxr4pbrFJQJlLVBQ6vGpR9Cw8900sdrB4s9-FVctYeIN1izlFUOHnv79cZ");
    console.log(body.toString());
    return this.http.post(this.serverURL + 'signin.php',

      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );
  }

  loginWithFacebook() {
    return Observable.create(observer => {
      if (this.platform.is('cordova')) {
        this.fb.login(['email', 'public_profile']).then(res => {
          console.log(JSON.stringify(res));
          // const facebookCredential = auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
          // this.auth.auth.signInWithCredential(facebookCredential).then(user => {
          //   console.log(JSON.stringify(user));
          //   console.log(user, null, 2);
          observer.next(res);
          // }).catch(error => {
          //   observer.error(error);
          // });
        }).catch((error) => {
          observer.error(error);
        });
      } else {
        // this.auth.auth
        //   .signInWithPopup(new auth.FacebookAuthProvider())
        //   .then((res) => {
        //     console.log(res);
        //     observer.next(res);
        //   }).catch(error => {
        //   observer.error(error);
        // });
      }
    });
  }


  loginWithGoogle() {
    let promise = new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {


        this.googlePlus.login({
          'webClientId': '226323717953-h0icfur9976jm7n0aa8qj4h8qo1erute.apps.googleusercontent.com',
          'offline': true
        }).then(res => {
          // alert('Google Login');
          // const googleCredential = firebase.auth.GoogleAuthProvider.credential(res.idToken);
          // firebase.auth().signInWithCredential(googleCredential).then(response => {
          //   console.log("Firebase success: " + JSON.stringify(response));
          resolve(res)
          // }).catch((error) => {
          //   // alert('error 1 ' + error);
          //   reject(error);
          // });
        }).catch((error) => {
          // alert('error 2 ' + error);
          reject(error);
        });
      } else {
        // this.auth.auth
        //   .signInWithPopup(new auth.GoogleAuthProvider())
        //   .then((res) => {
        //     console.log(res);
        //     resolve(res);
        //   }).catch(error => {
        //   reject(error);
        // });
      }
    });
    return promise;
  }


  signup(name, email, password, phone): Observable<any> {

    const body = new HttpParams()
      .set('name', name)
      .set('phone', phone)
      .set('email', email)
      .set('password', CryptoJS.MD5(password))
      .set('deviceType', this.device.model || "android")
      .set('registrationId', "ecK5Bc6ksDI:APA91bHaJAkXP9vzdB9JorTSjiAAPKA8zVuhFDINGz_gJ2akeMQiPezROAy0s0JNvSDO-3HRLoUFEs1mCqUxr4pbrFJQJlLVBQ6vGpR9Cw8900sdrB4s9-FVctYeIN1izlFUOHnv79cZ");
    console.log(body.toString());
    return this.http.post(this.serverURL + 'signup.php',

      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );
  }


  forgotPassword(username): Observable<any> {

    const body = new HttpParams()
      .set('email', username);

    console.log(body.toString());
    return this.http.post(this.serverURL + 'forgetPassword.php',

      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );
  }

  changePassword(username, old, nEw): Observable<any> {

    const body = new HttpParams()
      .set('email', username)
      .set('oldPassword', CryptoJS.MD5(old))
      .set('newPassword', CryptoJS.MD5(nEw));

    console.log(body.toString());
    return this.http.post(this.serverURL + 'changePassword.php',

      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );
  }

  updateProfile(email, name, status, password) {
    const body = new HttpParams()
      .set('email', email)
      .set('name', name)
      .set('status', status)
      .set('password', password);

    console.log(body.toString());
    return this.http.post(this.serverURL + 'changeInfo.php',

      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );
  }

  getGroups(email, password) {
    const body = new HttpParams()
      .set('email', email)
      .set('array_messages', "[]")
      .set('status', status)
      .set('password', password);

    console.log(body.toString());
    return this.http.post(this.serverURL + 'twtchat.php',

      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );
  }

  getOneGroup(email, password,query) {
    const body = new HttpParams()
      .set('email', email)
      .set('group_id', query)
      .set('password', password);

    console.log(body.toString());
    return this.http.post(this.serverURL + 'getOneGroup.php',

      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );
  }
  getOneProfil(email, password,query) {
    const body = new HttpParams()
      .set('email', email)
      .set('user_two', query)
      .set('password', password);

    console.log(body.toString());
    return this.http.post(this.serverURL + 'getOneProfil.php',

      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );
  }
  sendFriendRequest(email, password,query) {
    const body = new HttpParams()
      .set('email', email)
      .set('user_two', query)
      .set('password', password);

    console.log(body.toString());
    return this.http.post(this.serverURL + 'sendFriendRequest.php',

      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );
  }
  acceptPendingGroupRequest(email, password,query,group_id) {
    const body = new HttpParams()
      .set('email', email)
      .set('user_two', query)
      .set('group_id', group_id)
      .set('password', password);

    console.log(body.toString());
    return this.http.post(this.serverURL + 'acceptRequestGroup.php',

      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );
  }
  declinePendingGroupRequest(email, password,query,group_id) {
    const body = new HttpParams()
      .set('email', email)
      .set('user_two', query)
      .set('group_id', group_id)
      .set('password', password);

    console.log(body.toString());
    return this.http.post(this.serverURL + 'declinedRequestGroup.php',

      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );
  }
  handlefriendRequest(email, password,query,status) {
    const body = new HttpParams()
      .set('email', email)
      .set('user_two', query)
      .set('status', status)
      .set('password', password);

    console.log(body.toString());
    return this.http.post(this.serverURL + 'friendRequest.php',

      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );
  }

  sendChat(email, password, user_id_app, conversation_id, type_conversation, message, type_message, obj) {
    const body = new HttpParams()
      .set('email', email)
      .set('array_messages', JSON.stringify([{conversation_id, type_conversation:"1", message, type_message, unique_code:obj}]))
      .set('password', password);

    console.log(body.toString());
    return this.http.post(this.serverURL + 'twtchat.php',

      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );
  }


  searchGroups(email, password, query) {
    const body = new HttpParams()
      .set('email', email)
      .set('searchTxt', query)
      .set('password', password);

    console.log(body.toString());
    return this.http.post(this.serverURL + 'searchGroups.php',

      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );
  }
  searchUsers(email, password, query) {
    const body = new HttpParams()
      .set('email', email)
      .set('searchTxt', query)
      .set('password', password);

    console.log(body.toString());
    return this.http.post(this.serverURL + 'searchUsers.php',

      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );
  }

  searchFriends(email, password, query) {
    const body = new HttpParams()
      .set('email', email)
      .set('searchTxt', query)
      .set('password', password);

    console.log(body.toString());
    return this.http.post(this.serverURL + 'searchGroups.php',

      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );
  }

  sendGroupRequest(email, password, query) {
    const body = new HttpParams()
      .set('email', email)
      .set('group_id', query)
      .set('password', password);

    console.log(body.toString());
    return this.http.post(this.serverURL + 'sendGroupRequest.php',

      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );
  }



  public requestPOST(link, body) {
    return this.http.post(link, body, this.getOptions())
      .pipe(
        retry(0),
        catchError(this.handleError)
      );
  }

  public requestPOSTX(link, body) {
    return this.http.post(link, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      })
    })
      .pipe(
        retry(0),
        catchError(this.handleError)
      );
  }

  public requestPOSTO(link, body, options) {
    return this.http.post(link, body, options)
      .pipe(
        retry(0),
        catchError(this.handleError)
      );
  }

  public requestGETO(link, options) {
    return this.http.get(link, options)
      .pipe(
        retry(0),
        catchError(this.handleError)
      );
  }

  public requestPUT(link, body) {
    return this.http.put(link, body, this.getOptions())
      .pipe(
        retry(0),
        catchError(this.handleError)
      );
  }

  public requestDelete(link, body) {
    return this.http.delete(link, this.getOptions())
      .pipe(
        retry(0),
        catchError(this.handleError)
      );
  }

  public requestDeleteLocation(link) {
    return this.http.delete(link, this.getOptions())
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  private logout() {
    alert('hello');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('profile');
    this.user = {};

  }

  private handleError(error: HttpErrorResponse) {

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // alert('hello');
      //
      if (error.status === 410) {
        // localStorage.removeItem('currentUser');
        // localStorage.removeItem('profile');
        // this.user = {};
        // this.profile = {};
        // window.location.replace('/login');
        //


      }
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }

    // return an ErrorObservable with a user-facing error message
    return Observable.throw(error || 'Server error')
  };


}

