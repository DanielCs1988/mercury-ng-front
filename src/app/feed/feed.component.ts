import { Component, OnInit } from '@angular/core';
import {Post} from '../models';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styles: []
})
export class FeedComponent implements OnInit {

  posts: Post[] = [
    {text: "First post", comments: [
        {text: 'Top comment'},
        {text: 'Another comment'}
    ]},
    {text: "Secondary Postition", comments: [
        {text: 'Just this comment'}
    ]}
  ];

  constructor() { }

  ngOnInit() {
  }

  onPost() {

  }
}
