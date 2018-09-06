import { Component } from '@angular/core';
import { NumberValidator } from './../../validators/number';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { LaravelProvider } from './../../providers/laravel/laravel';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http/src/response';

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  forgotPasswordForm:any;
  mobileChanged:boolean = false;
  submitAttempt:boolean = false;
  loading:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private httpClient: HttpClient,
    public toast: ToastController,
    private formBuilder: FormBuilder,
    public laravel: LaravelProvider,
    public loadingCtrl: LoadingController,
  ) {
    this.forgotPasswordForm = this.formBuilder.group({
      mobile:['', Validators.compose([Validators.required, NumberValidator.isValid])],
    });
  }

  elementChanged(input){
    let field = input.ngControl.name;
    this[field + "Changed"] = true;
  }

  submit(){
    this.submitAttempt = true;
    if(this.forgotPasswordForm.valid){
      let data = {
        'mobile': this.forgotPasswordForm.controls.mobile.value,
      }
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      this.loading.present();
      this.httpClient.post<any>(this.laravel.getForgotPasswordApi(),data)
      .subscribe(
        res => {
          this.forgotPasswordForm.controls.mobile.setValue('');
          this.navCtrl.pop();
          this.loading.dismiss();
          this.toast.create({
            message: 'Your request has been received and You will receive password shortly!',
            duration: 3000
          }).present();
        },
        (err:HttpErrorResponse) => {
          this.loading.dismiss();
              this.toast.create({
                message: 'Something went wrong! While reseting your password. Please contact your app support team!',
                duration: 3000
              }).present();
        }
      )
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

}
