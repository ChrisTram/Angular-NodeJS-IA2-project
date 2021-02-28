import { Injectable } from '@angular/core';
import { Assignment } from '../assignments/assignment.model';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  constructor() { }

  log(assignment:Assignment, action:string) {
    console.log("Logging Service: " + assignment.nom + " " + action);
  }
}
