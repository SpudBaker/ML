import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DicePage } from './dice/game/dice.page';
import { DiceTemplatePage } from './dice/template/template.page';
import { EditTemplateComponent } from './dice/modals/editTemplate/editTemplate.component';
import { NewTemplateComponent } from './dice/modals/newTemplate/newTemplate.component';
import { GameRoutingModule } from './game-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    GameRoutingModule
  ],
  declarations: [DicePage, DiceTemplatePage, EditTemplateComponent, NewTemplateComponent]
})
export class GameModule {}
