import { NameValidator } from './../../validators/name';
import { NumberValidator } from './../../validators/number';
import { PasswordValidator } from './../../validators/password';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { LaravelProvider } from './../../providers/laravel/laravel';
import { FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { HttpErrorResponse } from '@angular/common/http/src/response';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  registerForm:any;
  passwordChanged:boolean = false;
  confirmPasswordChanged:boolean = false;
  nameChanged: boolean = false;
  fatherNameChanged: boolean = false;
  mobileChanged: boolean = false;
  submitAttempt: boolean = false;
  database: any;
  client_secret:string = '8FG7veWcZ140lgCJGFfUhqXGm3LjDqu71SbQWEUy';
  client_id = 2;
  loading:any;
  visiblePass:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private httpClient: HttpClient,
    public toast: ToastController,
    private formBuilder: FormBuilder,
    public laravel: LaravelProvider,
    public loadingCtrl: LoadingController,
    private storage: Storage
  ) {
    this.registerForm = this.formBuilder.group({
      mobile:['', Validators.compose([Validators.required, NumberValidator.isValid])],
      name:['', Validators.compose([Validators.required, NameValidator.isValid])],
      fatherName: ['', Validators.compose([Validators.required, NameValidator.isValid])],
      passwordGroup: this.formBuilder.group({
        password: ['',Validators.required],
        confirmPassword: ['',Validators.required]
      },PasswordValidator.MatchPassword)
    });
  }

  elementChanged(input){
    let field = input.ngControl.name;
    this[field + "Changed"] = true;
  }

  ionViewDidLoad() {
    
  }

  register(){
    this.submitAttempt = true;
    if(this.registerForm.valid){
      let data = {
        'first_name': this.registerForm.controls.name.value,
        'father_name': this.registerForm.controls.fatherName.value,
        'mobile_no': this.registerForm.controls.mobile.value,
        'password': this.registerForm.controls.passwordGroup.controls.password.value,
        'password_confirmation': this.registerForm.controls.passwordGroup.controls.confirmPassword.value,
        'client_id': this.client_id,
        'client_secret': this.client_secret
      }
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      this.loading.present();
      this.httpClient.post<RegisterInterface>(this.laravel.getRegistrationApi(),data)
      .subscribe(
        res => {
          if(res.success){
            this.storage.set('surakshadal_userTokenInfo', res.token.token_type+' '+res.token.access_token)
            .then(
              data => {
                this.laravel.setToken(res.token.token_type+' '+res.token.access_token);
                this.httpClient.get<any>(this.laravel.getUserDetailApi())
                .subscribe(
                  res => {
                    this.storage.set('surakshadal_userDetails',res).then(
                      res => {
                        this.loading.dismiss();
                        this.navCtrl.setRoot(TabsPage);
                      },
                      err => {
                        this.loading.dismiss().then(()=>{
                          this.toast.create({
                            message: 'Something went wrong! While Saving User\'s Details Getting. Please contact your app developers',
                            duration: 3000
                          }).present();
                        });
                        
                      }
                    );
                  },
                  err => {
                    this.loading.dismiss().then(()=>{
                      this.toast.create({
                        message: 'Something went wrong! While Getting User\'s Details. Please contact your app developers',
                        duration: 3000
                      }).present();
                    });
                  }
                );
              },
              err => {
                this.loading.dismiss().then(() => {
                  this.toast.create({
                    message: 'Something went wrong! While Storing your session. Please contact your app developer',
                    duration: 3000
                  }).present();
                });
              }
            );
          }else{
            this.loading.dismiss().then(()=>{
              this.toast.create({
                message: 'Sorry we are not able to register any user right now. Please try again after some time',
                duration: 3000
              }).present();
            });
          }
        },
        (err:HttpErrorResponse) => {
          this.loading.dismiss().then(()=>{
            let errorMsg = 'Something went wrong. Please contact your app developer';
            if(err.hasOwnProperty('error')){
              errorMsg = err.error.error.join();
            }
            this.toast.create({
              message: errorMsg ,
              duration:3000
            }).present();
          });
        }
      )
    }
  }

  goTologinPage(){
    this.navCtrl.pop()
  }
}
interface RegisterInterface {
  success: boolean;
  token: {
    token_type:string,
    access_token:string,

  };
}
interface UserDetailResponse {
  data: string[];
}