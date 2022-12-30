import { Timestamp } from "@angular/fire/firestore";

export enum Role {
  Mistress = 'Mistress',
  Slave = 'Slave'
}


export class User {
  displayName: string;
  email: string;
  id: string;
  lastSeen: Timestamp; 
  role: Role;
  constructor(displayName: string, email: string, id: string, role: Role, lastSeen?: Timestamp){
    this.displayName = displayName;
    this.email = email;
    this.id = id;
    this.lastSeen = lastSeen;
    this.role = role;
  }
}

  
export class Slave extends User {
  mistress: string;
  constructor(displayName: string, email: string, id: string, mistress: string, role: Role, lastSeen?: Timestamp){
    super(displayName, email, id, Role.Slave, lastSeen);
    this.mistress = mistress;
  }
}