import { Component } from '@angular/core';
import { from, of } from 'rxjs';
import { AuthService } from '../services/auth';
import { catchError, first, map} from 'rxjs/operators';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  public loginErrMessage: string;
  public inputEmail: string;
  public inputPassword: string;
  public signingIn: boolean;

  constructor(public authService: AuthService) {}

  ionViewDidEnter(){
    this.signingIn = false;
  }

  public sendPasswordRestEmail(){
    this.loginErrMessage = null;
    if (!this.inputEmail){
      this.loginErrMessage = 'Enter an email to reset your password';
      return;
    }
    this.authService.sendPasswordRestEmail(this.inputEmail)
    .pipe(
      first(),
      map(() => this.loginErrMessage = 'Check your inbox for an email with a password reset link'),
      catchError(err => {
        switch (err.code){
          case ('auth/invalid-email'):
            this.loginErrMessage = 'Enter the correct email format';
            break;
          case ('auth/user-not-found'):
            this.loginErrMessage = 'Email not recognised';
            break;
          default:
            this.loginErrMessage = err.code;
        };
        return of(void 0);
      })
    ).subscribe();
  }

  public signIn(){
    this.signingIn = true;
    this.loginErrMessage = null;
    if ((!this.inputEmail) || (!this.inputPassword)){
      this.loginErrMessage = 'Enter both email and password';
      return;
    }
    from(this.authService.signIn(this.inputEmail, this.inputPassword))
    .pipe(
      first(),
      catchError(err => {
        this.signingIn = false;
        switch (err.code){
          case ('auth/invalid-email'):
            this.loginErrMessage = 'Enter the correct email format';
            break;
          case('auth/user-not-found'):
            this.loginErrMessage = 'email not recognised';
            break;
          case ('auth/wrong-password'):
            this.loginErrMessage = 'Wrong password - try again or reset';
            break;
          case ('auth/too-many-requests'):
            this.loginErrMessage = 'Too many attempts and account is locked. Reset password.';
            break;
          default:
            this.loginErrMessage = err.code;
        }
        return of(void 0);
      })
    ).subscribe();
  }

}
