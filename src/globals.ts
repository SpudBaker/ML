import { Timestamp } from "@angular/fire/firestore";

export enum Role {
  Mistress,
  Slave
}

export class Login {
  lastSeen: Timestamp;
  loggedIn: Timestamp;
}

export class User {
  email: string;
  id: string;
  logins: Login[];
  role: Role;
  constructor(email: string, id: string, role: Role){
    this.email = email;
    this.id = id;
    this.logins = new Array<Login>();
    this.role = role;
  }
}