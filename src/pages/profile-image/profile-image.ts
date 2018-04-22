import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, ViewController, ActionSheetController } from 'ionic-angular';
import { LaravelProvider } from '../../providers/laravel/laravel';
import { HttpClient } from '@angular/common/http';
import { FileTransfer, FileUploadOptions, FileTransferObject  } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the ProfileImagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile-image',
  templateUrl: 'profile-image.html',
})
export class ProfileImagePage {

  loading:any;
  user_detail:any;
  image:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    public laravel: LaravelProvider,
    public loadingCtrl: LoadingController,
    public toast: ToastController,
    public viewCtrl: ViewController,
    public httpClient: HttpClient,
    private transfer: FileTransfer,
    private storage: Storage
  ) {
    this.user_detail= navParams.get('profileimageData');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FamilyDetailsPage');
  }

  takepicture() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Choose your Profile Picture',
      buttons: [
        {
          text: 'Choose from gallery',
          handler: () => {
             this.openGallery();
          }
        },
        {
          text: 'Take a photo',
          handler: () => {
            this.openCamera();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
        }
      ]
    });

    actionSheet.present();
  }

  openGallery(){
    var options : CameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI
    };
    this.camera.getPicture(options).then((imageData) => {
      this.uploadImage(imageData);
    },(err) => {
      this.toast.create({
        message: 'Something went wrong. Not able to use your gallyer image. Please contact your app developer',
        duration:3000
      });
    });
  }

  openCamera(){
    var options: CameraOptions  = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      destinationType: this.camera.DestinationType.FILE_URI,
      saveToPhotoAlbum:true
    };
    this.camera.getPicture(options).then((imageData)=>{
      this.uploadImage(imageData);
    },(err) => {
      this.toast.create({
        message: 'Something went wrong. Not able to use your clicked Picture. Please contact your app developer',
        duration:3000
      }).present();
    });
  }

  uploadImage(fileUrl){
    this.loading = this.loadingCtrl.create({
      content: 'Uploading File..'
    });
    this.loading.present();
    let token:string = this.laravel.getToken();
    const fileTransfer: FileTransferObject  = this.transfer.create();
    let options1: FileUploadOptions = {
      fileKey: 'profileimage',
      fileName: 'profile.jpg',
      headers:{'Authorization':token},
      chunkedMode: false,
    }
 
    fileTransfer.upload(fileUrl, this.laravel.uploadProfileImage(), options1)
    .then((data)=> {
      this.loading.dismiss().then(()=>{
        let response = JSON.parse(data.response);
        if(response.success){
          console.log(JSON.stringify(response));
          this.user_detail.photo = response.profileimage;
          this.httpClient.get<any>(this.laravel.getUserDetailApi())
          .subscribe(
            res => {
              this.storage.set('surakshadal_userDetails',res).then(
                res => {
                  this.navCtrl.setRoot('ProfilePage');
                  this.toast.create({
                    message: 'Profile Image has been Updated' ,
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
        }else{
          this.toast.create({
            message: 'Sorry we are experiencing some issue while uploading image. Please contact your app developer',
            duration:3000
          }).present();  
        }
      });
      
    },(err) => {
      this.loading.dismiss();
      this.toast.create({
        message: 'Something went wrong. Please contact your app developer',
        duration:3000
      }).present();
    });
  }

}
