import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Person } from '../interfaces/person.model';
import { SimpleResponse } from '../interfaces/simplesResponse.model';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private baseUrl = environment.backendUrl;

  constructor(private http: HttpClient) { }

  requestGet(param: string): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.baseUrl}` + param);
  }

  requestGetByCpf(param: string): Observable<Person> {
    return this.http.get<Person>(`${this.baseUrl}` + param);
  }

  requestPost(data: Person): Observable<SimpleResponse> {
    return this.http.post<SimpleResponse>(`${this.baseUrl}`, data);
  }

  requestPut(data: Person): Observable<SimpleResponse> {
    return this.http.put<SimpleResponse>(`${this.baseUrl}`, data);
  }

  requestDelete(id: string): Observable<SimpleResponse> {
    return this.http.delete<SimpleResponse>(`${this.baseUrl}/${id}`);
  }
}
