import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as Globals from '../../../globals';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GamesService } from 'src/app/services/games';
import { MessagesService } from '../../services/messages';
import { Timestamp } from "@angular/fire/firestore";



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class SlaveHomePage {

  private authUserVerifiedSubscription: Subscription;
  public formMessage: FormGroup;
  public game: Globals.DiceGame;
  public gameLoading: boolean;
  private gameSub: Subscription;
  public messagesLoading: boolean;
  private messagesSub: Subscription;
  public messages: Globals.Message[];

  constructor(public auth: AuthService, private formBuilder: FormBuilder, private gameService: GamesService, private messagesService: MessagesService, private router: Router) {}

  public formMessageValid(): boolean{
    return this.formMessage?.valid;
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
    this.gameLoading = true;
    this.messagesLoading = true;
    this.authUserVerifiedSubscription = this.auth.getUserStatusVerified().pipe(
      filter(userVerified => userVerified == true),
      map(() => this.auth.getUserId()),
      filter(id => id != null),
      map(id=> {
        this.formMessage = this.formBuilder.group({
          message: ['', Validators.required],
        })
        this.messagesSub = this.messagesService.getSlaveMessages(id).pipe(
          map(data => {
            this.messages = data
            this.messagesLoading = false;
          }) 
        ).subscribe();
        this.gameSub = this.gameService.getOpenGames(id).pipe(
          map(arrVals => {
            this.game = arrVals[0] as Globals.DiceGame
            this.gameLoading = false
          }) 
        ).subscribe();
      }),
    ).subscribe() 
  }

  public ionViewDidLeave(){
    this.game = undefined;
    this.messagesLoading = true;
    if(this.gameSub && !this.gameSub.closed){this.gameSub.unsubscribe()};
    if(this.messagesSub && !this.messagesSub.closed){this.messagesSub.unsubscribe()};
    if(this.authUserVerifiedSubscription && !this.authUserVerifiedSubscription.closed){this.authUserVerifiedSubscription.unsubscribe()};
    this.messages = undefined;
  }

  public newMessage(){
    const m = new Globals.Message();
    m.incoming = true;
    m.message = this.formMessage.value['message'];
    m.mistress = this.auth.getUserMistress();
    m.read = false;
    m.slave = this.auth.getUserId();
    m.timeStamp = Timestamp.fromDate(new Date())
    this.messagesService.newMessage(m).then(() => this.formMessage.reset());
  }

  public playGame(){
    this.router.navigate(['game']);
  }

}

