import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DicePage } from './dice/dice.page';

import { GameRoutingModule } from './game-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GameRoutingModule
  ],
  declarations: [DicePage]
})
export class GameModule {}
