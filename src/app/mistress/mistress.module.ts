import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MistressHomePage } from './home/home.page';
import { MistressSlavePage } from './mistressSlave/mistressSlave.page';
import { MistressRoutingModule } from './mistress-routing.module';
import { NewSlaveComponent } from './modals/newSlave/newSlave.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MistressRoutingModule
  ],
  declarations: [MistressHomePage, MistressSlavePage, NewSlaveComponent]
})
export class MistressModule {}
