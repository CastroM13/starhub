import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'comment-sender',
  templateUrl: './comment-sender.component.html',
  styleUrls: ['./comment-sender.component.scss'],
})
export class CommentSenderComponent implements OnInit {
  @Input() id;
  @Input() user: any;
  @Input() senderID: any;
  @Output() addComment = new EventEmitter<object>();
  comment: string = '';
  constructor() { }

  ngOnInit() {}

  focus() {
    document.getElementById('comment-actions-' + this.id).style.height = '2.5em';
    document.getElementById('text-' + this.id).style.border = '1px solid rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.1)';
  }

  blur() {
    document.getElementById('comment-actions-' + this.id).style.height = '0em';
    document.getElementById('text-' + this.id).style.border = '1px solid rgba(var(--ion-text-color-rgb, 0, 0, 0), 0)';
  }

  async addNewComment(id) {
    if (this.comment) {
      this.addComment.emit({
        Text: this.comment,
        dislikes: [],
        likes: [],
        DisplayName: this.user.DisplayName,
        ID_User: this.senderID,
        LoginName: this.user.LoginName,
        ProfileImage: this.user.ProfileImage,
        ID_ResponseOf: null
      });
      this.comment = '';
    } else {
      document.getElementById(id).querySelector('div').querySelector('textarea').focus();
    }
  }

}
