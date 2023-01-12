import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DicePage } from './dice/game/dice.page';
import { DiceTemplatePage } from './dice/template/template.page';

const routes: Routes = [
  {
    path: '',
    component: DicePage,
  },
  {
    path: 'dice',
    component: DicePage,
  },
  {
    path: 'dice-template',
    component: DiceTemplatePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule {}
