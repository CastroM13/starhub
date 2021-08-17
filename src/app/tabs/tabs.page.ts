import { Component, OnInit } from '@angular/core';
import { MenuController, ToastController } from '@ionic/angular';
import { Storage } from '@capacitor/storage';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  user: any;
  userLogin: any = {
    user: '',
    password: '',
  };
  temaEscuro: boolean = JSON.parse(localStorage.getItem("temaEscuro"));
  constructor(private menuController: MenuController, private toastController: ToastController, private service: AuthService, private userService: UserService) {}

  async ngOnInit() {
    console.log(this.user);
  }

  async authWarning(config) {
    const toast = await this.toastController.create(config);
    await toast.present();
  }

  setToken = async (id) => {
    await Storage.set({
      key: 'token',
      value: id,
    });
  };

  logoff = () => {
    this.removeToken();
    this.user = null;
    this.closeProfile();
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
  }

  login = () => {
    console.log(this.userLogin);
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
          console.log('token: ', dados.token);
          if (dados && dados.token) {
            this.setToken(dados.token);
            this.userService.getUserInfo(dados.token)
              .subscribe((info) => {
                console.log(info)
                this.user = info;
              })
            this.closeProfile();
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
    console.log(this.userLogin);
  }
  
  checkToken = async () => {
    const { value } = await Storage.get({ key: 'token' });
    return value;
  };
  
  removeToken = async () => {
    await Storage.remove({ key: 'token' });
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
    localStorage.setItem("temaEscuro", JSON.stringify(this.temaEscuro));
    document.body.classList.toggle('dark', this.temaEscuro);
  }
}
