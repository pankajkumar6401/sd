import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LaravelProvider } from './../../providers/laravel/laravel';
import { PasswordValidator } from './../../validators/password';

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  changePassForm:any;
  passwordChanged:boolean = false;
  confirmPasswordChanged:boolean = false;
  submitAttempt: boolean = false;
  loading:any;
  visiblePass:boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toast: ToastController,
    private formBuilder: FormBuilder,
    public laravel: LaravelProvider,
    public loadingCtrl: LoadingController,
    public httpClient: HttpClient,
  ) {
    this.changePassForm = this.formBuilder.group({
      passwordGroup: this.formBuilder.group({
        password: ['',Validators.required],
        confirmPassword: ['',Validators.required]
      },PasswordValidator.MatchPassword)
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }

  elementChanged(input){
    let field = input.ngControl.name;
    this[field + "Changed"] = true;
  }

  save(){
    this.submitAttempt = true;
    console.log(this.changePassForm.valid); 
    /*if(this.changePassForm.valid){
      let data = {
        'password': this.changePassForm.controls.passwordGroup.controls.password.value,
        'password_confirmation': this.changePassForm.controls.passwordGroup.controls.confirmPassword.value,
      }
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      this.loading.present();
      this.httpClient.post<any>(this.laravel.getchangePassApi(),data).subscribe(
        res => {
          if(res.success){
            this.loading.dismiss().then(()=>{
              this.toast.create({
                message: 'Password Changed!' ,
                duration:300
              }).present();
              this.navCtrl.pop();
            });
          }else{
            this.loading.dismiss().then(()=>{
              this.toast.create({
                message: 'Oops! Something went wrong while changing password. Please try again or contact app developer' ,
                duration:300
              }).present();
            });
          }
        },
        err => {
          this.toast.create({
            message: 'Oops! Something went wrong. Please try again' ,
            duration:300
          }).present();
        }
      )
    }*/
  }

}
