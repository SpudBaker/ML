import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { MistressService } from '../../services/mistress';
import { MessagesService } from '../../services/messages';
import { Observable, Subscription } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as Globals from '../../../globals';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class MistressHomePage {

  private authUserVerifiedSubscription: Subscription;
  public loading = false;
  public slaves = new Array<Globals.Slave>();
  public messages = new Array<Globals.Message>();

  constructor(public auth: AuthService, private messagesService: MessagesService, private mistressService: MistressService, 
    private router: Router) {}

  getButtonColor(slave: Globals.Slave): string{
    
    return (slave?.lastSeenRecent) ? 'success' : 'medium';
  }

  getSlaveLastSeenDisplayTime(slave: Globals.Slave): string {
    if(slave.lastSeen == null){
      return 'never logged in'} 
    else {
      return (slave?.lastSeenRecent) ? 'Logged in and active' : new Date(slave.lastSeen.seconds*1000).toLocaleString();
    }
  }

  getMessageDisplayTime(message: Globals.Message): string {
    return new Date(message.timeStamp.seconds*1000).toLocaleString();
  }

  private getMessages():Observable<void>{
    this.messages = new Array();
    return this.messagesService.getMessages().pipe(
      map(data => {
        console.log('mistress home - message', data);
        this.messages = new Array<Globals.Message>();
        data.forEach(item => {
          this.messages.push(item);
        })
      })
    )
  }

  public getSlaveName(slaveID: string): string {
    const s = this.slaves.find(item => item.docID == slaveID);
    return s.displayName;
  }

  private getSlaves(): Observable<void>{
    return this.mistressService.getSlaves().pipe(
      map(dataArr => {
        if(this.slaves.length != dataArr.length){
          this.slaves = dataArr;
        }  else {
          dataArr.forEach(item1 => {
            let changed = false;
            this.slaves.forEach(item2 => {
              if((item1.docID == item2.docID) && (
                (item1.lastSeenRecent != item2.lastSeenRecent) ||
                (item1.displayName != item2.displayName) || 
                (item1.email != item2.email) ||
                (item1.mistress != item2.mistress) ||
                (item1.role != item2.role))){
                  changed = true;
                }
            })
            if(changed){this.slaves = dataArr;}
          })
        }
      })
    )
  }

  public ionViewDidEnter(): void {
    this.loading = true;
    this.authUserVerifiedSubscription = this.auth.getUserStatusVerified().pipe(
      filter(userVerified => userVerified == true),
      map(() => this.auth.getUserId()),
      filter(id => id != null),
      switchMap(() => this.getMessages()),
      switchMap(() => this.getSlaves()),
      map(()=> this.loading = false)
    ).subscribe();
  }

  public ionViewDidLeave(): void {
    this.slaves = new Array<Globals.Slave>();
    this.messages = new Array<Globals.Message>();
    this.loading = true;
    if(!this.authUserVerifiedSubscription.closed){this.authUserVerifiedSubscription.unsubscribe()}
  }

  public navSlave(){}

  public navDice(){
    return this.router.navigate(['game/dice']);
  }

  public navDiceTemplate(){
    return this.router.navigate(['game/dice-template']);
  }

}

