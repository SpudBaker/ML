import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, 
    signOut, user, UserCredential } from '@angular/fire/auth';
import { collection, doc, docData, Firestore, getDocs, query, setDoc, Timestamp, updateDoc, where } from '@angular/fire/firestore';
import { BehaviorSubject, EMPTY, from, Observable, Subscription, timer } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as Globals from'../../globals';

@Injectable({providedIn: 'root'})

export class AuthService{

    private loggedIn: boolean;
    private updateTimer$: Observable<any>;
    private user: Globals.User;
    private userStatusVerfied = new BehaviorSubject<boolean>(false); 

    constructor(private auth: Auth, private firestore: Firestore, private router: Router){
        this.getLoginStatus().subscribe();
    }

    public createUserWithEmailAndPassword(email: string, password: string, displayName: string): Promise<any>{
        return createUserWithEmailAndPassword(this.auth, email, password).then(async user => {
            const q = query(collection(this.firestore, "users"), where("email", "==", email));
            const querySnapshot = await getDocs(q);
            if(querySnapshot.empty){
                const usersCollection = collection(this.firestore, "users");
                setDoc(doc(usersCollection, user.user.uid), {email, mistress: this.user.docID, role: Globals.Role.Slave, displayName });
            } else {
            }
        })
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
                                this.startUpdateTimer();
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
            let user: Globals.User;
            if(doc.role == Globals.Role.Slave){
                user = new Globals.Slave(doc.displayName, doc.email, id, doc.mistress, doc.role);
            } else {
                user = new Globals.User(doc.displayName, doc.email, id, doc.role);
            }
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
        return this.user?.docID;
    }

    public getUserMistress(){
        const u = this.user as Globals.Slave;
        if(u?.mistress){
            return u.mistress;
        } else {
            return '';
        }
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

    private startUpdateTimer():void {
        this.updateTimer$ = timer(0, 60000).pipe(
            switchMap(() => this.updateTimeStamp())
        );
        this.updateTimer$.subscribe();
    }

    private updateTimeStamp(): Promise<any>{
        const docRef = doc(this.firestore,'users/'+this.getUserId());
        return updateDoc(docRef, {lastSeen: Timestamp.fromDate(new Date())})
    }

}