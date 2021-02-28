import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import {Assignment} from '../assignment.model';

@Component({
  selector: 'app-add-assignement',
  templateUrl: './add-assignement.component.html',
  styleUrls: ['./add-assignement.component.css']
})
export class AddAssignementComponent implements OnInit {
  // form
  nomDevoir:string;
  dateRendu:Date;

  constructor(private assignmentsService:AssignmentsService,
              private router:Router) { }

  ngOnInit(): void {
  }
  onSubmit() {
    console.log("onSubmit")
    const newAssignment = new Assignment();

    newAssignment.nom = this.nomDevoir;
    newAssignment.dateDeRendu = this.dateRendu;
    newAssignment.rendu = false;
    newAssignment.id = Math.ceil(Math.random()*100000);


    //this.nouvelAssignment.emit(newAssignment);
    //this.assignments.push(newAssignment);
    this.assignmentsService.addAssignment(newAssignment)
    .subscribe(message => {
      console.log(message);
      //on veut re-afficher la page d'accueil avec la liste
      this.router.navigate(["/home"]);
    })
  }

}
