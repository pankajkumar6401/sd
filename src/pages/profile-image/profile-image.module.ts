import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileImagePage } from './profile-image';

@NgModule({
  declarations: [
    ProfileImagePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileImagePage),
  ],
})
export class ProfileImagePageModule {}
