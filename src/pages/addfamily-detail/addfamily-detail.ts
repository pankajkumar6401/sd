import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, ViewController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { LaravelProvider } from './../../providers/laravel/laravel';
import { FormBuilder, Validators } from '@angular/forms';

/**
 * Generated class for the AddfamilyDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addfamily-detail',
  templateUrl: 'addfamily-detail.html',
})
export class AddfamilyDetailPage {
  relations=[];
  user_id:any;
  name=[];
  userdetails=[];
  familyDetailForm:any;
  memberDetail: any = {
    id:'',
    name: '',
    relation: '',
    relation_id: '',
    contact_no: ''
  };
  loading:any;
  member: boolean = false;
  familymobile: boolean = false;
  familydetail: boolean = false;
  submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public toast: ToastController,
    private formBuilder: FormBuilder,
    public laravel: LaravelProvider,
    public loadingCtrl: LoadingController,
    public httpClient: HttpClient
  ) {
    this.relations = navParams.get('relations');
    this.user_id = navParams.get('user_id');
    if(this.navParams.get('member')){
      this.memberDetail = this.navParams.get('member')
    }
    this.familyDetailForm = this.formBuilder.group({
      member:[this.memberDetail.name, Validators.required],
      familymobile: [this.memberDetail.contact_no],
      relation:[this.memberDetail.relation_id,Validators.required],
    });
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddfamilyDetailPage');
  }

  setFormData(){
    this.familyDetailForm.controls.member.setValue();
    this.familyDetailForm.controls.relation.setValue();
    this.familyDetailForm.controls.familymobile.setValue();
  }

  elementChanged(input){
    let field = input.ngControl.name;
    this[field + "Changed"] = true;
  }

  save(){
    this.submitAttempt = true;
    if (this.familyDetailForm.valid){
      let memberData = {
        'name': this.familyDetailForm.controls.member.value,
        'contact_no': this.familyDetailForm.controls.familymobile.value,
        'relation': this.familyDetailForm.controls.relation.value,
        'user_id': this.user_id
      }
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      this.loading.present();
      let url:any;

      if(this.navParams.get('member')){
        url = this.laravel.getUpdateFamilyDetailApi() + '/' + this.memberDetail.id;
      }else{
        url = this.laravel.getAddFamilyDetail();
      }

      this.httpClient.post<any>(url,memberData).subscribe(
        res => {
          this.loading.dismiss().then(()=>{
            
              this.navCtrl.pop().then(()=>{
                this.navParams.get('parentPage').ionViewDidLoad()
              });
            
          });    
        },
        err => {
          this.loading.dismiss();
          let errorMsg = 'Something went wrong. Please contact your app developer';
          this.toast.create({
            message: (err.hasOwnProperty('message')) ? err.message:errorMsg ,
            duration:3000
          }).present();
        }
      )
    }
  }

}
