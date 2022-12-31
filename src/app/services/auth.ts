import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, sendPasswordResetEmail, 
    signOut, user, UserCredential } from '@angular/fire/auth';
import { doc, docData, Firestore } from '@angular/fire/firestore';

import { BehaviorSubject, EMPTY, from, Observable } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as Globals from'../../globals';

@Injectable({providedIn: 'root'})

export class AuthService{

    private loggedIn: boolean;
    private user: Globals.User;
    private userStatusVerfied = new BehaviorSubject<boolean>(false); 

    constructor(private auth: Auth, private firestore: Firestore, private router: Router){
        this.getLoginStatus().subscribe();
    }

    public getAuth(): Auth {
        return this.auth;
    }

    public getLoginStatus(): Observable<boolean>{
        return user(this.auth).pipe(
            switchMap(data => {
                if(data){
                    if(!this.loggedIn){
                        return this.getUserDatabaseRecordByID(data.uid).pipe(
                            switchMap(user => {
                                this.user = user;
                                this.loggedIn = true;
                                this.userStatusVerfied.next(true);
                                if(user.role == Globals.Role.Mistress){
                                    return this.router.navigate(['mistress']);
                                } else {
                                    return this.router.navigate(['slave']);
                                }
                            })
                        )
                    };
                } else {
                    this.user = undefined;
                    this.loggedIn = false;
                    this.userStatusVerfied.next(true);
                    this.router.navigate(['login']);
                    return EMPTY;
                }
            })
        );
    }

    public getUserDatabaseRecordByID(id: string): Observable<Globals.User>{
        return docData(doc(this.firestore, 'users/' + id)).pipe(
          first(), 
          map(doc => {
            const user = new Globals.User(doc.displayName, doc.email, id, doc.role);
            return user;
          })
        )
    }

    public getUserDisplayName(): string{
        return this.user?.displayName;
    }

    public getUserEmail(): string {
        return this.user?.email;
    }

    public getUserId(): string {
        return this.user?.id;
    }

    public getUserStatusVerified(): BehaviorSubject<boolean> {
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