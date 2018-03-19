import { NgModule } from '@angular/core';
import { IonicPageModule, Platform } from 'ionic-angular';
import { TranslateModule } from 'ng2-translate/ng2-translate';
import { TranslateService } from 'ng2-translate';
import { I18nPage } from './i18n';
import { Storage } from '@ionic/storage';
import { Globalization } from '@ionic-native/globalization';
import { defaultLanguage, availableLanguages, sysOptions } from './i18n.constants';

@NgModule({
  declarations: [
    I18nPage,
  ],
  imports: [
    IonicPageModule.forChild(I18nPage),
    TranslateModule
  ],
})
export class I18nPageModule {
  constructor(platform: Platform, 
    translate: TranslateService,
    private globalization: Globalization,
    storage: Storage
  ){
    platform.ready().then(()=>{
      translate.setDefaultLang(defaultLanguage);
      if ((<any>window).cordova) {
        this.globalization.getPreferredLanguage().then(result=>{
          let language = this.getSuitableLanguage(result.value);
          translate.use(language);
          sysOptions.systemLanguage = language;
        });
      }else{
        let browserLangauge = translate.getBrowserLang() || defaultLanguage;
        let language = this.getSuitableLanguage(browserLangauge);
        translate.use(language);
        sysOptions.systemLanguage = language;
      }
      storage.get('Surakshadal_default_lang').then((val)=>{
        translate.use(val);
      })
    });
  }

  getSuitableLanguage(language) {
		language = language.substring(0, 2).toLowerCase();
		return availableLanguages.some(x => x.code == language) ? language : defaultLanguage;
	}
}
