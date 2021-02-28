import { Injectable } from '@angular/core';
import { Assignment } from '../assignments/assignment.model';
import { forkJoin, Observable, of } from 'rxjs';
import { LoggingService } from './logging.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import * as data from './assignments.json';

@Injectable({
  providedIn: 'root',
})
export class AssignmentsService {
  assignments: Assignment[] = [
    {
      id: 1,
      nom: 'TP1 Web Components à rendre',
      dateDeRendu: new Date('2020-11-17'),
      rendu: true,
    },
    {
      id: 2,
      nom: 'TP2 Angular à rendre',
      dateDeRendu: new Date('2020-12-13'),
      rendu: false,
    },
    {
      id: 3,
      nom: 'Mini Projet Angular à rendre',
      dateDeRendu: new Date('2021-01-07'),
      rendu: false,
    },
  ];

  constructor(
    private loggingService: LoggingService,
    private http: HttpClient
  ) {}

  uri = 'http://localhost:8010/api/assignments';

  getAssignments(): Observable<Assignment[]> {
    //return of(this.assignments);
    return this.http.get<Assignment[]>(this.uri)
      .pipe(
        catchError(this.handleError<any>("getAssignments"))
      )
  }

  getAssignmentsPagine(nextPage : Number = 1, limit:Number = 10): Observable<Object> {
    return this.http.get<Object>(this.uri + `?page=${nextPage}&limit=${limit}`)
  }

  // Version avec promesse
  getAssignmentsPromise(): Promise<Assignment[]> {
    //return of(this.assignments);
    return this.http.get<Assignment[]>(this.uri).toPromise();
  }

  getMoreAssignments(page, size):Observable<Assignment[]> {
    let newAssignments:Assignment[] = [];

    for (let i = 0; i < size; i++) {
      const id = this.getNewId();

      newAssignments.push({
        id:id,
        nom: 'Nouvel Assignment # ' + id,
        dateDeRendu: new Date(),
        rendu: false
      });
    }
    return of(newAssignments);
  }


  getAssignment(id: number): Observable<Assignment> {
    //let result = this.assignments.find(a => (a.id === id));

    //return of(result);
    return this.http.get<Assignment>(this.uri + '/' + id)
    .pipe(
      map(a => {
        a.nom += " MODIFIE DANS PIPE AVEC UN MAP";
        return a;
      }),
      tap(a => {
        console.log("Dans le tap");
        console.log(a);
      }),
      catchError(this.handleError<Assignment>(`getAssignment(id=${id})`))
    );
  }

  private handleError<T>(operation:any, result?:T) {
    return(error:any) : Observable<T> => {
      console.log(error); // pour afficher dans la console
      console.log(operation + " a échoué " + error.message);

      return of(result as T);
    }
  }

  addAssignment(assignment: Assignment): Observable<any> {
    this.loggingService.log(assignment, 'ajouté');

    //this.assignments.push(assignment);
    //return of("Assignement ajouté");
    return this.http.post(this.uri, assignment);
  }

  updateAssignment(assignment: Assignment): Observable<any> {
    this.loggingService.log(assignment, 'modifié');
    /*
    this.assignments.forEach((a, index) => {
      if(assignment === a) {
        this.assignments[index] = a;
      }
    });
    return of("Assignement ajouté");
    */
    return this.http.put<Assignment>(this.uri, assignment);
  }

  deleteAssignment(assignment: Assignment): Observable<any> {
    this.loggingService.log(assignment, 'supprimé');
    /*
    this.assignments.forEach((a, index) => {
      if(assignment === a) {
        this.assignments.splice(index, 1);
      }
    });

    return of("Assignement supprimé");
    */
    return this.http.delete(this.uri + '/' + assignment._id);
  }

  assignments_json: any = (data as any).default;

  peuplerBD(){
    for (let i = 0; i < this.assignments_json.length; i++) {
      const a = this.assignments_json[i]

      const new_assignment = new Assignment();

      new_assignment.id = this.getNewId();

      new_assignment.nom = a.nom;
      new_assignment.dateDeRendu = new Date(a.dateDeRendu);
      new_assignment.rendu = false;

      this.addAssignment(new_assignment)
        .subscribe(message => {
          console.log("500 Assignments Créés");
        });
    }
  }

  getNewId(): number {
    return Math.ceil(Math.random()*100000);
  }

  // autre version qui permet de récupérer un subscribe une fois que tous les inserts
  // ont été effectués
  peuplerBDJoin(): Observable<any> {
    const calls = [];

    this.assignments_json.forEach((a) => {
      const new_assignment = new Assignment();

      new_assignment.id = this.getNewId();

      new_assignment.nom = a.nom;
      new_assignment.dateDeRendu = new Date(a.dateDeRendu);
      new_assignment.rendu = false;
      calls.push(this.addAssignment(new_assignment));
    });
    return forkJoin(calls); // renvoie un seul Observable pour dire que c'est fini
  }
}

