import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { LaravelProvider } from '../../providers/laravel/laravel';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NameValidator } from '../../validators/name';
import { EmailValidator } from '../../validators/email';
import { NumberValidator } from '../../validators/number';
import { AadharValidator } from '../../validators/aadhar';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the PersonalDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-personal-details',
  templateUrl: 'personal-details.html',
})
export class PersonalDetailsPage {
  profileDetailForm: any;
  loading:any;
  user_details: any = {
    first_name: '',
    father_name: '',
    mother_name: '',
    email: '',
    mobile: '',
    phone: '',
    aadhar: '',
    idproof_type: '',
    dob: '',
    id_no: '',
    id: ''
  };
  idproof_types = [];
  nameChanged: boolean = false;
  fatherNameChanged: boolean = false;
  mobileChanged: boolean = false;
  emailChanged: boolean = false;
  submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toast: ToastController,
    private formBuilder: FormBuilder,
    public laravel: LaravelProvider,
    public loadingCtrl: LoadingController,
    public httpClient: HttpClient,
    private storage: Storage,
  ) {
    this.user_details = navParams.get('userDetailsData');
    this.idproof_types = navParams.get('idproof_types');
    this.profileDetailForm = this.formBuilder.group({
      name: [this.user_details.first_name, Validators.compose([NameValidator.isValid])],
      fatherName: [this.user_details.father_name, Validators.compose([ NameValidator.isValid])],
      motherName: [this.user_details.mother_name],
      email: [this.user_details.email, Validators.compose([ EmailValidator.isValid])],
      mobile_no: [this.user_details.mobile, Validators.compose([ NumberValidator.isValid])],
      phone: [this.user_details.phone],
      aadhar:[this.user_details.aadhar, Validators.compose([AadharValidator.isValid])],
      id_type: [this.user_details.idproof_type,Validators.required],          
      dob: [this.user_details.dob,Validators.required],
      idnumber:[this.user_details.id_no,Validators.required],
      user_id:[this.user_details.id]
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PersonalDetailsPage');
  }

  elementChanged(input){
    let field = input.ngControl.name;
    this[field + "Changed"] = true;
  }

  save(){
    this.submitAttempt = true;
    if (this.profileDetailForm.valid){
      let profileData = {
        'first_name': this.profileDetailForm.controls.name.value,
        'father_name': this.profileDetailForm.controls.fatherName.value,
        'mother_name': this.profileDetailForm.controls.motherName.value,
        'email': this.profileDetailForm.controls.email.value,
        'phone_no': this.profileDetailForm.controls.phone.value,
        'mobile_no': this.profileDetailForm.controls.mobile_no.value,
        'adhar_no': this.profileDetailForm.controls.aadhar.value,
        'dob': this.profileDetailForm.controls.dob.value,
        'id_type': this.profileDetailForm.controls.id_type.value,
        'id': this.profileDetailForm.controls.idnumber.value,
        'user_id': this.profileDetailForm.controls.user_id.value
      }
      // delete(profileData.phone)
      let headers = new Headers();
      let token:string = this.laravel.getToken();
      console.log(token);
      headers.append('Authorization', token);
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      this.loading.present();
      this.httpClient.post<any>(this.laravel.getUpdatePersonalDetail(),profileData).subscribe(
        res => {
          //success
          // this.navCtrl.setRoot('HomePage'); it's not required here 
          /// now we have to dismiss loading if we got any response from back-end 
          this.loading.dismiss().then(()=>{
            if(res.success){
              this.httpClient.get<any>(this.laravel.getUserDetailApi())
              .subscribe(
                res => {
                  this.storage.set('surakshadal_userDetails',res).then(
                    res => {
                      this.navCtrl.setRoot('ProfilePage');
                      this.toast.create({
                        message: 'Address has been Updated' ,
                        duration:3000
                      }).present();
                    },
                    err => {
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
            }
          }); 
        
      },
      (err: HttpErrorResponse) => {
        this.loading.dismiss();
        let errorMsg = 'Something went wrong. Please contact your app developer';
        if(err.error instanceof Error){
          errorMsg = err.error.message;
        }
        if(err.error.hasOwnProperty('errors')){
          if(err.error.errors instanceof Object){
            let k;
            for(k of Object.keys(err.error.errors)){
              console.log(err.error.errors[k]);
              
              if(errorMsg == 'Something went wrong. Please contact your app developer'){
                errorMsg = err.error.errors[k].join();
              }else{
                errorMsg += ',' + err.error.errors[k].join();
              }
            }
          }
        }
        this.toast.create({
          message: errorMsg ,
          duration:3000
        }).present();
      });
    }
  }

}
