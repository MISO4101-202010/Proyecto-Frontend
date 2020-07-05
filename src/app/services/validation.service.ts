import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable()
export class ValidationService {

  public hasError = (controlName: string, errorName: string, group: FormGroup) => {
    return group.controls[controlName].hasError(errorName);
  }
}
