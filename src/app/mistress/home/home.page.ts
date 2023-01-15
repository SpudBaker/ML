import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { MistressService } from '../../services/mistress';
import { MessagesService } from '../../services/messages';
import { Observable, Subscription } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';
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

  constructor(public auth: AuthService, private messagesService: MessagesService, private mistressService: MistressService, private router: Router) {}

  getButtonColor(slave: Globals.Slave): string{
    
    return (slave?.lastSeenRecent) ? 'success' : 'medium';
  }

  getLastSeenDisplayTime(slave: Globals.Slave): string {
    if(slave.lastSeen == null){
      return 'never logged in'} 
    else {
      return (slave?.lastSeenRecent) ? '' : new Date(slave.lastSeen.seconds*1000).toLocaleString();
    }
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

  private getSlaves(): Observable<void>{
    return this.mistressService.getSlaves().pipe(
      map(dataArr => {
        const slaveArr = new Array<Globals.Slave>();
        dataArr.forEach(item => {
          // update lastSeenRecent
          slaveArr.push(Globals.cloneSlave(item));
        })
        this.slaves = slaveArr;
      })
    )
  }

  public ionViewDidEnter(): void {
    this.loading = true;
    this.authUserVerifiedSubscription = this.auth.getUserStatusVerified().pipe(
      filter(userVerified => userVerified == true),
      map(() => this.auth.getUserId()),
      filter(id => id != null),
      switchMap(() => this.getSlaves()),
      switchMap(() => this.getMessages()),
      map(()=> this.loading = false)
    ).subscribe();
  }

  public ionViewDidLeave(): void {
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

