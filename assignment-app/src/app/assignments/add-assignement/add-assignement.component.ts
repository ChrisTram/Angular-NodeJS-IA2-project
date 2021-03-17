import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssignmentsService } from 'app/shared/assignments.service';
import { Assignment } from '../assignment.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-add-assignement',
  templateUrl: './add-assignement.component.html',
  styleUrls: ['./add-assignement.component.css']
})
export class AddAssignementComponent implements OnInit {
  // form
  nomDevoir: string;
  dateRendu: Date;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private assignmentsService: AssignmentsService,
    private router: Router, private _formBuilder: FormBuilder, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      nom: ['', Validators.required],
      matiere: ['', Validators.required],
      photo: ['']
    });
    this.secondFormGroup = this._formBuilder.group({
      auteur: [''],
      dateDeRendu: [''],
      note: ['',[Validators.pattern("^[0-9]*$"),Validators.maxLength(2)]],
      remarques: ['']

    });
  }

  submitStepperForm() {
    console.log("it works")
    console.log(this.firstFormGroup.valid);
    console.log(this.secondFormGroup.valid);

    if(this.firstFormGroup.valid && this.secondFormGroup.valid) {
      const newAssignment = new Assignment();

      newAssignment.id = Math.ceil(Math.random() * 100000);
  
      newAssignment.nom = this.firstFormGroup.value.nom;
      newAssignment.matiere = this.firstFormGroup.value.matiere;
      newAssignment.image = this.firstFormGroup.value.photo;
  
      newAssignment.auteur = this.secondFormGroup.value.auteur;
      newAssignment.dateDeRendu = this.secondFormGroup.value.dateDeRendu;
      newAssignment.note = this.secondFormGroup.value.note;
      newAssignment.remarques = this.secondFormGroup.value.remarques;
  
      if(newAssignment.note != null) {
        newAssignment.rendu = true
      } else {
        newAssignment.rendu = false
      }
  
      this.assignmentsService.addAssignment(newAssignment)
        .subscribe(message => {
          this._snackBar.open('Formulaire ajouté : ', newAssignment.nom, { duration: 2000 });
  
        })
    } else {
      this._snackBar.open('Erreur dans la formulaire ',"Fermer", { duration: 3000 });
    }
    



  }

}
