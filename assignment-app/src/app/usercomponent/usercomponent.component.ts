import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'app/shared/auth.service';
import { User } from 'app/users/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-usercomponent',
  templateUrl: './usercomponent.component.html',
  styleUrls: ['./usercomponent.component.css']
})
export class UserComponent implements OnInit {
  usernameForm: string;
  password: string;

  @ViewChild("logToggle") ref: ElementRef;


  constructor(private authService: AuthService, private router: Router, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  logInOut() {
    if (this.authService.loggedIn) {
      this.authService.logOut();
      this.router.navigate(["/home"]);
    } else {
      this.authService.logIn();
    }
  }

  onLoginSubmit() {
    console.log("onSubmit")


    this.authService.getUser(this.usernameForm)
      .subscribe(rep => {
        if(rep != null) {
          this._snackBar.open('Utilisateur connecté : ', rep.username, { duration: 2000 });
        } else {
          this._snackBar.open('Utilisateur non trouvé : ', this.usernameForm, { duration: 2000 });
        }
      })
  }

  getUserStr(): String {
    return this.authService.getUserStr();
  }

  isLogin(): boolean {
    let result = false;
    this.authService.isLogin().subscribe(val => { result = val; })
    return result
  }

  logOut() {
    if (this.isLogin()) {
      console.log("disconnect")
      this.authService.logOut();
      this._snackBar.open('Utilisateur Déconnecté : ', this.usernameForm, { duration: 2000 });
      this.router.navigate(["/home"]);

    }
  }

}
