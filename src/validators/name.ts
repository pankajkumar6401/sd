import {FormControl} from '@angular/forms';

export class NameValidator {

    static isValid(control: FormControl){
      var re = /^(\D)+$/.test(control.value);
      

      if (re){
        return null;
      }

      return {"invalidName": true};
    }

}