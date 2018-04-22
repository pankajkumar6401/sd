import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { LaravelProvider } from '../../providers/laravel/laravel';
import { Storage } from '@ionic/storage';
import { HttpErrorResponse } from '@angular/common/http/src/response';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  loading:any;
  visiblePass:boolean = false;
  userDetails:any = {
    user_detail: {photo:'',first_name:''},
  };


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public httpClient: HttpClient,
    public laravel: LaravelProvider,
    public loadingCtrl: LoadingController,
    public toast: ToastController,
    public modalCtrl: ModalController,
    private storage: Storage,
    private alertCtrl: AlertController,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.loading = this.loadingCtrl.create({
      content: 'Please Wait'
    });
    this.loading.present();
    this.storage.get('surakshadal_userDetails').then(
      data => {
        this.userDetails = data;
        console.log(this.userDetails);
        this.loading.dismiss();
      },
      err => {
        this.loading.dismiss().then(() => {
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
    );
  }

  changePass(){
    this.navCtrl.push('ChangePasswordPage');
  }

  openProfileImage() {
    this.navCtrl.push('ProfileImagePage', {profilePage: this, profileimageData:this.userDetails['user_detail'], photo:this.userDetails.photo});
  }

  openPersonal() {
    this.navCtrl.push('PersonalDetailsPage',{userDetailsData:this.userDetails['user_detail'],idproof_types:this.userDetails.id_types});
  }
     
  openAddress() {
    this.navCtrl.push('AddressDetailsPage',{userAddressData:this.userDetails['user_detail'],states:this.userDetails.states,districts:this.userDetails.district,tehsils:this.userDetails.tehsil});
  }

  openFamily() {
    this.navCtrl.push('FamilyDetailsPage',{userFamilyData:this.userDetails['familydata'],relations:this.userDetails.relations, user_id:this.userDetails['user_detail']['id']});
  }

  logout(){
    this.alertCtrl.create({
      title: 'Are you Sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Log Out',
          handler: () => {
            this.httpClient.post<any>(this.laravel.getLogoutApi(),{}).subscribe(
              res => {
                this.loading.dismiss().then(()=>{
                  if(res.success){
                    this.storage.remove('userTokenInfo').then(()=>{
                      this.laravel.removeToken();
                      this.toast.create({
                        message: 'You are successfully logout!',
                        duration: 3000
                      }).present();  
                      this.navCtrl.setRoot('LoginPage');
                    });
                  }else{
                    let errorMsg = 'Something went wrong. Please contact your app developer';
                    this.storage.remove('userTokenInfo').then(()=>{
                      this.laravel.removeToken();
                      this.navCtrl.setRoot('LoginPage');
                      this.toast.create({
                        message: (res.hasOwnProperty('msg')) ? res.msg : errorMsg,
                        duration: 3000
                      }).present();  
                    });
                  }
                });
              },
              (err: HttpErrorResponse) => {
                let errorMsg = 'Something went wrong. Please contact your app developer';
                if(err.error instanceof Error){
                  errorMsg = err.error.message;
                }
                this.toast.create({
                  message: errorMsg ,
                  duration:3000
                }).present(); 
              }
            )
          }
        }
      ]
    }).present();
  }

}
