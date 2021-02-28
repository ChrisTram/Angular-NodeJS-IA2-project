import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService} from './shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private authService:AuthService,
              private router:Router) {}

  titre = 'Application de gestion des Assignments';

  logInOut() {
    if(this.authService.loggedIn) {
      this.authService.logOut();
      this.router.navigate(["/home"]);
    } else {
      this.authService.logIn();
    }
  }
}
