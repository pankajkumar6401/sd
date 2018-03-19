import {FormControl} from '@angular/forms';

export class NumberValidator {

    static isValid(control: FormControl){
    var re = /^([789][0-9]{9})+$/.test(control.value);
      

      if (re){
        return null;
      }

      return {"invalidNumber": true};
    }

}