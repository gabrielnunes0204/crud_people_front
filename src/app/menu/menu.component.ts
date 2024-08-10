import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RequestService } from '../services/request.service';
import { FormsModule } from '@angular/forms';
import { Person } from '../interfaces/person.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {

  @Output() peoplesUpdated = new EventEmitter<Person[]>();

  peoples: Person[] = [];
  param: string = '';

  constructor(private service: RequestService) { }

  ngOnInit(): void {
    this.peoples = [];
  }

  sendRequestByCpf() {
    let paramsUrl = '';

    if (this.param.length < 11) {
      alert('Informe os 11 caracteres do CPF.');
    } else {
      paramsUrl = '/' + this.param;

      this.service.requestGetByCpf(paramsUrl).subscribe({
        next: (response: Person) => {
          if (response.id == null || response.id == undefined) {
            alert('Nenhum resultado encontrado.');
          } else {
            this.peoples.push(response);
            this.peoplesUpdated.emit(this.peoples);
          }
        },
        error: (error: any) => {
          console.error('Error:', error);
        },
        complete: () => {
          this.peoples = [];
        }
      });
    }
  }

  sendRequestGetAll() {
    this.param = '';

    this.service.requestGet('').subscribe({
      next: (response: Person[]) => {
        this.peoplesUpdated.emit(response);
      },
      error: (error: any) => {
        console.error('Error:', error);
      },
      complete: () => { }
    });
  }
}
