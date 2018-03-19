import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddfamilyDetailPage } from './addfamily-detail';

@NgModule({
  declarations: [
    AddfamilyDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(AddfamilyDetailPage),
  ],
})
export class AddfamilyDetailPageModule {}
