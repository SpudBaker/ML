import { Component } from '@angular/core';
import { AuthService } from '../services/auth';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  constructor(private auth: AuthService) {
  }

}
