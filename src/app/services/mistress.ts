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

    public getSlaveSnapshots(slaveId: string):Observable<Globals.Slave>{
        console.log('mistress service - get slave snapshots', slaveId);
        const docRef = doc(this.firestore, "users", slaveId) as DocumentReference;
        return docSnapshots(docRef).pipe(
            map(snap => {
                const s = new Globals.Slave(snap.data().displayName, snap.data().email, snap.id, snap.data().mistress, snap.data().role, snap.data().lastSeen)
                return s;
            }),
            switchMap(slave => {
                return timer(0,10000).pipe(
                    map(() => {
                        console.log('mistress service - gt snapshots - timer map');
                        return Globals.cloneSlave(slave);
                    })
                )
            })
        )
    }

    public getSlaves(): Observable<DocumentData[]>{
        const mistressId = this.authService.getUserId();
        console.log('mistress service - getSlaves()', mistressId)
        const collectionRef = collection(this.firestore,'users');
        const queryRef = query(collectionRef, where('mistress', '==', mistressId));
        return collectionData(queryRef, {idField: 'docID'});
    }

}