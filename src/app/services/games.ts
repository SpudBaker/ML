import { Injectable } from '@angular/core';
import { addDoc,collection, collectionData, deleteDoc, doc, DocumentData, DocumentReference, Firestore, orderBy, query, setDoc, where } from '@angular/fire/firestore';
import { EMPTY, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
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

    public getOpenGames(slaveID: string): Observable<DocumentData[]>{
        const collectionRef = collection(this.firestore,'games');
        const queryRef = query(collectionRef, where('slave', '==', slaveID), where('gameStatus', '!=', Globals.GameStatus.complete));
        return collectionData(queryRef);
    }

    public newGame(data: Globals.DiceGame): Promise<any> {
        const colRef = collection(this.firestore, 'games');
        return addDoc(colRef,{diceGameTemplate: data.diceGameTemplate, gameStatus: data.gameStatus, mistress: data.mistress, description: data.description, 
                slave: data.slave, taskDone: data.taskDone });
     }

    public newGameTemplate(data: Globals.DiceGameTemplate): Promise<any> {
       const colRef = collection(this.firestore, 'gameTemplates');
       return addDoc(colRef,{name: data.name, mistress: data.mistress, task2: data.task2, task3: data.task3, task4: data.task4, task5: data.task5, task6: data.task6, task7: data.task7, task8: data.task8, task9: data.task9, task10: data.task10, task11: data.task11, task12: data.task12})
    }

    public updateGameTemplate(data: Globals.DiceGameTemplate): Promise<any> {
        const docRef = doc(this.firestore, 'gameTemplates/' + data.docID);
        return setDoc(docRef, {name: data.name, mistress: data.mistress, task2: data.task2, task3: data.task3, task4: data.task4, task5: data.task5, task6: data.task6, task7: data.task7, task8: data.task8, task9: data.task9, task10: data.task10, task11: data.task11, task12: data.task12});
    }

}