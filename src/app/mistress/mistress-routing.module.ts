import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MistressHomePage } from './home/home.page';
import { MistressSlavePage } from './mistressSlave/mistressSlave.page';

const routes: Routes = [
  { path: '', component: MistressHomePage},
  { path: 'slave', component: MistressSlavePage}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MistressRoutingModule {}
