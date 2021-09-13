import { IonicModule } from '@ionic/angular';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewsPage } from './news.page';
import { NewsPageRoutingModule } from './news-routing.module';
import { CommentComponent } from '../comment/comment.component';
import { CommentSenderComponent } from '../comment-sender/comment-sender.component';
import { BignumPipe } from '../bignum.pipe';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    NewsPageRoutingModule
  ],
  declarations: [
    NewsPage,
    CommentComponent,
    CommentSenderComponent,
    BignumPipe,
  ]
})
export class NewsPageModule {}
