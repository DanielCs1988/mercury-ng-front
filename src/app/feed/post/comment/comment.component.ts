import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styles: []
})
export class CommentComponent implements OnInit {

  @Input('comment') comment: Comment;

  constructor() { }

  ngOnInit() {
  }

}
