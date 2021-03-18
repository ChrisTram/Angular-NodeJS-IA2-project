import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'app/shared/auth.service';
import { filter, map, pairwise, tap, throttleTime } from 'rxjs/operators';
import { AssignmentsService } from '../shared/assignments.service';
import { Assignment } from './assignment.model';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css'],
})
export class AssignmentsComponent implements OnInit {
  titre = 'Mon application sur les Assignments 2 !';
  formVisible = false;
  assignments: Assignment[] = [];
  assignmentSelectionne: Assignment;

  page: Number;
  nextPage: Number = 1;
  limit: Number = 10;
  countAssignments: Number;

  @ViewChild('scroller') scroller: CdkVirtualScrollViewport;

  constructor(
    private assignmentsService: AssignmentsService,
    private ngZone: NgZone,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    /*
    this.assignmentsService.getAssignments().subscribe((assignments) => {
      // exécuté que quand les données sont réellement disponible
      this.assignments = assignments;
    });
*/
    this.getAssignments();
  }

  // avec pagination...
  getAssignments() {
    if (!this.nextPage) return;
    this.assignmentsService
      .getAssignmentsPagine(this.nextPage, this.limit)
      .subscribe((data) => {
        this.page = data['page'];
        this.nextPage = data['nextPage'];
        this.countAssignments = data['totalDocs'];
        this.assignments = this.assignments.concat(data['docs']);
      });
  }

  ngAfterViewInit() {
    console.log('After view init');
    this.scroller
      .elementScrolled()
      .pipe(
        // on transforme les evenements en distances par rapport au bas du scroll
        map((e) => {
          return this.scroller.measureScrollOffset('bottom');
        }),
        tap((val) => {
          console.log(val);
        }),
        pairwise(),
        filter(([y1, y2]) => {
          return y2 < y1 && y2 < 140;
        }),
        throttleTime(200) // on n'enverra un subscribe que toutes les 200ms (on ignorera les evenements entre...)
      )
      .subscribe((_) => {
        console.log(
          "...Dans subscribe du scroller, je charge plus d'assignments"
        );
        this.ngZone.run(() => {
          //this.addMoreAssignments();
          this.getAssignments(); // déjà prêt car nextPage re-initialisé à chaque requête
        });
      });
  }

  assignmentClique(assignment) {
    this.assignmentSelectionne = assignment;
  }
  /*
  onNouvelAssignment(event:Assignment) {
    //this.assignments.push(event);
    this.assignmentsService.addAssignment(event)
    .subscribe(message => {
      console.log("message");
      this.formVisible = false; // on veut voir la liste avec le nouvel assignment
    })
  }
  */

  peuplerBD() {
    // Version Taoufik qui ne renvoie pas un Observable
    //this.assignmentsService.peuplerBD();

    // Version William qui renvoie un Observable une fois tous les inserts faits
    this.assignmentsService.peuplerBDJoin().subscribe((message) => {
      this._snackBar.open('La base de données a été peuplée', "Fermer", { duration: 3000 });

    });
  }

  getPortrait(assignment: Assignment): string {
    if (assignment.image === "null") {
      var genre = ""
      var idStr = assignment.id.toString()
  
      if ( Number(idStr[0]) < 5) {
        genre = "men"
      } else {
        genre = "women"
      }
      let nb;

      if(idStr[1] != "0" ){
        nb = idStr[1] + idStr[2]
      } else {
        nb = idStr[2] + idStr[1]
      }
      
      assignment.image = "https://randomuser.me/api/portraits/" + genre + "/" + nb + ".jpg"
      console.log(assignment.image)
    }
    return "background-image: url( '" + assignment.image + "'); background-size: cover;";
  }

  isLogin(): boolean {
    let result = false;
    this.authService.isLogin().subscribe(val => { result = val; })
    return result
  }

  checkLogin() {
    if (!this.isLogin()) {
      this._snackBar.open("Vous devez être connecté pour ajouter un assignment", "Fermer", { duration: 3000 });
    }
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
