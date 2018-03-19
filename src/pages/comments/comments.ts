import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { LaravelProvider } from '../../providers/laravel/laravel';
import { Storage } from '@ionic/storage';
import { FormBuilder, Validators } from '@angular/forms';

/**
 * Generated class for the CommentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {
  addCommentForm:any;
  submitAttempt: boolean = false;
  comments:any;
  request_id:any;
  loading:any;
  userdetails=[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public httpClient: HttpClient,
    public laravel: LaravelProvider,
    public storage: Storage,
    public toast: ToastController,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController
  ) {
    this.addCommentForm =this.formBuilder.group({        
      message: ['',Validators.required]
    });
    this.request_id= navParams.get('requestId');
    this.comments = navParams.get('comments');
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
    this.storage.get('surakshadal_userDetails').then(
      userdetails => {         
        this.userdetails = userdetails;
        this.loading.dismiss();
        /*this.httpClient.get<any>(this.laravel.getComments(this.request_id)).subscribe(
          (res) => {
           this.comments = res;
            this.loading.dismiss();
          },
          (err) => {
            let errorMsg = 'Something went wrong. Please contact your app developer';
            if(err.error instanceof Error){
              errorMsg = err.error.message;
            }
            this.toast.create({
              message: errorMsg ,
              duration:3000
            }).present();
          }
        );*/
      },
      err=>{
        this.loading.dismiss();
      }
    );
  }

  ionViewDidLoad() {
    
  }

  dismiss(data = null){
    this.viewCtrl.dismiss(data);
  }

  save(){
    this.submitAttempt = true;
    if(this.addCommentForm.valid){
      let data = {
        requestId: this.request_id,
        message: this.addCommentForm.controls.message.value
      }
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      this.loading.present();
      this.httpClient.post<any>(this.laravel.getAddCommentApi(),data).subscribe(
        res => {
          if(res.success){
            this.loading.dismiss();
            this.dismiss(res.data);
          }
        },
        err => { 
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

}
