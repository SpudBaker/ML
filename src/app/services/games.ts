import { Injectable } from '@angular/core';
import { collection, collectionData, deleteDoc, doc, DocumentData, Firestore, orderBy, query, setDoc, where } from '@angular/fire/firestore';
import { EMPTY, Observable } from 'rxjs';
import { AuthService } from './auth';
import * as Globals from'../../globals';

@Injectable({providedIn: 'root'})

export class GamesService{

    constructor(private authService: AuthService, private firestore: Firestore,){}

    public deleteGameTemplate(docID: string): Promise<void>{
        const docRef = doc(this.firestore, 'gameTemplates/' + docID);
        return deleteDoc(docRef)
    }

    public getGameTemplates(): Observable<DocumentData[]>{
        const mistressId = this.authService.getUserId();
        if(!mistressId){return EMPTY}
        const collectionRef = collection(this.firestore,'gameTemplates');
        const queryRef = query(collectionRef, where('mistress', '==', mistressId), orderBy("name"));
        return collectionData(queryRef, {idField: 'docID'});
    }

    public updateGameTemplate(data: Globals.DiceGameTemplate): Promise<any> {
        const docRef = doc(this.firestore, 'gameTemplates/' + data.docID);
        return setDoc(docRef, {name: data.name, mistress: data.mistress, task2: data.task2, task3: data.task3, task4: data.task4, task5: data.task5, task6: data.task6, task7: data.task7, task8: data.task8, task9: data.task9, task10: data.task10, task11: data.task11, task12: data.task12});
    }

}