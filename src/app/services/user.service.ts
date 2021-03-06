import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly api: string = 'http://vgstudio.servegame.com:3000/';

  constructor(private http: HttpClient) { }

  getUserInfo(id) {
    return this.http.get(this.api+'user/'+id);
  }

}
