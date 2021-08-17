import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API: string = 'http://localhost:3000/';

  constructor(private http: HttpClient) { }

  postLogin(body) {
    return this.http.post(this.API+'login', body);
  }

}
