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
  showComments: boolean = false;
  constructor() { }

  getCommentOcurrences(item) {
    return (JSON.stringify(item).match(/comment/g) || []).length;
  }

  activeCommentPlus() {
    this.showComments = !this.showComments;
  }

  ngOnInit() {}

}
