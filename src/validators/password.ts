import {AbstractControl} from '@angular/forms';

export class PasswordValidator {

    static MatchPassword(AC: AbstractControl){
        console.log('checking here');
        let password = AC.get('password').value;
        let confirmPassword = AC.get('confirmPassword').value;
        if(password != confirmPassword){
            AC.get('confirmPassword').setErrors({MatchPassword: true});
        }else{
            return null;
        }
    }

}
