import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RequestService } from '../services/request.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Person } from '../interfaces/person.model';
import { SimpleResponse } from '../interfaces/simplesResponse.model';
import { DataService } from '../services/data.service';
import { MenuComponent } from '../menu/menu.component';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-person-list',
  standalone: true,
  imports: [CommonModule, MenuComponent, RouterModule, ModalComponent],
  templateUrl: './person-list.component.html',
  styleUrl: './person-list.component.css'
})
export class PersonListComponent {

  @Input() peoples: Person[] = [];

  selectedRegistry: Person;
  title: string = '';
  description: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  showMessage: boolean = false;

  constructor(
    private service: RequestService,
    private datePipe: DatePipe,
    private router: Router,
    private data: DataService
  ) {
    this.selectedRegistry = { id: 0, name: '', cpf: '', dateOfBirth: '' };
  }

  ngOnInit(): void {
    this.sendRequestList();
    this.showMessage = false;
  }

  receiveUpdatePeoples(people: Person[]) {
    this.peoples = people;
  }

  onRadioChange(person: Person) {
    this.selectedRegistry = person;
  }

  sendRequestList() {
    this.showMessage = false;

    this.service.requestGet('').subscribe({
      next: (response: Person[]) => {
        this.peoples = response;
      },
      error: (error: any) => {
        console.error('Error:', error);
      },
      complete: () => { }
    });
  }

  sendRequestDelete() {
    this.service.requestDelete(this.selectedRegistry.id.toString()).subscribe({
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
        this.sendRequestList();
        this.showMessage = true;
        setTimeout(() => {
          this.showMessage = false;
        }, 3000);
      }
    });
  }

  sendRequestUpdate() {
    if (this.selectedRegistry) {
      this.data.setNewPerson(this.selectedRegistry);
      this.router.navigate(['/form']);
    }
  }

  confirmDelete() {
    if (window.confirm('Deseja realmente excluír esse registro?')) {
      this.sendRequestDelete();
    }
  }

  formateDate(data: string): string {
    return this.datePipe.transform(data, 'dd-MM-yyyy') || '';
  }

  getPaginatedPeoples(): Person[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.peoples.slice(startIndex, endIndex);
  }

  totalPages(): number {
    let calc: number = Math.ceil(this.peoples.length / this.itemsPerPage);
    if (calc == 0) {
      return 1;
    }
    return calc;
  }

  goToPage(page: number) {
    if (page > 0 && page <= this.totalPages()) {
      this.currentPage = page;
    }
  }
}
