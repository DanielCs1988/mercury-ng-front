import {Component, Input, OnInit} from '@angular/core';
import {Article} from '../../models';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

    @Input('article') article: Article;

    constructor() { }

    ngOnInit() {
    }

}