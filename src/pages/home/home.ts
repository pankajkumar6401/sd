import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { LaravelProvider } from '../../providers/laravel/laravel';
import { HttpErrorResponse } from '@angular/common/http/src/response';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  requests= [];
  loading:any;
  sychedData:boolean = false;
 
  request:any;
  request_id:any; 
  request_image=[]; 
  page:any = 0;
  noMore:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public httpClient: HttpClient,
    public laravel: LaravelProvider,
    public loadingCtrl: LoadingController,
    public toast: ToastController,
    public modalCtrl: ModalController ,
  ) {
    
  }

  ionViewDidLoad() {
    this.getData();
  }

  doRefresh(refresher) {
    this.getData(refresher)
  }

  getData(refresher=null,infiniteScroll=null) {
    if(!this.loading){
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      this.loading.present();
    }
    let nextPage = this.page;
    if(infiniteScroll != null){
      nextPage += 1;
    }
    if(refresher != null){
      nextPage = 0;
    }
    this.httpClient.get<any>(this.laravel.getRequestApi() + '/'+ nextPage)
    .subscribe(
      res => {
        if(res.length){
          this.page = nextPage;
          if(infiniteScroll != null){
            this.requests = this.requests.concat(res);
          }else{           
            this.requests = res;
          }
        }else{
          this.noMore = 'No more Requests';
        }
        if(refresher != null){
          refresher.complete();
        }
        if(infiniteScroll != null){
          infiniteScroll.complete();
        }
        this.sychedData = true;
        this.loading.dismiss();
      },
      (err: HttpErrorResponse) => {
        this.loading.dismiss().then(()=>{
          let errorMsg = 'Something went wrong. Please contact your app developer';
          if(err.error instanceof Error){
            errorMsg = err.error.message;
          }
          if(refresher != null){
            refresher.complete();
          }
          if(infiniteScroll != null){
            infiniteScroll.complete();
          }
          this.sychedData = true;
          this.toast.create({
            message: errorMsg ,
            duration:3000
          }).present();
        });
      }
    )
  }

  addLike(id, index){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
    let data = {
      id: id
    };
    this.httpClient.post<any>(this.laravel.addLikeApi(),data).subscribe(
      res => {
        this.loading.dismiss().then(()=>{
          if(res.success){
            this.requests[index].like_count = res.lcount;
            this.requests[index].unlike_count = res.dcount;
          }else{
            this.toast.create({
              message: 'Oops! Something went wrong. Please try again',
              duration: 3000
            }).present();
          }
        });
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

  addDisLike(id, index){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
    this.httpClient.post<any>(this.laravel.addDisLikeApi(),{
      id: id
    }).subscribe(
      res => {
        this.loading.dismiss().then(()=>{
          if(res.success){
            this.requests[index].like_count = res.lcount;
            this.requests[index].unlike_count = res.dcount;
          }else{
            this.toast.create({
              message: 'Oops! Something went wrong. Please try again',
              duration: 3000
            }).present();
          }
        });
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

  addComments(request_id,comments,index){
    let modal = this.modalCtrl.create('CommentsPage',{requestId:request_id,comments:comments});
    modal.onDidDismiss(data => {
      if(data){
        console.log('came here');
        this.requests[index].comments = data;
      }
    });
    modal.present();
  }

  doInfinite(infiniteScroll){
    this.getData(null,infiniteScroll); 
  }

}
