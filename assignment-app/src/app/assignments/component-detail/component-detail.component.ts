import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/shared/auth.service';
import { AssignmentsService } from 'app/shared/assignments.service';
import { Assignment } from '../assignment.model';

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
    private authService: AuthService) { }

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
        this.assignementTransmis = null;
        this.router.navigate(["/home"]);
      });
  }

  onAssignementRendu() {
    this.assignementTransmis.rendu = true;
    this.assignmentsService.updateAssignment(this.assignementTransmis)
      .subscribe(message => {
        console.log("assignment mis à jour - " + message);
        this.router.navigate(["/home"]);
      });
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
    return result
  }
}
