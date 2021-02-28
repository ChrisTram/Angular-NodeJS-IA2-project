import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AssignmentsComponent } from './assignments/assignments.component';
import { RenduDirective } from './shared/rendu.directive';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ComponentDetailComponent } from './assignments/component-detail/component-detail.component';
import { AddAssignementComponent } from './assignments/add-assignement/add-assignement.component';
import {RouterModule, Routes} from '@angular/router';
import { EditAssignmentComponent } from './assignments/edit-assigment/edit-assignment.component';
import { AuthGuard } from './shared/auth.guard';
import { HttpClientModule } from '@angular/common/http';
import {ScrollingModule} from '@angular/cdk/scrolling';

const routes:Routes = [
  {
    path:"",
    component:AssignmentsComponent
  },
  {
    path:"home",
    component:AssignmentsComponent
  },
  {
    path:"add",
    component:AddAssignementComponent
  },
  {
    path:"assignment/:id",
    component:ComponentDetailComponent
  },
  {
    path:"assignment/:id/edit",
    component:EditAssignmentComponent,
    canActivate: [AuthGuard]
  },
]

@NgModule({
  declarations: [
    AppComponent,
    AssignmentsComponent,
    RenduDirective,
    ComponentDetailComponent,
    AddAssignementComponent,
    EditAssignmentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule, MatIconModule, MatDividerModule,
    MatInputModule, MatFormFieldModule,
    MatDatepickerModule, MatNativeDateModule,
    MatListModule, MatCardModule, MatCheckboxModule,
    MatSlideToggleModule,
    FormsModule, HttpClientModule, ScrollingModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
