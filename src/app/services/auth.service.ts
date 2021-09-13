import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly api: string = 'http://vgstudio.servegame.com:3000/';

  constructor(private http: HttpClient) { }

  postLogin(body) {
    return this.http.post(this.api+'login', body);
  }

  postRegistration(body) {
    return this.http.post(this.api+'register', body);
  }

  completeRegistration(body) {
    return this.http.post(this.api+'validate', body);
  }

}
