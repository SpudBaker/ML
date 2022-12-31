import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { MistressService } from '../../services/mistress';
import { DocumentData } from '@angular/fire/firestore';
import { defer, Observable, Subscription } from 'rxjs';
import { delay, filter, first, map, repeatWhen, switchMap } from 'rxjs/operators';
import * as Globals from '../../../globals';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class MistressHomePage {

  private refreshTimer$: Observable<any>;
  private refreshTimerSubscription: Subscription;
  public slaveSubs = new Array<Observable<Globals.Slave>>();

  constructor(public auth: AuthService, private mistressService: MistressService) {}

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

  private getSlavesAndDocSnapshots(): Observable<DocumentData[]>{
    return this.mistressService.getSlaves().pipe(
      map(data => {
        console.log('mistress home page - data', data);
        this.slaveSubs = new Array<Observable<Globals.Slave>>();
        data.forEach(slave => {
          console.log('mistress homepage', slave);
          this.slaveSubs.push(this.mistressService.getSlaveSnapshots(slave.docID))
        });
        return data;
      })
    )
  }

  public ionViewDidEnter(): void {
    this.auth.getUserStatusVerified().pipe(
      filter(userVerified => userVerified == true),
      map(() => this.auth.getUserId()),
      filter(id => id != null),
    ).subscribe(() => {
      this.startRefreshTimer();
    }
    );
  }

  public ionViewDidLeave(): void {
    if(!this.refreshTimerSubscription.closed){this.refreshTimerSubscription.unsubscribe()}
  }

  public navSlave(){}

  private startRefreshTimer(): void{
    this.refreshTimer$ = defer(() => this.getSlavesAndDocSnapshots())
        .pipe(
          first(),
          repeatWhen(notifications => notifications.pipe(delay(600000)))
        );
    this.refreshTimerSubscription = this.refreshTimer$.subscribe();
}

}

