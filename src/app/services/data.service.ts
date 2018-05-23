import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  storeTasks(task: any) {
    this.http.post('https://flipkod-cc4b0.firebaseio.com/', task);
  }
}
