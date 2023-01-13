import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import * as Globals from '../../../../../globals';
import { GamesService } from 'src/app/services/games';
import { AuthService } from 'src/app/services/auth';

@Component({
  selector: 'new-template',
  templateUrl: 'newTemplate.component.html',
  styleUrls: ['newTemplate.component.scss'],
})
export class NewTemplateComponent {

  public form: FormGroup

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private gamesService: GamesService, private modalController: ModalController) {}

  ionViewDidEnter(){
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      task2: ['', Validators.required],
      task3: ['', Validators.required],
      task4: ['', Validators.required],
      task5: ['', Validators.required],
      task6: ['', Validators.required],
      task7: ['', Validators.required],
      task8: ['', Validators.required],
      task9: ['', Validators.required],
      task10: ['', Validators.required],
      task11: ['', Validators.required],
      task12: ['', Validators.required]
    })
  }

  public formValid(): boolean{
    return this.form?.valid;
  }

  public cancel(){
    this.modalController.dismiss();
  }

  public save(){
    const gt: Globals.DiceGameTemplate = {...this.form.value}
    gt.mistress = this.authService.getUserId();
    this.gamesService.newGameTemplate(gt)
    .then(() => {this.modalController.dismiss()})
  }

}