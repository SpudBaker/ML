import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-dice',
  templateUrl: 'dice.page.html',
  styleUrls: ['dice.page.scss'],
})

export class DicePage {

  constructor(private elem: ElementRef){}

  public rollDice() {
    //const dice = [...document.querySelectorAll(".die-list")];
    const dice = this.elem.nativeElement.querySelectorAll('.die-list')
    dice.forEach(die => {
      this.toggleClasses(die);
      die.dataset.roll = 6 //this.getRandomNumber(1, 6);
    });
  }
  
  private toggleClasses(die) {
    die.classList.toggle("odd-roll");
    die.classList.toggle("even-roll");
  }
  
  private getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}

