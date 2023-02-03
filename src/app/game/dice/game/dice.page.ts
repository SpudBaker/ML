import { Component, ElementRef, ViewChild } from '@angular/core';
import rollADie from 'roll-a-die';

@Component({
  selector: 'app-dice',
  templateUrl: 'dice.page.html',
  styleUrls: ['dice.page.scss'],
})



export class DicePage {

  @ViewChild('divvy') div:ElementRef;

  constructor(){}

  rollDice(){
    const dice = this.div.nativeElement;
    console.log(dice);
    rollADie({element: dice, numberOfDice: 2, callback: this.callback});
  }

  callback(thing: any){
    console.log(thing);
  }
    

}

