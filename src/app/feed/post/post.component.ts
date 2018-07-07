import {Component, Input, OnInit} from '@angular/core';
import {Post} from '../../models';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styles: []
})
export class PostComponent implements OnInit {

  @Input('post') post: Post;

  constructor() { }

  ngOnInit() {
  }

}
