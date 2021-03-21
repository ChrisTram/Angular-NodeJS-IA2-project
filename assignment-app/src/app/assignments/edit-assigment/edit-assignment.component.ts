import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from 'app/shared/assignments.service';
import { Assignment } from '../assignment.model';

interface Matiere {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-edit-assignment',
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.css'],
})
export class EditAssignmentComponent implements OnInit {
  assignment: Assignment;
  formGroup: FormGroup;

  matieres: Matiere[] = [
    { value: 'Histoire', viewValue: 'Histoire' },
    { value: 'Computer Vision', viewValue: 'Computer Vision' },
    { value: 'BD', viewValue: 'BD' },
    { value: 'WEB', viewValue: 'WEB' },
    { value: 'JAVA', viewValue: 'JAVA' },
    { value: 'Angular', viewValue: 'Angular' },
    { value: 'Anglais', viewValue: 'Anglais' },
    { value: 'Machine Learning', viewValue: 'Machine Learning' },
    { value: 'Deep Learning', viewValue: 'Deep Learning' },
    { value: 'SVT', viewValue: 'SVT' },
    { value: 'Maths', viewValue: 'Maths' },
    { value: 'SI', viewValue: 'SI' },
    { value: 'Compta', viewValue: 'Compta' },

  ];

  constructor(
    private assignmentsService: AssignmentsService,
    private route: ActivatedRoute,
    private router: Router,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getAssignment();



  }

  getAssignment() {
    // on récupère l'id dans le snapshot passé par le routeur
    // le "+" force l'id de type string en "number"
    const id = +this.route.snapshot.params.id;
    this.assignmentsService.getAssignment(id).subscribe((assignment) => {
      this.assignment = assignment;
      console.log('Query Params : ');
      console.log(this.route.snapshot.queryParams);
      console.log('fragment : ' + this.route.snapshot.fragment);

      this.formGroup = this._formBuilder.group({
        nom: [this.assignment.nom, Validators.required],
        matiere: [this.assignment.matiere, Validators.required],
        photo: [this.assignment.image],
        auteur: [this.assignment.auteur],
        dateDeRendu: [this.assignment.dateDeRendu],
        note: [this.assignment.note, [Validators.pattern("^[0-9]*$"), Validators.maxLength(2)]],
        remarques: [this.assignment.remarques]
      });
    });
  }

  onSaveAssignment() {

    this.assignment.nom = this.formGroup.value.nom;
    this.assignment.matiere = this.formGroup.value.matiere;
    this.assignment.image = this.formGroup.value.photo;
    this.assignment.auteur = this.formGroup.value.auteur;
    this.assignment.dateDeRendu = this.formGroup.value.dateDeRendu;
    this.assignment.note = this.formGroup.value.note;
    this.assignment.remarques = this.formGroup.value.remarques;

    console.log(this.formGroup.value.note)
    if (typeof this.formGroup.value.note === 'number') {
      this.assignment.rendu = true
      this.assignment.note = Number(this.formGroup.value.note);
    } else {
      this.assignment.rendu = false
    }

    this.assignmentsService
      .updateAssignment(this.assignment)
      .subscribe((message) => {
        console.log(message);

        // navigation vers la home page QUE QUAND LA REPONSE
        // DU SERVEUR EST ARRIVEE, c'est-à-dire que l'assignment a bien
        // été modifié dans la base dans le cloud
        this.router.navigate(['/home']);
      });
  }
}
