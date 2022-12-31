import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MistressHomePage } from './home/home.page';

import { MistressRoutingModule } from './mistress-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MistressRoutingModule
  ],
  declarations: [MistressHomePage]
})
export class MistressModule {}
