import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private readonly api: string = 'http://vgstudio.servegame.com:3000/';

  constructor(private http: HttpClient) { }

  getNews(param) {
    return this.http.get(this.api+'news/'+param);
  }

  getStats(postID) {
    return this.http.get(this.api+'post/'+postID+'/stats');
  }

  addComment(postID, comment) {
    return this.http.post(this.api+'post/'+postID+'/comment', comment);
  }

  likePost(postID, token) {
    console.log(postID);
    return this.http.post(this.api+'post/'+postID+'/like', {token});
  }

  dislikePost(postID, token) {
    console.log(postID);
    return this.http.post(this.api+'post/'+postID+'/dislike', {token});
  }

}
