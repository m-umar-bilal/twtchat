// import {Injectable} from '@angular/core';
// import { Observable } from 'rxjs/Rx';
// import { RestService } from '../services/rest.service';
// import 'rxjs/add/operator/map';
// import {UserService} from "./user.service";
//
//
//
// @Injectable()
// export class RequestService {
//
//
//   constructor(
//     private rs: RestService,
//     private us: UserService
//
//   ) { }
//
//   // Documents Requests Section Start
//
//   public getDocumentCategories(): Observable<any> {
//     return this.rs.requestGET(`${this.rs.serverURL}/documentCategories`);
//   }
//
//   public getDocuments(): Observable<any> {
//     return this.rs.requestByIdGET(`${this.rs.serverURL}/userDocs`);
//   }
//   public saveDocumentCategory(body: Object): Observable<any> {
//     return this.rs.requestPOST(`${this.rs.serverURL}/documentCategory`,body);
//   }
//
//   public getDocumentTypes(): Observable<any> {
//     return this.rs.requestGET(`${this.rs.serverURL}/documentTypes`);
//   }
//
//   public getDocumentCetegoryById(id): Observable<any> {
//     return this.rs.requestGET(`${this.rs.serverURL}/documentCategory/${id}`);
//   }
//
//   public saveDocument(body: Object): Observable<any> {
//     return this.rs.requestPOST(`${this.rs.serverURL}/queueUpload`, body);
//   }
//
//   public updateDocument(body: Object, id): Observable<any> {
//     return this.rs.requestPUT(`${this.rs.serverURL}/queueUpload/${id}`,body);
//   }
//
//   public getDocument(id): Observable<any> {
//     return this.rs.requestGET(`${this.rs.serverURL}/queueUpload/${id}`);
//   }
//   public deleteDocument(body: Object, id): Observable<any> {
//     return this.rs.requestDelete(`${this.rs.serverURL}/queueUpload/${id}`,body);
//   }
//
//
//   public getDocumentTypeByTypeId(id): Observable<any> {
//     return this.rs.requestGET(`${this.rs.serverURL}/documentType/${id}`);
//   }
//
//   // Documents Requests Section End
//
//   // Jobs Requests Section Start
//
//   public getJobs(): Observable<any> {
//     return this.rs.requestGET(`${this.rs.serverURL}/jobs`);
//   }
//
//   public getEmployeeAppliedJobs(id): Observable<any> {
//     return this.rs.requestGET(`${this.rs.serverURL}/submittals/employee/${id}`);
//   }
//
//   public getEmployeeSavedJobs(id): Observable<any> {
//     return this.rs.requestGET(`${this.rs.serverURL}/savedJobs/employee/${id}`);
//   }
//
//   public deleteJob(body: Object, id): Observable<any> {
//     return this.rs.requestDeleteByIdOnly(`${this.rs.serverURL}/job/${id}`);
//   }
//
//   public addJob(body: Object): Observable<any> {
//     return this.rs.requestPOST(`${this.rs.serverURL}/job`, body);
//   }
//
//   public applyJob(body: Object): Observable<any> {
//     return this.rs.requestPOST(`${this.rs.serverURL}/submittal`, body);
//   }
//
//   public saveJob(body: Object): Observable<any> {
//     return this.rs.requestPOST(`${this.rs.serverURL}/savedJob`, body);
//   }
//
//   public getComplianceReports(): Observable<any> {
//     return this.rs.requestGET(`${this.rs.serverURL}/compliancereports/${this.us.getUserProfile().id}`);
//   }
//   public deleteComplianceReport(body: Object, id): Observable<any> {
//     return this.rs.requestDeleteByIdOnly(`${this.rs.serverURL}/complianceReport/${id}`);
//   }
//   public addComplianceReport(body: Object): Observable<any> {
//     return this.rs.requestPOST(`${this.rs.serverURL}/compliancereport`, body);
//   }
//
//   public updateComplianceReport(body: Object): Observable<any> {
//     return this.rs.requestPUT(`${this.rs.serverURL}/compliancereport/${body['id']}`, body);
//   }
//
//
//   // ComplianceReports Section End
//   // Jobs Requests Section End
//
//   // Employer Requests Start
//
//   public getEmployers(): Observable<any> {
//     console.log("request getEmployers");
//     return this.rs.requestGET(`${this.rs.serverURL}/employers`);
//     // if (this.us.userProfile._type === 'system') {
//     //   return this.rs.requestGET(`${this.rs.serverURL}/employers`);
//     // } else if (this.us.userProfile._type === 'agency') {
//     //   return this.rs.requestGET(`${this.rs.serverURL}/contracts/hospitals/${this.us.userProfile.id}`);
//     // }
//   }
//
//   public getEmployer(id): Observable<any> {
//     return this.rs.requestGET(`${this.rs.serverURL}/employer/${id}`);
//   }
//
//
//
//   // Employer Requests End
//
//   public setSubscription(body: Object): Observable<any> {
//     return this.rs.requestPOST(`${this.rs.serverURL}/subscription`, body);
//   }
//
//   ///agreements/{agreementId}/signingUrls
//
//   public getsigningUrls(api_access_point,agreementId,accessToken): Observable<any> {
//     return this.rs.requestGetO(`${api_access_point}/agreements/${agreementId}/signingUrls`,accessToken);
//   }
//
//   // /subscriptions/employer/:id
//   public getSubscriptionsEmployee(): Observable<any> {
//     return this.rs.requestGET(`${this.rs.serverURL}/subscriptions/employee/${this.us.getUserProfile().id}`);
//   }
// ///adobe/refresh
// public getAdobeRefreshToken(): Observable<any> {
//   return this.rs.requestGET(`${this.rs.serverURL}/adobe/refresh`);
// }
//
//
//   public adobeOauthRefresh(api_access_point,code,clientId, client_secret, redirect_uri): Observable<any> {
//     return this.rs.requestPOSTX(`${api_access_point}/oauth/refresh?refresh_token=${code}&client_id=${clientId}&client_secret=${client_secret}&grant_type=${redirect_uri}`, {});
//   }
//
//   public sendDocument1(api_access_point,body,accessToken): Observable<any> {
//     return this.rs.requestPOSTP(`${api_access_point}/api/rest/v5/agreements`,body, accessToken);
//   }
//
//
//   //messaging apis
//   public pushNotifying(id: Object, type: Object, body: Object): Observable<any> {
//     return this.rs.requestPOST(`${this.rs.serverURL}/notification/${id}/${type}`, body);
//   }
//
//   public getMessages(): Observable<any> {
//     return this.rs.requestGET(`${this.rs.serverURL}/notifications/${this.us.userProfile.id}`);
//   }
//
//   public validateToken(body: Object): Observable<any> {
//     return this.rs.requestPOST(`${this.rs.serverURL}/ver_code/mob`, body);
//   }
//
//   public changePassword(body: Object): Observable<any> {
//     return this.rs.requestPOST(`${this.rs.serverURL}/set_pass/mob`, body);
//   }
//
//   public getEmployeeObj(id): Observable<any> {
//     return this.rs.requestGETByCustomAuthoriztion(`${this.rs.serverURL}/employee/${id}`);
//   }
//
//   public verifyEmployee(id, type, body): Observable<any> {
//     return this.rs.requestPUTByCustomAuthorization(`${this.rs.serverURL}/check/verification/${id}/${type}`, body);
//   }
//
//   public changePasswordBySignup(body: Object, email): Observable<any> {
//     return this.rs.requestPOSTByCustomAuthorization(`${this.rs.serverURL}/update_pass/${email}`, body);
//   }
//
//   public queuesList(): Observable<any>{
//     return this.rs.requestGET(`${this.rs.serverURL}/queues`);
//   }
//
//
// }
