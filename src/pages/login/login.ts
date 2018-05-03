import { NumberValidator } from './../../validators/number';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { LaravelProvider } from './../../providers/laravel/laravel';
import { TabsPage } from '../tabs/tabs';
import { HttpErrorResponse } from '@angular/common/http/src/response';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public loginForm;
  mobileChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;
  database: any;
  client_secret:string = '8FG7veWcZ140lgCJGFfUhqXGm3LjDqu71SbQWEUy';
  client_id = 2;
  loading:any;
  visiblePass:boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private httpClient: HttpClient,
    public toast: ToastController,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    public laravel: LaravelProvider,
  ) {
    this.loginForm = this.formBuilder.group({
      mobile:['',Validators.compose([Validators.required,NumberValidator.isValid])],
      password: ['', Validators.required]
    });
  }

  elementChanged(input){
    let field = input.ngControl.name;
    this[field + "Changed"] = true;
  }

  login(){
    this.submitAttempt = true;
    if (this.loginForm.valid){
      let credential = {
        username :this.loginForm.controls.mobile.value,
        password : this.loginForm.controls.password.value,
      };
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      this.loading.present();
      this.httpClient.post<ResponseToken>(this.laravel.getLoginApi(),{
        grant_type: 'password',
        client_id: 2,
        client_secret:this.client_secret,
        username:credential.username,
        password:credential.password,
        scope:'*'
      }).subscribe(
        res => {
          this.storage.set('surakshadal_userTokenInfo',res.token_type+' '+res.access_token)
          .then(
            data => {
              this.laravel.setToken(res.token_type+' '+res.access_token);
              this.httpClient.get<UserDetailResponse>(this.laravel.getUserDetailApi())
              .subscribe(
                res => {
                  this.storage.set('surakshadal_userDetails',res).then(
                    res => {
                      this.loading.dismiss();
                      this.navCtrl.setRoot(TabsPage);
                    },
                    err => {
                      this.loading.dismiss();
                      this.toast.create({
                        message: 'Something went wrong! While Saving User\'s Details Getting. Please contact your app developers',
                        duration: 3000
                      }).present();
                    }
                  );
                },
                err => {
                  this.loading.dismiss();
                  this.toast.create({
                    message: 'Something went wrong! While Getting User\'s Details. Please contact your app developers',
                    duration: 3000
                  }).present();
                }
              );
            },
            err => {
              this.loading.dismiss();
              this.toast.create({
                message: 'Something went wrong! While Storing your session. Please contact your app developer',
                duration: 3000
              }).present();
            }
          );
        },
        (err: HttpErrorResponse)=>{
          this.loading.dismiss();
          let errorMsg = 'Something went wrong. Please contact your app developer';
          if(err.error.hasOwnProperty('message')){
            errorMsg = err.error.message; 
          }    
          this.toast.create({
            message: errorMsg ,
            duration:3000
          }).present();
        }
      );
    }
  }

  goToRegister(){
    this.navCtrl.push('RegisterPage');
  }

  forgotPassword(){ 
    this.navCtrl.push('ForgotPasswordPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
interface ResponseToken {
  token_type: string;
  access_token: string;
}
interface UserDetailResponse {
  data: string[];
}