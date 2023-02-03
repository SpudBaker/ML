import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';
import * as Globals from '../../../globals';
import { AuthService } from 'src/app/services/auth';
import { GamesService } from 'src/app/services/games';
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

  public formGame: FormGroup;
  public formMessage: FormGroup;
  public diceGameTemplates: Globals.DiceGameTemplate[];
  private getOpenGamesSubscription: Subscription;
  private messagesSub : Subscription;
  public messages: Globals.Message[];
  public gameInProgress: Globals.DiceGame;
  public gameInProgressLoaded = false;
  public slave: Globals.Slave;
  private slaveSub: Subscription;
  public loading = true;

  constructor(private activatedRoute: ActivatedRoute, private auth: AuthService, private formBuilder: FormBuilder, 
              private gamesService: GamesService, private messagesService: MessagesService, private mistressService: MistressService, private router: Router) {}

  public formGameValid(): boolean{
    return this.formGame?.valid;
  }

  public formMessageValid(): boolean{
    return this.formMessage?.valid;
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
    this.gameInProgress = undefined;
    if(this.getOpenGamesSubscription && !this.getOpenGamesSubscription.closed){this.getOpenGamesSubscription.unsubscribe()};
    this.getOpenGamesSubscription = undefined;
    this.formMessage = this.formBuilder.group({
      message: ['', Validators.required],
    });
    this.formGame = this.formBuilder.group({
      description: ['', Validators.required],
      tplate: ['', Validators.required],
    });
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
        return val
      }),
      map(slave => {
        if(this.getOpenGamesSubscription == null) {
          this.getOpenGamesSubscription = this.gamesService.getOpenGames(slave.docID).pipe(
            map(res => {
              this.gameInProgressLoaded = true;
              if(res.length > 0){
                this.gameInProgress = res[0] as Globals.DiceGame;
              } else {
                this.gameInProgress = undefined
              }
          })).subscribe();
    }})
    ).subscribe();
    this.gamesService.getGameTemplates().pipe(
      map(data => {
        filter(val => val != null),
        first(),
        this.diceGameTemplates = data as Globals.DiceGameTemplate[];
        if(data.length > 0){
          this.formGame.controls['tplate'].setValue(data[0] as Globals.DiceGameTemplate);
        }
      })
    ).subscribe();
  }

  public ionViewDidLeave(){
    this.loading = true;
    if(this.messagesSub && !this.messagesSub.closed){this.messagesSub.unsubscribe()};
    if(this.slaveSub && !this.slaveSub.closed){this.slaveSub.unsubscribe()};
    if(this.getOpenGamesSubscription && !this.getOpenGamesSubscription.closed){this.getOpenGamesSubscription.unsubscribe()};
    this.messages = undefined;
    this.messagesService.markMessagesAsRead(this.slave.docID, this.auth.getUserId());
    this.slave = undefined;
    this.diceGameTemplates = null;
  }

  public navHome(): void {
    this.router.navigate(['mistress']);
  }

  public newGame(){
    const t = this.formGame.controls['tplate'].value as Globals.DiceGameTemplate;
    const g = new Globals.DiceGame(undefined, t.docID, this.auth.getUserId(), this.slave.docID, Globals.GameStatus.PendingSlave,
    this.formGame.controls['description'].value, undefined, undefined, false);
    this.gamesService.newGame(g);
  }

  public newMessage(){
    const m = new Globals.Message();
    m.incoming = false;
    m.message = this.formMessage.value['message'];
    m.mistress = this.auth.getUserId();
    m.read = true;
    m.slave = this.slave.docID;
    m.timeStamp = Timestamp.fromDate(new Date())
    this.messagesService.newMessage(m).then(res => this.formMessage.reset());
  }

}

