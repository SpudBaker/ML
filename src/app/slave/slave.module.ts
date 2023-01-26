import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SlaveHomePage } from './home/home.page';
import { SlaveRoutingModule } from './slave-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SlaveRoutingModule
  ],
  declarations: [SlaveHomePage]
})
export class SlaveModule {}
