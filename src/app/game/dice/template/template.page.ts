import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { GamesService } from '../../../services/games';
import * as Globals from '../../../../globals';
import { map } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { EditTemplateComponent } from '../modals/editTemplate/editTemplate.component';
import { NewTemplateComponent } from '../modals/newTemplate/newTemplate.component';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-dice-template',
  templateUrl: 'template.page.html',
  styleUrls: ['template.page.scss'],
})

export class DiceTemplatePage {

  public games: Globals.DiceGameTemplate[]
  private colDataSub: Subscription;
  private loading = false;

  constructor(public authService: AuthService, private gamesService: GamesService, 
    private modalController: ModalController, private router: Router){}

  public ionViewDidEnter(): void {
    this.loading = true;
    this.colDataSub = this.getData().pipe(
      map(() => this.loading = false)
    ).subscribe();
  }

  public ionViewDidLeave(){
    if(this.colDataSub && (!this.colDataSub.closed)) { this.colDataSub.unsubscribe()}
  }

  public getData(): Observable<void>{
     return this.gamesService.getGameTemplates().pipe(
      map(colData => {
        this.games = new Array<Globals.DiceGameTemplate>();
        colData.forEach(t => { 
          this.games.push(t as Globals.DiceGameTemplate)
        });
      })
    );
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

  public navHome(): void {
    this.router.navigate(['mistress']);
  }

  public async newGame(){
    const modal = await this.modalController.create({ 
      component: NewTemplateComponent,
      backdropDismiss: false
      }
    );
    modal.present();
  }

}

