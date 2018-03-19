import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, ViewController } from 'ionic-angular';
import { PincodeValidator } from './../../validators/pincode';
import { FormBuilder, Validators } from '@angular/forms';
import { LaravelProvider } from '../../providers/laravel/laravel';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Storage } from '@ionic/storage';


/**
 * Generated class for the AddressDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-address-details',
  templateUrl: 'address-details.html',
})
export class AddressDetailsPage {
  addressDetailForm:any;
  user_detail:any;
  submitAttempt: boolean = false;
  loading:any;
  states=[];
  districts=[];
  tehsils=[];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    public toast: ToastController,
    public laravel: LaravelProvider,
    public loadingCtrl: LoadingController,
    public httpClient: HttpClient,
    private storage: Storage,
  ) {
    this.user_detail= navParams.get('userAddressData');
    this.states = navParams.get('states');
    this.districts = navParams.get('districts');
    this.tehsils = navParams.get('tehsils');  
    this.addressDetailForm = this.formBuilder.group({        
      pincode: [this.user_detail.pincode, Validators.compose([ PincodeValidator.isValid])],       
      address_1: [this.user_detail.address_1,Validators.required],
      address_2: [this.user_detail.address_2],
      state: [this.user_detail.state_id,Validators.required],       
      district: [this.user_detail.district_id,Validators.required] ,      
      tehsil: [this.user_detail.tehsil_id,Validators.required],
      user_id:[this.user_detail.id]     
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddressDetailsPage');
  }

  save(){
    this.submitAttempt = true;
    if (this.addressDetailForm.valid){
      let profileData = {
         'pincode': this.addressDetailForm.controls.pincode.value,
         'address_line_1': this.addressDetailForm.controls.address_1.value,
         'address_line_2': this.addressDetailForm.controls.address_2.value,
         'state': this.addressDetailForm.controls.state.value,
         'distric': this.addressDetailForm.controls.district.value,
         'tehsil': this.addressDetailForm.controls.tehsil.value,
         'user_id': this.addressDetailForm.controls.user_id.value
       };
       this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      this.loading.present();
      this.httpClient.post<any>(this.laravel.getUpdateAddressDetail(),profileData)
      .subscribe(
        res => {
          this.loading.dismiss().then(()=>{
            if(res.succes){
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
        }
      )
    }
  }

  elementChanged(input){
    let field = input.ngControl.name;
    this[field + "Changed"] = true;
  }

  getDist(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
    this.httpClient.get<any>(this.laravel.getDist(this.addressDetailForm.controls.state.value))
    .subscribe(
    res => {
      this.loading.dismiss().then(()=> {
        this.districts = res;
        this.tehsils = [];
      });
    },
    (err: HttpErrorResponse) => {
      this.loading.dismiss();
      let errorMsg = 'Something went wrong. Please contact your app developer';
      if(err.error instanceof Error){
        errorMsg = err.error.message;
      }

      this.toast.create({
        message: errorMsg ,
        duration:3000
      }).present();
    });
  }

  getTehsil(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
    this.httpClient.get<any>(this.laravel.getTehsil(this.addressDetailForm.controls.district.value))
    .subscribe(res => {
      this.loading.dismiss().then(()=>{
        this.tehsils=res;
      });
      
    },
    (err: HttpErrorResponse) => {
      this.loading.dismiss();
      let errorMsg = 'Something went wrong. Please contact your app developer';
      if(err.error instanceof Error){
        errorMsg = err.error.message;
      }

      this.toast.create({
        message: errorMsg ,
        duration:3000
      }).present();
    });
  }

}
