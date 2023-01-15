import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { MistressService } from '../../services/mistress';
import { MessagesService } from '../../services/messages';
import { DocumentData } from '@angular/fire/firestore';
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
  public slaveSubs = new Array<Observable<Globals.Slave>>();
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

  private getSlavesAndDocSnapshots(): Observable<DocumentData[]>{
    return this.mistressService.getSlaves().pipe(
      first(),
      map(data => {
        this.slaveSubs = new Array<Observable<Globals.Slave>>();
        data.forEach(slave => {
          this.slaveSubs.push(this.mistressService.getSlaveSnapshots(slave.docID))
        });
        return data;
      })
    )
  }

  public ionViewDidEnter(): void {
    this.loading = true;
    this.authUserVerifiedSubscription = this.auth.getUserStatusVerified().pipe(
      filter(userVerified => userVerified == true),
      map(() => this.auth.getUserId()),
      filter(id => id != null),
      switchMap(() => this.getSlavesAndDocSnapshots()),
      switchMap(() => this.getMessages()),
      map(()=> this.loading = false)
    ).subscribe();
  }

  public ionViewDidLeave(): void {
    if(!this.authUserVerifiedSubscription.closed){this.authUserVerifiedSubscription.unsubscribe()}
    this.slaveSubs = new Array<Observable<Globals.Slave>>();
  }

  public navSlave(){}

  public navDice(){
    return this.router.navigate(['game/dice']);
  }

  public navDiceTemplate(){
    return this.router.navigate(['game/dice-template']);
  }

}

