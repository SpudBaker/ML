import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { MistressService } from '../../services/mistress';
import { Observable } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';
import * as Globals from '../../../globals';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class SlaveHomePage implements OnInit {

  constructor(public auth: AuthService, private mistressService: MistressService) {}

  ngOnInit(): void {
    
  }

}

