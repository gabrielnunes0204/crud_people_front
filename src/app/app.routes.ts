import { Routes } from '@angular/router';
import { PersonListComponent } from './person-list/person-list.component';
import { PersonFormComponent } from './person-form/person-form.component';

export const routes: Routes = [
  { path: "", component: PersonListComponent },
  { path: "form", component: PersonFormComponent }
];
