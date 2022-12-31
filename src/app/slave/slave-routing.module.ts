import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SlaveHomePage } from './home/home.page';

const routes: Routes = [
  {
    path: '',
    component: SlaveHomePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SlaveRoutingModule {}
