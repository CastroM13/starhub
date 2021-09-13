import { Component, OnInit } from '@angular/core';
import { MenuController, ToastController } from '@ionic/angular';
import { Storage } from '@capacitor/storage';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  activePage = 'login';
  validation = '';
  showPassword = false;
  user: any;
  userLogin: any = {
    user: '',
    password: '',
  };
  userRegistration: any = {
    user: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
  temaEscuro: boolean = JSON.parse(localStorage.getItem('temaEscuro'));
  news = [
    {
      route: 'news',
      icon: 'newspaper-outline',
      name: 'Notícias',
      badgeCount: 0
    },
    {
      route: 'tab2',
      icon: 'chatbubbles-outline',
      name: 'Canais',
      badgeCount: 0
    },
    {
      route: 'tab3',
      icon: 'pricetags-outline',
      name: 'Rastreador',
      badgeCount: 0
    },
  ];

  constructor(
    private menuController: MenuController,
    private toastController: ToastController,
    private service: AuthService,
    private userService: UserService,
    private router: Router,
    private socket: Socket) {}

  async ngOnInit() {
    this.socket.on('receivedNotification', () => {
      console.log(!window.location.href.includes('tab2'));
      if (!window.location.href.includes('tab2')) {
        this.news[this.findWithAttr(this.news, 'name', 'Canais')].badgeCount += 1;
      }
    });
    const { value } = await Storage.get({ key: 'token' });
    if (value) {
      this.userService.getUserInfo(value)
        .subscribe((info: any) => {
          console.log(info);
          this.user = info;
          Storage.set({
            key: 'userInfo',
            value: JSON.stringify(info),
          });
          this.activePage = 'user';
          if (!(info?.Active)) {
            this.activePage = 'confirmation';
          }
        });
    }
  }

  resetNotifications(name) {
    this.news[this.findWithAttr(this.news, 'name', name)].badgeCount = 0;
  }

  findWithAttr(array, attr, value) {
    for(let i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}

  async authWarning(config) {
    const toast = await this.toastController.create(config);
    await toast.present();
  }

  changeRoute(route) {
    console.log(route);
    this.router.navigate(['/tabs/' + route]);
  }

  changeDisplayName(e) {
    this.userRegistration.displayName = e.target?.value as HTMLInputElement;
  }

  setToken = async (id) => {
    await Storage.set({
      key: 'token',
      value: id,
    });
  };

  enter = (event) => {
    if(event.key === 'Enter') {
      this.completeRegistration();
    }
  };

  logoff = () => {
    this.removeToken();
    this.user = null;
    this.closeProfile();
    window.location.reload();
    this.authWarning({
      message: 'Deslogado com sucesso!',
      position: 'bottom',
      duration: 900,
      color: 'success',
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });
  };

  login = () => {
    if (!this.userLogin.user || !this.userLogin.password) {
      this.authWarning({
        message: 'Digite usuário e senha!',
        position: 'bottom',
        duration: 900,
        color: 'warning',
        buttons: [
          {
            text: 'OK',
            role: 'cancel'
          }
        ]
      });
    } else {
      this.service.postLogin({user: this.userLogin.user, password: this.userLogin.password})
        .subscribe((dados: {token}) => {
          if (dados && dados.token) {
            this.setToken(dados.token);
            this.userService.getUserInfo(dados.token)
              .subscribe((info) => {
                this.user = info;
              });
            this.closeProfile();
            this.activePage = 'user';
            window.location.reload();
            this.authWarning({
              message: 'Sucesso!',
              position: 'bottom',
              duration: 900,
              color: 'success',
              buttons: [
                {
                  text: 'OK',
                  role: 'cancel'
                }
              ]
            });
          } else {
            this.authWarning({
              message: 'Erro de Autenticação!',
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
    }
  };

  completeRegistration = async () => {
    const { value } = await Storage.get({ key: 'token' });
    if (this.validation !== '') {
      this.service.completeRegistration({userToken: value, emailToken: this.validation})
      .subscribe((dados: any) => {
        console.log(dados.Resposta);
        if (dados.Resposta === 'Sucesso') {
          this.authWarning({
            message: 'Sucesso!',
            position: 'bottom',
            duration: 900,
            color: 'success',
            buttons: [
              {
                text: 'OK',
                role: 'cancel'
              }
            ]
          });
        } else {
          this.authWarning({
            message: dados.Resposta,
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
        this.activePage = 'user';
      });
    } else {
      this.authWarning({
        message: 'Erro: Digite o Token',
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
  };

  registrate = () => {
    if (!this.userRegistration.user || !(this.userRegistration.password) || !(this.userRegistration.email)) {
      this.authWarning({
        message: 'Preencha todos os campos obrigatórios: (*)',
        position: 'bottom',
        duration: 900,
        color: 'warning',
        buttons: [
          {
            text: 'OK',
            role: 'cancel'
          }
        ]
      });
    } else if (!(this.userRegistration.password === this.userRegistration.confirmPassword)) {
      this.authWarning({
        message: 'As senhas não correspondem!',
        position: 'bottom',
        duration: 900,
        color: 'warning',
        buttons: [
          {
            text: 'OK',
            role: 'cancel'
          }
        ]
      });
    } else {
      this.service.postRegistration(
        {
          user: this.userRegistration.user,
          displayName: this.userRegistration.displayName,
          password: this.userRegistration.password
        }
      )
        .subscribe((dados: any) => {
          console.log(dados);
          if (dados && dados.token) {
            this.setToken(dados.token);
            this.userService.getUserInfo(dados.token)
              .subscribe((info) => {
                this.user = info;
              });
              this.activePage = 'confirmation';
          } else {
            this.authWarning({
              message: dados.response,
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
    }
  };

  checkToken = async () => {
    const { value } = await Storage.get({ key: 'token' });
    return value;
  };

  removeToken = async () => {
    await Storage.remove({ key: 'token' });
    await Storage.remove({ key: 'userInfo' });
  };

  async openMenu() {
    await this.menuController.enable(true, 'menu');
    await this.menuController.open('menu');
  }

  async closeMenu() {
    await this.menuController.close('menu');
  }

  async openProfile() {
    await this.menuController.enable(true, 'profile');
    await this.menuController.open('profile');
  }

  async closeProfile() {
    await this.menuController.close('profile');
  }

  changeTheme() {
    localStorage.setItem('temaEscuro', JSON.stringify(this.temaEscuro));
    document.body.classList.toggle('dark', this.temaEscuro);
  }
}
