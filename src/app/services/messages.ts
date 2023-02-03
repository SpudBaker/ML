import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore, limit, orderBy, query, updateDoc, where } from '@angular/fire/firestore';
import { EMPTY, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { AuthService } from './auth';
import * as Globals from '../../globals';

@Injectable({providedIn: 'root'})

export class MessagesService{

    constructor(private authService: AuthService, private firestore: Firestore,){}

    public getUnreadMessagesForMistress(): Observable<Globals.Message[]>{
        const mistressId = this.authService.getUserId();
        if(!mistressId){return EMPTY}
        const collectionRef = collection(this.firestore,'messages');
        const queryRef = query(collectionRef, where('mistress', '==', mistressId), where('read', '==', false), orderBy("timeStamp","desc"));
        return collectionData(queryRef, {idField: 'docID'}).pipe(
            map(dataArr => {
                const arrMessages = new Array<Globals.Message>();
                dataArr.forEach(item => {
                    arrMessages.push(item as Globals.Message)
                })
                return arrMessages;
            })
        )
    }

    public getSlaveMessages(slave: string): Observable<Globals.Message[]>{
        const collectionRef = collection(this.firestore,'messages');
        const queryRef = query(collectionRef, where('slave', '==', slave), orderBy("timeStamp","desc"), limit(50));
        return collectionData(queryRef, {idField: 'docID'}).pipe(
            map(dataArr => {
                const arrMessages = new Array<Globals.Message>();
                dataArr.forEach(item => {
                    arrMessages.push(item as Globals.Message)
                })
                return arrMessages;
            })
        )
    }

    public markMessagesAsRead(slave: string, mistress: string): Promise<any>{
        const collectionRef = collection(this.firestore,'messages');
        const queryRef = query(collectionRef, where('slave', '==', slave), where('mistress', '==', mistress), where('read', '==', false));
        return collectionData(queryRef, {idField: 'docID'}).pipe(first()).toPromise()
        .then(data => {
            const promArray = new Array<Promise<any>>();
            data.forEach(item => {
                const docRef = doc(this.firestore, 'messages/' + item.docID);
                promArray.push(updateDoc(docRef, {read: true}));
            })
            return Promise.all(promArray);
        })
    }

    public newMessage(data: Globals.Message): Promise<any> {
        const colRef = collection(this.firestore, 'messages');
        return addDoc(colRef,{incoming: data.incoming, message: data.message, mistress: data.mistress, read: data.read, slave: data.slave, timeStamp: data.timeStamp })
    }

    
}