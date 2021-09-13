import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { PopoverComponent } from './popover/popover.component';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab2PageRoutingModule,
    SocketIoModule.forRoot(config)
  ],
  declarations: [Tab2Page, PopoverComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab2PageModule {}
