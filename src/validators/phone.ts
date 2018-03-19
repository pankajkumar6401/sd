import {FormControl} from '@angular/forms';

export class PhoneValidator {

    static isValid(control: FormControl){
    var re = /^([\d]{11})+$/.test(control.value);
      

      if (re){
        return null;
      }

      return {"invalidNumber": true};
    }

}