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
  lastSeenRecent: boolean;
  role: Role;
  constructor(displayName: string, email: string, id: string, role: Role, lastSeen?: Timestamp){
    this.displayName = displayName;
    this.email = email;
    this.id = id;
    this.lastSeen = lastSeen;
    this.lastSeenRecent = recent(lastSeen);
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

export function recent(t: Timestamp): boolean {
  if(t){
    return ((Timestamp.fromDate(new Date()).seconds - t.seconds) < 120);
  } else {
    return false;
  }
}