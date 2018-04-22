import { LaravelProvider } from './../providers/laravel/laravel';
import { Storage } from '@ionic/storage';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from './../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any;
  loading:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private storage: Storage,
    private laravel: LaravelProvider,
    public loadingCtrl: LoadingController,
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.loading = this.loadingCtrl.create({
        content: 'Authenticating please wait...'
      });
      this.loading.present();
      this.storage.get('surakshadal_userTokenInfo').then((val) => {
        if(val){
          this.loading.dismiss();
          this.laravel.setToken(val);
          this.nav.setRoot(TabsPage);
        }else{
          this.loading.dismiss();
          this.nav.setRoot('LoginPage');
        }
      });
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
