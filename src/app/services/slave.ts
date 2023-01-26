import { Injectable } from '@angular/core';
import { collection, collectionData, doc, docSnapshots, DocumentData, DocumentReference, Firestore, getDoc, query, where } from '@angular/fire/firestore';
import { Observable, Subscription, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth';
import * as Globals from'../../globals';


@Injectable({providedIn: 'root'})

export class SlaveService{

    constructor(private authService: AuthService, private firestore: Firestore){}

}