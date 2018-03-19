import {FormControl} from '@angular/forms';

export class AadharValidator {

    static isValid(control: FormControl){
    var re = /^([\d]{12})+$/.test(control.value);
      

      if (re){
        return null;
      }

      return {"invalidNumber": true};
    }

}