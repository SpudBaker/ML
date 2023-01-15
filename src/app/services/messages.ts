import { Injectable } from '@angular/core';
import { collection, collectionData, DocumentData, Firestore } from '@angular/fire/firestore';
import { EMPTY, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth';
import * as Globals from '../../globals';

@Injectable({providedIn: 'root'})

export class MessagesService{

    constructor(private authService: AuthService, private firestore: Firestore,){}

    public getMessages(): Observable<Globals.Message[]>{
        const mistressId = this.authService.getUserId();
        if(!mistressId){return EMPTY}
        const collectionRef = collection(this.firestore,'messages');
        // const queryRef = query(collectionRef, where('mistress', '==', mistressId), orderBy("name"));
        return collectionData(collectionRef, {idField: 'docID'}).pipe(
            map(dataArr => {
                const arrMessages = new Array<Globals.Message>();
                dataArr.forEach(item => {
                    arrMessages.push(item as Globals.Message)
                })
                return arrMessages;
            })
        )
    }

    
}