import { Timestamp } from "@angular/fire/firestore";

export enum GameStatus {
  complete = 'complete',
  PendingSlave = 'pending slave',
}

export enum Role {
  Mistress = 'Mistress',
  Slave = 'Slave'
}

export class DiceGame {
  docID: string;
  diceGameTemplate: string;
  mistress: string;
  slave: string;
  gameStatus: GameStatus;
  description: string;
  result: number;
  resultTask: string;
  taskDone: boolean;
  constructor(docID: string, diceGameTemplate: string, mistress: string, slave: string, gameStatus: GameStatus, description: string, result: number, resultTask: string, taskDone: boolean){
    this.docID = docID;
    this.diceGameTemplate = diceGameTemplate;
    this.mistress = mistress;
    this.slave = slave;
    this.gameStatus = gameStatus;
    this.description = description;
    this.result = result;
    this.resultTask = resultTask;
    this.taskDone = taskDone;
  }
}

export class DiceGameTemplate {
  docID: string;
  mistress: string;
  name: string;
  task2: string;
  task3: string;
  task4: string;
  task5: string;
  task6: string;
  task7: string;
  task8: string;
  task9: string;
  task10: string;
  task11: string;
  task12: string;
  constructor(docID: string, mistress: string, name: string, task2: string, task3: string, task4: string, task5: string, task6: string, task7: string, task8: string, task9: string, task10: string, task11: string, task12: string){
    this.docID = docID;
    this.mistress = mistress;
    this.name = name;
    this.task2 = task2;
    this.task3= task3;
    this.task4 = task4;
    this.task5 = task5;
    this.task6 = task6;
    this.task7 = task7;
    this.task8 = task8;
    this.task9 = task9;
    this.task10 = task10;
    this.task11 = task11;
    this.task12 = task12;
  }
}

export class Message {
  docID: string;
  incoming: boolean;
  mistress: string;
  message: string;
  read: boolean;
  timeStamp: Timestamp;
  slave: string;
}

export class User {
  displayName: string;
  email: string;
  docID: string;
  lastSeen: Timestamp; 
  lastSeenRecent: boolean;
  role: Role;
  constructor(displayName: string, email: string, docID: string, role: Role, lastSeen?: Timestamp){
    this.displayName = displayName;
    this.email = email;
    this.docID = docID;
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