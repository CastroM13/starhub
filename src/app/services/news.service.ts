import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private readonly API: string = 'http://localhost:3000/';
  
  constructor(private http: HttpClient) { }

  getNews(param) {
    return this.http.get(this.API+'news/'+param);
  }

  getComments(postID) {
    return this.http.get(this.API+'comments/'+postID);
  }

}
