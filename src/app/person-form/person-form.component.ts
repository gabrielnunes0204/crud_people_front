import { Component, OnInit } from '@angular/core';
import { RequestService } from '../services/request.service';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';
import { Person } from '../interfaces/person.model';
import { SimpleResponse } from '../interfaces/simplesResponse.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-person-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ModalComponent],
  templateUrl: './person-form.component.html',
  styleUrl: './person-form.component.css'
})
export class PersonFormComponent implements OnInit {

  person: Person;
  title: string = '';
  description: string = '';

  name: string = '';
  cpf: string = '';
  dateOfBirth: string = '';

  showMessage: boolean = false;
  showValidated: boolean = false;
  isUpdate: boolean = false;
  personToUpdate: any;

  constructor(
    private service: RequestService,
    private router: Router,
    private data: DataService
  ) {
    this.person = { id: 0, name: '', cpf: '', dateOfBirth: '' };
  }

  ngOnInit(): void {
    this.clearFields();
    this.showMessage = false;
    this.showValidated = false;
    this.isUpdate = false;

    this.data.data$.subscribe(data => {
      this.personToUpdate = data;
    });

    if (this.personToUpdate) {
      this.isUpdate = true;
      this.name = this.personToUpdate.name;
      this.cpf = this.personToUpdate.cpf;
      this.dateOfBirth = this.personToUpdate.dateOfBirth;
    }
  }

  sendRequestPut() {
    this.service.requestPut(this.person).subscribe({
      next: (response: SimpleResponse) => {
        if (response.isSuccess) {
          this.title = 'Sucesso';
          this.description = response.message;
        } else {
          this.title = 'Erro';
        }
      },
      error: (error: any) => {
        console.error('Error:', error);
      },
      complete: () => {
        this.name = '';
        this.cpf = '';
        this.dateOfBirth = '';

        this.showMessage = true;
        setTimeout(() => {
          this.showMessage = false;
          this.router.navigate(['']);
        }, 3000);
      }
    });
  }

  sendRequestPost() {
    this.service.requestPost(this.person).subscribe({
      next: (response: SimpleResponse) => {
        if (response.isSuccess) {
          this.title = 'Sucesso';
          this.description = response.message;
        } else {
          this.title = 'Erro';
        }
      },
      error: (error: any) => {
        console.error('Error:', error);
      },
      complete: () => {
        this.clearFields();

        this.showMessage = true;
        setTimeout(() => {
          this.showMessage = false;
          this.router.navigate(['']);
        }, 3000);
      }
    });
  }

  validateFields(): boolean {
    if (this.name == '' || this.cpf == '' || this.cpf.length < 11 || this.dateOfBirth == '') {
      return true;
    }

    return false;
  }

  checkOperation() {
    if (this.validateFields()) {
      this.title = 'Erro';
      this.description = 'Há campos preenchidos incorretamente.';
      this.showValidated = true;
      setInterval(() => {
        this.showValidated = false;
      }, 3000);
    } else {
      this.person.name = this.name;
      this.person.cpf = this.cpf;
      this.person.dateOfBirth = this.dateOfBirth;

      if (this.isUpdate) {
        this.person.id = this.personToUpdate.id;
        this.sendRequestPut();
      } else {
        this.sendRequestPost();
      }
    }
  }

  clearFields() {
    this.name = '';
    this.cpf = '';
    this.dateOfBirth = '';
  }
}
