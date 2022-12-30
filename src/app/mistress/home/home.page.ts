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

export class MistressHomePage implements OnInit {

  public slaveSubs: Array<Observable<Globals.Slave>>

  constructor(public auth: AuthService, private mistressService: MistressService) {}

  ngOnInit(): void {
    this.slaveSubs = new Array<Observable<Globals.Slave>>();
    this.auth.getUserStatusVerified().pipe(
      filter(userVerified => userVerified == true),
      map(() => this.auth.getUserId()),
      filter(id => id != null),
      switchMap(()=> {
        return this.mistressService.getSlaves();
      }),
      first()
    ).subscribe(data => {
      console.log('mistress home page - data', data);
      data.forEach(slave => {
        console.log('mistress homepage', slave);
        this.slaveSubs.push(this.mistressService.getSlaveSnapshots(slave.docID))
      });
    })
  }

}

