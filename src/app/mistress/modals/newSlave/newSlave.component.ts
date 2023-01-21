import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth';
import { from, of } from 'rxjs';
import { catchError, first, switchMap } from 'rxjs/operators';

@Component({
  selector: 'new-slave',
  templateUrl: 'newSlave.component.html',
  styleUrls: ['newSlave.component.scss'],
})
export class NewSlaveComponent {

  public form: FormGroup
  public loginErrMessage: string;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private modalController: ModalController) {}

  ionViewDidEnter(){
    this.form = this.formBuilder.group({
      displayName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  public formValid(): boolean{
    return this.form?.valid;
  }

  public cancel(){
    this.modalController.dismiss();
  }

  public create(){
    from(this.authService.createUserWithEmailAndPassword(this.form.value['email'],this.form.value['password'],this.form.value['displayName']))
    .pipe(
      first(),
      switchMap(()=> this.modalController.dismiss()),
      catchError(err => {
        switch (err.code){
          case ('auth/invalid-email'):
            this.loginErrMessage = 'Please enter the correct email format';
            break;
          case ('auth/email-already-in-use'):
            this.loginErrMessage = 'Email address is alreday registered';
            break;
          case ('auth/weak-password'):
            this.loginErrMessage = 'Please create a stronger password when registering';
            break;
          default:
            this.loginErrMessage = err.code;
        };
        return of(void 0);
      })
    ).subscribe();
  }

}