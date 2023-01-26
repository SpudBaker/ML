import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { MistressService } from '../../services/mistress';
import { Observable, Subscription, timer } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';
import * as Globals from '../../../globals';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessagesService } from '../../services/messages';
import { Timestamp } from "@angular/fire/firestore";



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class SlaveHomePage {

  private authUserVerifiedSubscription: Subscription;
  public form: FormGroup;
  public loading = true;
  private messagesSub: Subscription;
  public messages: Globals.Message[];

  constructor(public auth: AuthService, private formBuilder: FormBuilder, private messagesService: MessagesService, private mistressService: MistressService) {}

  public formValid(): boolean{
    return this.form?.valid;
  }

  public getMessageColour(message: Globals.Message): string{
    return message.incoming ? 'success' : 'primary'
  }
  
  public getMessageDisplayTime(message: Globals.Message): string {
    return new Date(message.timeStamp.seconds*1000).toLocaleString();
  }

  public getMessageTitle(message: Globals.Message): string {
    return message.incoming ? 'Slave says ...' : 'Mistress says ...'
  }

  public ionViewDidEnter(){
    this.authUserVerifiedSubscription = this.auth.getUserStatusVerified().pipe(
      filter(userVerified => userVerified == true),
      map(() => this.auth.getUserId()),
      filter(id => id != null),
      map(id=> {
        this.form = this.formBuilder.group({
          message: ['', Validators.required],
        })
        this.messagesSub = this.messagesService.getSlaveMessages(id).pipe(
          map(data => {
            this.messages = data
            this.loading = false;
          }) 
        ).subscribe();
      })
    ).subscribe() 
  }

  public ionViewDidLeave(){
    this.loading = true;
    if(this.messagesSub && !this.messagesSub.closed){this.messagesSub.unsubscribe()};
    if(this.authUserVerifiedSubscription && !this.authUserVerifiedSubscription.closed){this.authUserVerifiedSubscription.unsubscribe()};
    this.messages = undefined;
  }

  public newMessage(){
    const m = new Globals.Message();
    m.incoming = true;
    m.message = this.form.value['message'];
    m.mistress = this.auth.getUserMistress();
    m.read = false;
    m.slave = this.auth.getUserId();
    m.timeStamp = Timestamp.fromDate(new Date())
    this.messagesService.newMessage(m).then(() => this.form.reset());
  }

}

