import { Component, OnInit } from '@angular/core';
import { NewsService } from '../services/news.service';
import { Browser } from '@capacitor/browser';
import { Share } from '@capacitor/share';
import { SortbydatePipe } from '../sortbydate.pipe';
import { Storage } from '@capacitor/storage';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  user: any;
  news: any = [];
  selectedFilterOptions: Array<string> = [
    "Adrenaline",
    "Jovem Nerd",
  ];
  filterOptions: Array<string> = [
    "Jovem Nerd",
    "Omelete",
    "Adrenaline",
  ];

  constructor(private service: NewsService, private userService: UserService) {}

  async ngOnInit() {
    const { value } = await Storage.get({ key: 'token' });
    this.userService.getUserInfo(value)
      .subscribe((info) => {
        this.user = info;
      });
  }

  contains(param) {
    return this.selectedFilterOptions.filter(e => e === param);
  }

  seeSaw() {
    this.replaceNews(this.selectedFilterOptions);
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
    this.selectedFilterOptions = this.selectedFilterOptions.filter(e => e !== param)
    this.replaceNews(this.selectedFilterOptions.filter(e => e !== param));
  }

  replaceNews(param: string[]) {
    let arr = [];
    param.map(item => {
      this.loading(true);
      this.service.getNews(item)
      .subscribe(async (result: Array<Object>) => {
        await this.service.getComments(0)
        .subscribe((comments: Array<Object>) => {
          result.map(async obj=> (
            arr.push({ ...obj, 
              origin : item,
              comments: comments
            })));
        });
        this.news = arr;
        this.loading(false);
      })
    })
  }

  getCommentOcurrences(item) {
    return ((JSON.stringify(item.comments) || "").match(/comment/g) || []).length;
  }

  async getComments(postID) {
    await this.service.getComments(postID)
      .subscribe((result: Array<Object>) => {
        return result;
      });
  }

  showComments(i) {
    document.getElementById('comment-'+i).style.height = "auto";
    document.getElementById('comment-'+i).style.display = "auto";
  }

  clearComments(i) {
    document.getElementById('comment-'+i).style.height = "0px";
    document.getElementById('comment-'+i).style.display = "none";
  }

  getNews(param: string[]) {
    this.news = [];
    param.map(item => {
      this.loading(true);
      this.service.getNews(item)
        .subscribe(async (result: Array<Object>) => {
          let arr = this.news;
          await this.service.getComments(0)
          .subscribe((comments: Array<Object>) => {
            result.map(async obj=> (
              arr.push({ ...obj, 
                origin : item,
                comments: comments
              })));
              var sortPipe = new SortbydatePipe();
              this.news = sortPipe.transform(arr);
          });
          this.loading(false);
        });
    })
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
    await Browser.open({ url: url });
  };

  ionViewWillEnter() {
    this.getNews(this.selectedFilterOptions)
  }

  openFrame(src, target) {
    var obj = document.createElement("iframe");
    obj.id = 'frame-'+target;
    obj.src = src;
    obj.width = document.getElementById('card-'+target).offsetWidth + "px";
    obj.height = '150%';
    obj.frameBorder = "0";
    obj.marginHeight="0";
    obj.marginWidth="0";
    obj.style.overflow = "hidden";
    document.getElementById('news-card-'+target).appendChild(obj);
    document.getElementById('card-'+target).style.height = '70vh';
    document.getElementById('inner-card-'+target).style.display = 'none';
    document.getElementById('inner-card-'+target).style.display = 'none';
    document.getElementById('action-remove-'+target).style.display = 'initial';
    document.getElementById('actions-'+target).style.position = 'absolute';
    document.getElementById('actions-'+target).style.bottom = '0';
  }

  closeFrame (target) {
    document.getElementById('frame-'+target).remove();
    document.getElementById('card-'+target).style.height = 'auto';
    document.getElementById('inner-card-'+target).style.display = 'block';
    document.getElementById('actions-'+target).style.position = 'initial';
    document.getElementById('action-remove-'+target).style.display = 'none';
  }
}
