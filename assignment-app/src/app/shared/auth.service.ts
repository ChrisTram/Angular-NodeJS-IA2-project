import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn:boolean = false;

  constructor() { }

  logIn() {
    this.loggedIn = true;
  }

  logOut() {
    this.loggedIn = false;
  }

  isAdmin():Promise<any> {
    const isUserAdmin = new Promise((resolve, reject) => {
      resolve(this.loggedIn);
    });

    return isUserAdmin;
    }
}
