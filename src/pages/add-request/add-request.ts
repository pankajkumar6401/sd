import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, ActionSheetController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FormBuilder, Validators } from '@angular/forms';
import { LaravelProvider } from './../../providers/laravel/laravel';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { Storage } from '@ionic/storage';


/**
 * Generated class for the AddRequestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-request',
  templateUrl: 'add-request.html',
})
export class AddRequestPage {

  loading:any;
  addRequestForm:any;
  types:any;
  submitAttempt: boolean = false;
  userDetails:any;
  requestimg: string = '';
  originalFile: string = '';
  typeChanged: boolean = false;
  messageChanged: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private camera:Camera,
    public laravel: LaravelProvider,
    public toast: ToastController,
    public httpClient: HttpClient,
    private formBuilder: FormBuilder,
    public actionSheetCtrl: ActionSheetController,
    private transfer: FileTransfer,
    public loadingCtrl: LoadingController,
    private storage: Storage,
  ) {
    this.addRequestForm =this.formBuilder.group({
      type: ['',Validators.required],
      message: ['',Validators.required],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddRequestPage');
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
    this.httpClient.get<any>(this.laravel.getRequestType()).subscribe(
      res => {
        this.types= res;
        this.storage.get('surakshadal_userDetails').then(
          userdetails => {
            this.userDetails = userdetails;
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
      },
      (err: HttpErrorResponse)=> {
        this.loading.dismiss().then(()=>{
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
    )
  }

  elementChanged(input){
    let field = input.ngControl.name;
    this[field + "Changed"] = true;
  }

  takePicture(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Choose from Gallery',
      buttons: [{
        text: 'From Gallery',
        handler: () => {
          this.openGallery();
        }
      },{
        text: 'From Camera',
        handler: () => {
          this.openCamera();
        }
      },{
        text: 'Cancel',
        role: 'cancel',
      }]
    });
    actionSheet.present();
  }

  openGallery() {
    var options: CameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI
    };
    this.camera.getPicture(options).then((imageData) => {
      this.uploadImage(imageData);
    },(err) => {
      this.toast.create({
        message: 'Something went wrong. Please contact your app developer',
        duration:3000
      });
    });
  }

  openCamera() {
    var options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.FILE_URI,
      saveToPhotoAlbum:true
    };
    this.camera.getPicture(options).then((imageData)=>{
      this.uploadImage(imageData);
    },(err) => {
      this.toast.create({
        message: 'Something went wrong. Please contact your app developer',
        duration:3000
      });
    });
  }

  uploadImage(fileUrl) {
    this.loading = this.loadingCtrl.create({
      content: 'Uploading File..'
    });
    this.loading.present();
    let token:string = this.laravel.getToken();
    const fileTransfer: FileTransferObject  = this.transfer.create();
    let options1: FileUploadOptions = {
      fileKey: 'requestImage',
      fileName: 'request.jpg',
      headers:{'Authorization':token},
      chunkedMode: false,
    }
    fileTransfer.upload(fileUrl, this.laravel.uploadRequestImage(), options1)
    .then((data)=> {
      this.loading.dismiss();
      let response = JSON.parse(data.response);
      if(response.success){
        this.originalFile = response.requestImage;
        this.requestimg = this.laravel.getRequestImagePath(response.requestImage);
      }else{
        this.toast.create({
          message: 'Sorry we are experiencing some issue while uploading logo. Please contact your app developer',
          duration:3000
        });  
      }
    },(err) => {
      this.loading.dismiss();
      this.toast.create({
        message: 'Something went wrong. Please contact your app developer',
        duration:3000 
      });
    });
  }

  save(){
    this.submitAttempt = true;
    if(this.addRequestForm.valid){
      let data = {
        type: this.addRequestForm.controls.type.value,
        message: this.addRequestForm.controls.message.value,
        requestimg: this.originalFile
      }
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      this.loading.present();
      this.httpClient.post<any>(this.laravel.getAddRequestApi(),data).subscribe(
        res => {
          if(res.success){
            this.loading.dismiss().then(() => {
              this.navCtrl.parent.select(0);
            });
          }else{
            let msg = res.error.message.join();
            this.loading.dismiss().then(()=>{
              this.toast.create({
                message: msg ,
                duration:3000
              }).present();
            });
          }
        },
        (err: HttpErrorResponse) => {
          this.loading.dismiss().then(()=>{
            let errorMsg = 'Something went wrong. Please contact your app developer!';
            if(err.error instanceof Error){
              errorMsg = err.error.message;
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

}
