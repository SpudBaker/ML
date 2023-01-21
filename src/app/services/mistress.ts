import { Injectable } from '@angular/core';
import { collection, collectionData, doc, docSnapshots, DocumentData, DocumentReference, Firestore, getDoc, query, where } from '@angular/fire/firestore';
import { from, Observable, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth';
import * as Globals from'../../globals';

@Injectable({providedIn: 'root'})

export class MistressService{

    constructor(private authService: AuthService, private firestore: Firestore,){}

    public getSlave(docID: string): Promise<Globals.Slave>{
        const d = doc(this.firestore, 'users/' + docID);
        return getDoc(d)
        .then(d => {
            const s:Globals.Slave = d.data() as Globals.Slave;
            s.docID = docID;
            return s;
        })
    }

    public getSlaves(): Observable<Globals.Slave[]>{
        const mistressId = this.authService.getUserId();
        const collectionRef = collection(this.firestore,'users');
        const queryRef = query(collectionRef, where('mistress', '==', mistressId));
        return collectionData(queryRef, {idField: 'docID'}).pipe(
            switchMap(itemsArr => {
                return timer(0,10000).pipe(
                    map(() => {
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