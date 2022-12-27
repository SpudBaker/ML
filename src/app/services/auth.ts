import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, 
    signOut, user, User, UserCredential } from '@angular/fire/auth';
import { collection, doc, docData, Firestore, getDocs, query, setDoc, where } from '@angular/fire/firestore';

import { EMPTY, from, Observable } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as Globals from'../../globals';

@Injectable({providedIn: 'root'})

export class AuthService{

    private loggedIn: boolean;
    private user: Globals.User;
    private userStatusVerfied: boolean; 

    constructor(private auth: Auth, private firestore: Firestore, private router: Router){
        this.getLoginStatus().subscribe();
    }

    public createUserWithEmailAndPassword(email: string, password: string): Promise<any>{
        return createUserWithEmailAndPassword(this.auth, email, password).then(async user => {
            const q = query(collection(this.firestore, "users"), where("email", "==", email));
            const querySnapshot = await getDocs(q);
            if(querySnapshot.empty){
                const usersCollection = collection(this.firestore, "users");
                setDoc(doc(usersCollection, user.user.uid), {email, score: 100});
            } else {
            }
        })
    }

    public getAuth(): Auth {
        return this.auth;
    }

    public getLoginStatus(): Observable<any>{
        return user(this.auth).pipe(
            switchMap(data => {
                if(data){
                    if(!this.loggedIn){
                        return this.getUserDatabaseRecordByID(data.displayName, data.uid, data.email).pipe(
                            switchMap(user => {
                                this.user = user;
                                this.loggedIn = true;
                                this.userStatusVerfied = true;
                                return this.router.navigate(['home']);
                            })
                        )
                    };
                } else {
                    this.user = undefined;
                    this.loggedIn = false;
                    this.userStatusVerfied = true;
                    this.router.navigate(['login']);
                    return EMPTY;
                }
            })
        );
    }

    public getUserDatabaseRecordByID(displayName: string, id: string, email: string): Observable<Globals.User>{
        return docData(doc(this.firestore, 'users/' + id)).pipe(
          first(), 
          map(doc => {
            const user = new Globals.User(displayName, email, id, doc.role);
            return user;
          })
        )
    }

    public getUserDisplayName(): string{
        return this.user.displayName;
    }

    public getUserEmail(): string {
        return this.user.email;
    }

    public getUserId(): string {
        return this.user.id;
    }

    public getUserStatusVerified(): boolean {
        return this.userStatusVerfied;
    }

    public sendPasswordRestEmail(email: string): Observable<void>{
        return from (sendPasswordResetEmail(this.auth, email))
    }

    public async signIn(email: string, password: string): Promise<UserCredential>{
        return signInWithEmailAndPassword(this.auth, email, password)
    }

    public signOut(){
        signOut(this.auth);
    }

}