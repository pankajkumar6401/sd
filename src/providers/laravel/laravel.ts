import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the LaravelProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LaravelProvider {

  url:string = '';
  token:string = '';
  isProduction:boolean = true; 

  constructor(public http: HttpClient) {
    console.log('Hello LaravelProvider Provider');
  }

  getUrl(){
    return (this.isProduction)?'http://webapp.surakshadal.com/':'http://webapp.surakshadal.loc/';
  }

  getLoginApi(){
    return this.getUrl() + 'oauth/token';
  }

  getRegistrationApi() {
    return this.getUrl() + 'api/user/register';
  }

  getUserDetailApi(){
    return this.getUrl() + 'api/userdetails';
  }

  getRequestApi(){
    return this.getUrl() + 'api/request/data';
  }

  addLikeApi(){
    return this.getUrl() +'api/add/like';
  }

  addDisLikeApi(){
    return this.getUrl() +'api/add/dislike';
  }

  getProflieImagePath(imagefile){
    return this.getUrl() + 'storage/images/profile/' + imagefile;
  }

  getRequestImagePath(imagefile){    
    return this.getUrl() + 'storage/images/request_images/' + imagefile;
  }

  getRequestType(){
    return this.getUrl() +'api/get/request/type';
  }

  uploadRequestImage(){
    return this.getUrl() +'api/uploadRequestImage';
  }

  getAddRequestApi(){
    return this.getUrl() + 'api/add';
  }

  getLogoutApi(){
    return this.getUrl() + 'api/logout';
  }

  getUpdatePersonalDetail(){
    return this.getUrl() + 'api/update/personal/detail';
  }
  
  getUpdateAddressDetail(){
    return this.getUrl() + 'api/update/address';
  } 
  getAddFamilyDetail(){
    return this.getUrl() + 'api/update/family/details' ;
  }  
  getUpdateFamilyDetailApi(){
    return this.getUrl() + 'api/update/family';
  }

  getDist(id){
    return this.getUrl() + 'api/get/district/'+id;
  }

  getTehsil(id){
    return this.getUrl() + 'api/get/tehsil/'+id;
  }

  getComments(id){
    return this.getUrl() + 'api/get/comments/'+id;
  }

  setToken(val){
    this.token = val;
  }

  getToken(){
    return this.token;
  }

  removeToken(){
    this.token = '';
  }

  getAddCommentApi(){
    return this.getUrl() + 'api/post/comment';
  }

  getMemberApi(){
    return this.getUrl() + 'api/member'; 
  }

  deleteMember(){   
    return this.getUrl() +'api/member/delete';
  }

  uploadProfileImage(){
    return this.getUrl() + 'api/update/profile/image';
  }

  getchangePassApi(){
    return this.getUrl() + 'api/change/password';
  }

}
