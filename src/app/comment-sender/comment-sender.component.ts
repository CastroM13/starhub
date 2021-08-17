import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'comment-sender',
  templateUrl: './comment-sender.component.html',
  styleUrls: ['./comment-sender.component.scss'],
})
export class CommentSenderComponent implements OnInit {
  @Input() user;
  constructor() { }

  ngOnInit() {}

}
