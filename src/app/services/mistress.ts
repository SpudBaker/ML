import { Injectable } from '@angular/core';
import { collection, collectionData, doc, docSnapshots, DocumentData, DocumentReference, Firestore, query, where } from '@angular/fire/firestore';
import { BehaviorSubject, EMPTY, from, Observable, timer } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth';
import * as Globals from'../../globals';

@Injectable({providedIn: 'root'})

export class MistressService{

    constructor(private authService: AuthService, private firestore: Firestore,){}

    public getSlaves(): Observable<Globals.Slave[]>{
        const mistressId = this.authService.getUserId();
        const collectionRef = collection(this.firestore,'users');
        const queryRef = query(collectionRef, where('mistress', '==', mistressId));
        return collectionData(queryRef, {idField: 'docID'}).pipe(
            switchMap(itemsArr => {
                return timer(0,10000).pipe(
                    map(() => {
                        console.log('mistress service - getSlaves()', itemsArr)
                        const slaveArray = new Array<Globals.Slave>;
                        itemsArr.forEach(item => {
                            const s: Globals.Slave = item as Globals.Slave;
                            s.lastSeenRecent = Globals.recent(s.lastSeen);
                            slaveArray.push(item as Globals.Slave);
                        })
                        return slaveArray;
                    })
                )
            })
        );
    }

}