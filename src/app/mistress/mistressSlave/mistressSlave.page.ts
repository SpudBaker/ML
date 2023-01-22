import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Globals from '../../../globals';
import { AuthService } from 'src/app/services/auth';
import { MistressService } from 'src/app/services/mistress';
import { MessagesService } from 'src/app/services/messages';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Timestamp } from "@angular/fire/firestore";

@Component({
  selector: 'app-mistressSlave',
  templateUrl: 'mistressSlave.page.html',
  styleUrls: ['mistressSlave.page.scss'],
})

export class MistressSlavePage {

  public form: FormGroup;
  private messagesSub : Subscription;
  public messages: Globals.Message[];
  public slave: Globals.Slave;
  private slaveSub: Subscription;
  public loading = true;

  constructor(private activatedRoute: ActivatedRoute, private auth: AuthService, private formBuilder: FormBuilder, private messagesService: MessagesService, private mistressService: MistressService, private router: Router) {}

  public formValid(): boolean{
    return this.form?.valid;
  }

  public getMessageColour(message: Globals.Message): string{
    return message.incoming ? 'primary' : 'success'
  }

  public getMessageDisplayTime(message: Globals.Message): string {
    return new Date(message.timeStamp.seconds*1000).toLocaleString();
  }

  public getMessageTitle(message: Globals.Message): string {
    return message.incoming ? 'Slave says ...' : 'Mistress says ...'
  }

  public getToolbarColour(): string {
    if(this.slave){
      return (this.slave?.lastSeenRecent) ? 'success' : 'primary';
     } else {
      return ''
    }
  }

  public getToolbarLoginMessage(): string {
    if(this.slave){
      return (this.slave.lastSeenRecent) ? 'Online now' : 'last seen : ' + (this.slave.lastSeen ? new Date(this.slave.lastSeen.seconds*1000).toLocaleString() : 'Never logged in');
    } else {
      return '';
    }
  }

  public ionViewDidEnter(){
    this.form = this.formBuilder.group({
      message: ['', Validators.required],
    })
    const s = this.activatedRoute.snapshot.params['slave'];
    this.messagesSub = this.messagesService.getSlaveMessages(s).pipe(
      map(data => {
        this.messages = data
        this.loading = false;
       
      }) 
    ).subscribe();
    this.slaveSub = this.mistressService.getSlave(s).pipe(
      map(val => {
        this.slave = val; 
      })
    ).subscribe();
  }

  public ionViewDidLeave(){
    this.loading = true;
    this.slave = undefined;
    if(this.messagesSub && !this.messagesSub.closed){this.messagesSub.unsubscribe()};
    if(this.slaveSub && !this.slaveSub.closed){this.slaveSub.unsubscribe()};
    this.messages = undefined;
  }

  public navHome(): void {
    this.router.navigate(['mistress']);
  }

  public newMessage(){
    const m = new Globals.Message();
    m.incoming = false;
    m.message = this.form.value['message'];
    m.mistress = this.auth.getUserId();
    m.read = true;
    m.slave = this.slave.docID;
    m.timeStamp = Timestamp.fromDate(new Date())
    this.messagesService.newMessage(m).then(res => this.form.reset());
  }

}
