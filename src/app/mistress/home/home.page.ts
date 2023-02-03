import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../../services/auth';
import { MistressService } from '../../services/mistress';
import { MessagesService } from '../../services/messages';
import { Observable, Subscription } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as Globals from '../../../globals';
import { NewSlaveComponent } from '../modals/newSlave/newSlave.component';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class MistressHomePage {

  private authUserVerifiedSubscription: Subscription;
  public messagesLoading = true;
  public slavesLoading = true;
  public slaves = new Array<Globals.Slave>();
  private slaveSubscription: Subscription;
  public messages = new Array<Globals.Message>();
  private messageSubscription: Subscription;

  constructor(public auth: AuthService, private messagesService: MessagesService, private mistressService: MistressService, 
    private modalController: ModalController, private router: Router) {}

  public loading(): boolean {
    return this.messagesLoading && this.slavesLoading;
  }

  getButtonColor(slave: Globals.Slave): string{
    return (slave?.lastSeenRecent) ? 'success' : 'medium';
  }

  getSlaveLastSeenDisplayTime(slave: Globals.Slave): string {
    if(slave.lastSeen == null){
      return 'Never logged in'} 
    else {
      return (slave?.lastSeenRecent) ? 'Logged in and active' : new Date(slave.lastSeen.seconds*1000).toLocaleString();
    }
  }

  getMessageDisplayTime(message: Globals.Message): string {
    return new Date(message.timeStamp.seconds*1000).toLocaleString();
  }

  private getMessages():Observable<void>{
    this.messages = new Array();
    return this.messagesService.getUnreadMessagesForMistress().pipe(
      map(data => {
        this.messages = new Array<Globals.Message>();
        data.forEach(item => {
          this.messages.push(item);
        })
      })
    )
  }

  public getSlaveName(slaveID: string): string {
    const s = this.slaves.find(item => item.docID == slaveID);
    return s?.displayName;
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
    this.authUserVerifiedSubscription = this.auth.getUserStatusVerified().pipe(
      filter(userVerified => userVerified == true),
      map(() => this.auth.getUserId()),
      filter(id => id != null),
      map(()=> {
        this.slaveSubscription = this.getSlaves().pipe(
          map(() => {
            this.slavesLoading = false;
            if(!this.messageSubscription || this.messageSubscription.closed) {
              this.messageSubscription = this.getMessages().pipe(
                map(() => this.messagesLoading = false)
              ).subscribe();
            }
          })
        ).subscribe();
        
      })
    ).subscribe();
  }

  public ionViewDidLeave(): void {
    this.slaves = new Array<Globals.Slave>();
    this.messages = new Array<Globals.Message>();
    this.slavesLoading = true;
    this.messagesLoading = true;
    if(!this.authUserVerifiedSubscription.closed){this.authUserVerifiedSubscription.unsubscribe()};
    if(!this.slaveSubscription.closed){this.slaveSubscription.unsubscribe()};
    if(!this.messageSubscription.closed){this.messageSubscription.unsubscribe()};
  }

  public async newSlave(){
    const modal = await this.modalController.create({ 
      component: NewSlaveComponent,
      backdropDismiss: false,
      }
    );
    modal.present();
  }

  public navMessage(slave: Globals.Slave){}

  public navSlave(slave: Globals.Slave){
    return this.router.navigate(['mistress/slave/' + slave.docID]);
  }

  public navDiceTemplate(){
    return this.router.navigate(['game/dice-template']);
  }

}

