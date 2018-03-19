import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, ViewController, AlertController } from 'ionic-angular';
import { LaravelProvider } from '../../providers/laravel/laravel';
import { HttpClient } from '@angular/common/http';

/**
 * Generated class for the FamilyDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-family-details',
  templateUrl: 'family-details.html',
})
export class FamilyDetailsPage {
  loading:any;
  user_detail:any;
  members:any = [];
  userFamilyData:any;
  relations:any;
  user_id:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public laravel: LaravelProvider,
    public loadingCtrl: LoadingController,
    public toast: ToastController,
    public viewCtrl: ViewController,
    public httpClient: HttpClient,
  ) {
    this.userFamilyData= navParams.get('userFamilyData');
    this.relations = navParams.get('relations');
    this.user_id = navParams.get('user_id');

    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FamilyDetailsPage');
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
    this.httpClient.get<any>(this.laravel.getMemberApi()).subscribe(
      res => {
        this.loading.dismiss().then(() => {
          this.members = res.details;
        }); 
      },
      error => {
        this.loading.dismiss().then(()=>{
          this.toast.create({
            message: 'Something went wrong while checking your family Details. Please contact App Developer!',
            duration: 3000
          }).present();
        })
      }
    );
  }

  addFamilyMember(){
    let data = {
      relations:this.relations,
      user_id:this.user_id,
      parentPage:this
    }
    this.navCtrl.push('AddfamilyDetailPage',data);
  }

  editMember(member){
    let data = {
      relations: this.relations,
      user_id: this.user_id,
      parentPage: this,
      member: member 
    }

    this.navCtrl.push('AddfamilyDetailPage',data);
  }

  deleteMember(member_id){
    let confirm = this.alertCtrl.create({
      message: 'Are you sure?',
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: () => {
            this.httpClient.post<any>(this.laravel.deleteMember(),{id:member_id}).subscribe(
              res => {
                this.loading.dismiss().then(()=>{
                  if(res.success){
                    this.toast.create({
                      message: 'Member deleted',
                      duration: 3000
                    }).present();
                    this.ionViewDidLoad();
                  }else{
                    this.toast.create({
                      message: 'Member Not Found',
                      duration: 3000
                    }).present();
                  }
                });
              },
              err => {
                this.loading.dismiss().then(()=>{
                  this.toast.create({
                    message: 'Sorry Something went wrong while deleting member from database. Please contact app developer!',
                    duration: 3000
                  }).present();
                })
              }
            )
          }
        }
      ]
    });
    confirm.present();
  }

}
