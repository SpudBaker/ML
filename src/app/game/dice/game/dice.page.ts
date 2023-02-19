import { Component, ElementRef, ViewChild } from '@angular/core';
import { AlertController, AlertOptions } from '@ionic/angular';
import { Router } from '@angular/router';
import rollADie from 'roll-a-die';
import { GamesService } from 'src/app/services/games';
import { AuthService } from 'src/app/services/auth';
import { from, Observable } from 'rxjs';
import { delay, first, map, switchMap } from 'rxjs/operators';
import * as Globals from '../../../../globals';
import { EMPTY } from 'rxjs';
import { runTransaction } from '@firebase/firestore';

@Component({
  selector: 'app-dice',
  templateUrl: 'dice.page.html',
  styleUrls: ['dice.page.scss'],
})



export class DicePage {

  @ViewChild('divvy') div:ElementRef;
  public game: Globals.DiceGame;
  public gameTemplate: Globals.DiceGameTemplate;

  constructor(private alertController: AlertController, private authService: AuthService, private gamesService: GamesService, private router: Router){}

  public navHome(): void {
    this.router.navigate(['slave']);
  }

  ionViewDidEnter(){
    this.gamesService.getOpenGames(this.authService.getUserId()).pipe(
      first(),
      switchMap(val => {
        console.log('ion view did enter()', val);
        this.game = val[0] as Globals.DiceGame;
        if (val.length > 0){
          return this.gamesService.getGameTemplate(this.game.diceGameTemplate);
        } else {
          return EMPTY;
        }
      }),
      map(data => this.gameTemplate = data)
    ).subscribe();
  }

  public rollDice(){
    const dice = this.div.nativeElement;
    rollADie({element: dice, numberOfDice: 2, callback: this.cback.bind(this)});
  }

  private cback(thing: any){
    this.game.result = thing[0] + thing[1];
    this.game.resultTask = this.gameTemplate['task'+this.game.result]
    const alertOpts: AlertOptions = {
      header: 'You rolled ' + this.game.result,
      subHeader: 'Mistress instructs .....',
      message: this.game.resultTask, 
      cssClass: 'alertC',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.finish();
          }
        }
      ]
    }
    from(this.alertController.create(alertOpts)).pipe(
      delay(1000),
      switchMap(a => a.present()),
      
    ).subscribe();
  }
    
  private finish(){
    this.gamesService.updateGame(this.game).then(()=> {
      this.navHome();
    })
  }
  

}

