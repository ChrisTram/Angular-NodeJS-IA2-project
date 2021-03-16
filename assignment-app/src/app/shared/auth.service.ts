import { User } from 'app/users/user.model';
import { Injectable } from '@angular/core';
import { Assignment } from '../assignments/assignment.model';
import { forkJoin, Observable, of } from 'rxjs';
import { LoggingService } from './logging.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import * as data from 'app/shared/assignments.json';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private loggingService: LoggingService,
    private http: HttpClient
  ) {this.loggedIn = false}

  uri = 'http://localhost:8010/api/users';
  assignments_json: any = (data as any).default;
  actualUser:User;
  loggedIn:boolean = false;

  logIn() {    
    this.loggedIn = true;
  }

  logOut() {
    this.loggedIn = false;
  }

  getUser(username: string): Observable<User> {
    return this.http.get<User>(this.uri + '/' + username)
    .pipe(
      map(a => {
        this.logIn()
        this.actualUser = a;
        return a;
      }),
      tap(a => {
        console.log("Dans le tap");
        console.log(a);
      }),
      catchError(this.handleError<User>(`getUser(username=${username})`))
    );
  }

  private handleError<T>(operation:any, result?:T) {
    return(error:any) : Observable<T> => {
      console.log(error); // pour afficher dans la console
      console.log(operation + " a échoué " + error.message);

      return of(result as T);
    }
  }

  getUserStr():String {
    if(this.loggedIn) {
      return this.actualUser.username
    }
  }
  

  isAdmin():Promise<any> {
    const isUserAdmin = new Promise((resolve, reject) => {
      resolve(this.actualUser.isAdmin);
    });

    return isUserAdmin;
    }


  isLogin():Observable<any> {
    const isLog = new Observable(observer => {
      observer.next(this.loggedIn);
  });
  return isLog
  }
}
