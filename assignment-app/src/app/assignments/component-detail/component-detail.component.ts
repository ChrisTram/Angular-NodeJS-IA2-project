import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/shared/auth.service';
import { AssignmentsService } from 'app/shared/assignments.service';
import { Assignment } from '../assignment.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-component-detail',
  templateUrl: './component-detail.component.html',
  styleUrls: ['./component-detail.component.css']
})
export class ComponentDetailComponent implements OnInit {
  assignementTransmis: Assignment;

  constructor(private assignmentsService: AssignmentsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getAssignment();
  }

  getAssignment() {
    // l'id passé par l'URL est de type string et nous on veut
    // un number. On peut utiliser l'astuce suivante : rajouter un "+" devant
    // la chaine, ce qui va la transformer en number
    let id = +this.route.snapshot.params.id;
    console.log("detail : id récupéré dans URL = " + id);
    this.assignmentsService.getAssignment(id)
      .subscribe(a => {
        this.assignementTransmis = a;
      });
  }

  onDelete() {
    this.assignmentsService.deleteAssignment(this.assignementTransmis)
      .subscribe(message => {
        console.log(message);
        this._snackBar.open('L\'assignement ' + this.assignementTransmis.nom + ' a été supprimé', "Fermer", { duration: 3000 });
        this.assignementTransmis = null;
        this.router.navigate(["/home"]);
      });
  }

  onAssignementRendu() {
    if (this.loggedIn()) {
      this.assignementTransmis.rendu = true;
      this.assignmentsService.updateAssignment(this.assignementTransmis)
        .subscribe(message => {
          console.log("assignment mis à jour - " + message);
          this.router.navigate(["/home"]);
        });
    } else {
      this._snackBar.open('Vous devez être connecté pour effectuer cette action', "Fermer", { duration: 3000 });
    }

  }

  onClickEdit() {
    this.router.navigate(
      ['assignment', this.assignementTransmis.id, 'edit'],
      {
        queryParams: {
          nom: this.assignementTransmis.nom
        },
        fragment: 'edition'
      });
  }

  loggedIn() {
    let result = false;
    this.authService.isLogin().subscribe(val => { result = val; })
    return result
  }
  isAdmin() {
    let result = false;
    this.authService.isAdmin().subscribe(val => { result = val; })
    console.log(result)
    return result
  }

  getPortrait(assignment: Assignment): string {
    if (assignment.image === "null") {
      var genre = ""
      var idStr = assignment.id.toString()

      if (Number(idStr[0]) < 5) {
        genre = "men"
      } else {
        genre = "women"
      }
      let nb;

      if (idStr[1] != "0") {
        nb = idStr[1] + idStr[2]
      } else {
        nb = idStr[2] + idStr[1]
      }

      assignment.image = "https://randomuser.me/api/portraits/" + genre + "/" + nb + ".jpg"
    }
    return "background-image: url( '" + assignment.image + "'); background-size: cover;";
  }

  getImage(matiere: string): string {
    const matieres = [
      'Histoire',
      'Computer Vision',
      'BD',
      'WEB',
      'JAVA',
      'Angular',
      'Anglais',
      'Machine Learning',
      'Deep Learning',
      'SVT',
      'Maths',
      'SI',
      'Compta'
    ]
    if (matieres.indexOf(matiere) >= 0) {
      return "assets/" + matiere + ".jpg";
    } else {
      return "assets/default.jpg";
    }
  }
}
