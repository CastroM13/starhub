import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChannelsService {
  private readonly api: string = 'http://vgstudio.servegame.com:3000/';

  constructor(private http: HttpClient) { }

  getChannels() {
    return this.http.get(this.api+'channels');
  }

}
