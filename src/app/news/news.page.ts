import { Component, OnInit } from '@angular/core';
import { NewsService } from '../services/news.service';
import { Browser } from '@capacitor/browser';
import { Share } from '@capacitor/share';
import { SortbydatePipe } from '../sortbydate.pipe';
import { Storage } from '@capacitor/storage';
import { UserService } from '../services/user.service';
import { ToastController } from '@ionic/angular';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-news',
  templateUrl: 'news.page.html',
  styleUrls: ['news.page.scss']
})
export class NewsPage implements OnInit {
  user: any;
  token: any;
  news: any = [];
  id: string = uuidv4();
  selectedFilterOptions: Array<string> = [
    'Adrenaline',
    'Jovem Nerd',
  ];
  filterOptions: Array<string> = [
    'Jovem Nerd',
    'Omelete',
    'Adrenaline',
  ];

  constructor(private service: NewsService, private userService: UserService, private toastController: ToastController) {
  }

  async ngOnInit() {
    const { value } = await Storage.get({ key: 'token' });
    this.token = value;
    this.userService.getUserInfo(this.token)
      .subscribe((info) => {
        this.user = info;
      });
  }

 like(item) {
    if (item.likes.includes(Math.floor(this.token))) {
      console.log('NÃO GOSTEI');
      item.likes.splice(item.likes.indexOf(Math.floor(this.token)), 1);
      this.service.dislikePost(encodeURIComponent(item.url), Math.floor(this.token))
        .subscribe(e => console.log(e));
    } else {
      console.log('GOSTEI');
      item.likes.push(Math.floor(this.token));
      this.service.likePost(encodeURIComponent(item.url), Math.floor(this.token))
        .subscribe(e => console.log(e));
    }
  }

  contains(param) {
    return this.selectedFilterOptions.filter(e => e === param);
  }

  seeSaw() {
    this.getNews(this.selectedFilterOptions);
  }

  async share(item) {
    try {
      if (item) {
        await Share.share({
          title: item.title,
          text: item.origin,
          url: item.url,
          dialogTitle: 'Compartilhar com seus amigos!',
        });
      }
    }
    catch(err) {
      console.log(err);
    }
  }

  removeFilter(param) {
    this.selectedFilterOptions = this.selectedFilterOptions.filter(e => e !== param);
    this.getNews(this.selectedFilterOptions.filter(e => e !== param));
  }

  addComment(item, i) {
    if (item.comment !== '') {
      this.service.addComment(encodeURIComponent(this.news[i].url), item)
      .subscribe((result: any) => {
        console.log(result);
        if (result.Resposta === 'Sucesso') {
          const newComments = this.news[i].comments;
          newComments.push(item);
          this.news[i].comments = newComments;
        } else {
          this.toast({
            message: result.Resposta,
            position: 'bottom',
            duration: 900,
            color: 'danger',
            buttons: [
              {
                text: 'OK',
                role: 'cancel'
              }
            ]
          });
        }
      });
    } else {
      this.toast({
        message: 'O comentário não pode estar vazio! 😅',
        position: 'bottom',
        duration: 900,
        color: 'danger',
        buttons: [
          {
            text: 'OK',
            role: 'cancel'
          }
        ]
      });
    }
  }

  async toast(config) {
    const toast = await this.toastController.create(config);
    await toast.present();
  }

  getCommentOccurrences(item) {
    return ((JSON.stringify(item.comments) || '').match(/Text/g) || []).length;
  }

  getLiked(item) {
    let result;
    if (this.user && item.likes) {
      result = item.likes.includes(this.user.UserID);
    } else {
      result = false;
    }
    return result;
  }

  async getComments(postID) {
    await this.service.getStats(postID)
      .subscribe((result: Array<any>) => result);
  }

  showComments(i) {
    document.getElementById('toggleComments-on-'+i).style.display = 'none';
    document.getElementById('toggleComments-off-'+i).style.display = 'block';
    document.getElementById('comment-'+i).style.height = 'auto';
    document.getElementById('comment-'+i).style.display = 'block';
  }

  clearComments(i) {
    document.getElementById('toggleComments-on-'+i).style.display = 'block';
    document.getElementById('toggleComments-off-'+i).style.display = 'none';
    document.getElementById('comment-'+i).style.height = '0px';
    document.getElementById('comment-'+i).style.display = 'none';
  }

  getNews(param: string[]) {
    this.news = [];
    param.map(item => {
      this.loading(true);
      this.service.getNews(item)
        .subscribe(async (result: any) => {
          const arr = this.news;
            localStorage.setItem('cachedNews', JSON.stringify(result));
            result.map(async obj=> (
              await this.service.getStats(encodeURIComponent(obj.url))
                .subscribe((stats: any) => {
                  arr.push({ ...obj,
                    origin : item,
                    comments: stats.comments || [],
                    likes: stats.likes || []
                  });
                  const sortPipe = new SortbydatePipe();
                  this.news = sortPipe.transform(arr);
              })
            ));
          this.loading(false);
        },
        async (err: any) => {
          const arr = this.news;
          const result = JSON.parse(localStorage.getItem('cachedNews'));
          result.map(async obj=> {
            arr.push({ ...obj,
              origin : item,
              comments: [],
              likes: [],
              offlineMode: true
            });
            const sortPipe = new SortbydatePipe();
            this.news = sortPipe.transform(arr);
          });
          this.loading(false);
        });
    });
  }

  loading(load: boolean) {
    if (load) {
      document.getElementById('body').style.overflow = 'hidden';
      document.getElementById('body').style.height = '100%';
      document.getElementById('loading').className = 'loading';
    } else {
      document.getElementById('body').style.overflow = 'scroll';
      document.getElementById('body').style.height = 'auto';
      document.getElementById('loading').className = 'invisible';
    }
  }

  openCapacitorSite = async (url) => {
    await Browser.open({ url });
  };

  ionViewWillEnter() {
    this.getNews(this.selectedFilterOptions);
  }

  openFrame(src, target) {
    const obj = document.createElement('iframe');
    obj.id = 'frame-'+target;
    obj.src = src;
    obj.width = document.getElementById('card-'+target).offsetWidth + 'px';
    obj.height = '150%';
    obj.frameBorder = '0';
    obj.marginHeight='0';
    obj.marginWidth='0';
    obj.style.overflow = 'hidden';
    document.getElementById('news-card-'+target).appendChild(obj);
    document.getElementById('card-'+target).style.height = '70vh';
    document.getElementById('inner-card-'+target).style.display = 'none';
    document.getElementById('inner-card-'+target).style.display = 'none';
    document.getElementById('action-remove-'+target).style.display = 'initial';
    document.getElementById('actions-'+target).style.position = 'absolute';
    document.getElementById('actions-'+target).style.bottom = '0';
  }

  closeFrame(target) {
    document.getElementById('frame-'+target).remove();
    document.getElementById('card-'+target).style.height = 'auto';
    document.getElementById('inner-card-'+target).style.display = 'block';
    document.getElementById('actions-'+target).style.position = 'initial';
    document.getElementById('action-remove-'+target).style.display = 'none';
  }
}
