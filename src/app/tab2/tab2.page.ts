import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonContent, PopoverController } from '@ionic/angular';
import { PopoverComponent } from './popover/popover.component';
import { Socket } from 'ngx-socket-io';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, AfterViewInit {
  @ViewChild('messageContent') messageContent: IonContent;
  messages = [];
  userInfo: any;
  constructor(public popoverController: PopoverController, private socket: Socket) {}

  ngAfterViewInit()  {
    this.messageContent.scrollToBottom(300);
  }

  async ngOnInit() {
    const { value } = await Storage.get({ key: 'userInfo' });
    this.userInfo = JSON.parse(value);
    this.socket.on('previousMessages', data => {
      for (const msg of data) {
        this.renderMessage({
          id: msg.UserID,
          name: msg.DisplayName || msg.LoginName,
          profileImage: msg.ProfileImage,
          time: msg.Date,
          text: msg.Message,
        });
      }
    });
    this.socket.on('receivedMessage', data => {
      this.renderMessage(data);
    });
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'custom-popover',
      event: ev,
      translucent: true,
      showBackdrop: false,
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  renderMessage(msg) {
    this.messages.push(msg);
  }

  addMessage(form) {
    if (form.message.value) {
      const now = new Date();
      const message = form.message.value;
      form.message.value = '';
      console.log(this.userInfo);
      const msg = {
        id: this.userInfo.UserID,
        name: this.userInfo.DisplayName || this.userInfo.LoginName,
        profileImage: this.userInfo.ProfileImage,
        time: now.getHours() + ':' + now.getMinutes(),
        text: message,
      };
      this.socket.emit('sendMessage', msg);
      this.renderMessage(msg);
    }
  }

  channelShift(event) {
    console.log(event);
    this.presentPopover(event);
  }

  focused() {
    document.getElementsByTagName('ion-tab-bar')[0].style.display = 'none';
  }

  blurred() {
    document.getElementsByTagName('ion-tab-bar')[0].style.display = 'inherit';
  }

}
