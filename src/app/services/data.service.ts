import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Person } from '../interfaces/person.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();

  setNewPerson(data: Person) {
    this.dataSubject.next(data);
  }
}