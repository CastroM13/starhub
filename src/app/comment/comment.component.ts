import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  @Input() user: any;
  @Input() individualRender;
  @Input() responseOf;
  temaEscuro: boolean = JSON.parse(localStorage.getItem('temaEscuro'));
  showComments = false;
  constructor() { }

  getCommentOccurrences(item) {
    return (JSON.stringify(item).match(/Text/g) || []).length;
  }

  activeCommentPlus() {
    this.showComments = !this.showComments;
  }

  ngOnInit() {}

}
