import { AbstractControl, ValidationErrors, Validators } from "@angular/forms";

const passwordPattern = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/);

export const customValidator = (control:AbstractControl): ValidationErrors | null =>{
    const value = control.value;
    if(!passwordPattern.test(value)){
        return {customValidator :true}
    }
    return null;
}