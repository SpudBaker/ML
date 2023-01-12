import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { GamesService } from '../../../services/games';
import * as Globals from '../../../../globals';
import { map } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { EditTemplateComponent } from '../modals/editTemplate/editTemplate.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dice-template',
  templateUrl: 'template.page.html',
  styleUrls: ['template.page.scss'],
})

export class DiceTemplatePage {

  public games: Globals.DiceGameTemplate[]
  private colDataSub: Subscription;

  constructor(public authService: AuthService, private gamesService: GamesService, private modalController: ModalController){}

  public ionViewDidEnter(): void {
    this.getData();
  }

  public ionViewDidLeave(){
    if(this.colDataSub && (!this.colDataSub.closed)) { this.colDataSub.unsubscribe()}
  }

  getData(){
    this.colDataSub = this.gamesService.getGameTemplates().pipe(
      map(colData => {
        this.games = new Array<Globals.DiceGameTemplate>();
        colData.forEach(t => { 
          this.games.push(t as Globals.DiceGameTemplate)
        });
      })
    ).subscribe();
  }

  public async editGame(diceTemplate: Globals.DiceGameTemplate){
    const modal = await this.modalController.create({ 
      component: EditTemplateComponent,
      componentProps: {diceTemplate},
      backdropDismiss: false
      }
    );
    modal.present();
  }

}

