import {Component, OnDestroy, OnInit} from '@angular/core';
import {Article} from '../models';
import {NewsService} from '../services/news.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-news-pane',
  templateUrl: './news-pane.component.html',
  styleUrls: ['./news-pane.component.css']
})
export class NewsPaneComponent implements OnInit, OnDestroy {

    private newsSub: Subscription;

    articles: Article[] = [];

    constructor(private newsService: NewsService) { }

    ngOnInit() {
        this.newsSub = this.newsService.onNewArticles.subscribe(articles => this.articles = articles);
        this.newsService.applyFilter({country: this.newsService.DEFAULT_COUNTRY});
    }

    ngOnDestroy(): void {
        this.newsSub.unsubscribe();
    }
}
