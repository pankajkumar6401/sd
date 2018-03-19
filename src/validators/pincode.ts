import {FormControl} from '@angular/forms';

export class PincodeValidator {

    static isValid(control: FormControl){
    var re = /^([\d]{6})+$/.test(control.value);
      

      if (re){
        return null;
      }

      return {"invalidNumber": true};
    }

}