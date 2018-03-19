import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { availableLanguages, sysOptions } from './i18n.constants';
import { TranslateService } from 'ng2-translate';

/**
 * Generated class for the I18nPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-i18n',
  templateUrl: 'i18n.html',
})
export class I18nPage {

  languages:any = availableLanguages;
  selectedLanguage:any = sysOptions.systemLanguage;
  
  private translate: TranslateService;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    translate: TranslateService,
    public storage: Storage
  ) {
    this.translate = translate;
  }

  applyLanguage() {
    this.storage.set('Surakshadal_default_lang',this.selectedLanguage);
		this.translate.use(this.selectedLanguage);
	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad I18nPage');
  }

}
