import { IonicModule } from '@ionic/angular';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { Tab1PageRoutingModule } from './tab1-routing.module';
import { CommentComponent } from '../comment/comment.component';
import { CommentSenderComponent } from '../comment-sender/comment-sender.component';
import { BignumPipe } from '../bignum.pipe';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule
  ],
  declarations: [
    Tab1Page,
    CommentComponent,
    CommentSenderComponent,
    BignumPipe,
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class Tab1PageModule {}
