import { Injectable } from '@angular/core';
import {BaseService} from "./base-service";
import {IToAddress} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class PasswordRecoveryService extends BaseService<IToAddress>{
  protected override source: string = 'password-recovery';
  sendEmail(toAddress: IToAddress){
    console.log("enter service", toAddress.toAddress)
    this.add(toAddress).subscribe({
      next: (response: any) => {
        console.error('success', response);
      },
      error: (err: any) => {
        console.error('error', err);
      }
    });
  }
}
