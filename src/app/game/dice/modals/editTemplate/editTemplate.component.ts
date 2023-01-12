import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import * as Globals from '../../../../../globals';
import { GamesService } from 'src/app/services/games';


@Component({
  selector: 'edit-template',
  templateUrl: 'editTemplate.component.html',
  styleUrls: ['editTemplate.component.scss'],
})
export class EditTemplateComponent {

  public form: FormGroup
  public diceTemplate: Globals.DiceGameTemplate;

  constructor(private formBuilder: FormBuilder, private gamesService: GamesService, private modalController: ModalController) {}

  ionViewDidEnter(){
    this.form = this.formBuilder.group({
      name: [this.diceTemplate.name, Validators.required],
      task2: [this.diceTemplate.task2, Validators.required],
      task3: [this.diceTemplate.task3, Validators.required],
      task4: [this.diceTemplate.task4, Validators.required],
      task5: [this.diceTemplate.task5, Validators.required],
      task6: [this.diceTemplate.task6, Validators.required],
      task7: [this.diceTemplate.task7, Validators.required],
      task8: [this.diceTemplate.task8, Validators.required],
      task9: [this.diceTemplate.task9, Validators.required],
      task10: [this.diceTemplate.task10, Validators.required],
      task11: [this.diceTemplate.task11, Validators.required],
      task12: [this.diceTemplate.task12, Validators.required]
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
    gt.docID = this.diceTemplate.docID
    gt.mistress = this.diceTemplate.mistress;
    this.gamesService.updateGameTemplate(gt)
    .then(() => {this.modalController.dismiss()})
  }

}