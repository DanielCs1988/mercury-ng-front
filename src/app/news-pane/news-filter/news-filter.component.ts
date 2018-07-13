import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NewsService} from '../../services/news.service';

@Component({
  selector: 'app-news-filter',
  templateUrl: './news-filter.component.html',
  styleUrls: ['./news-filter.component.css']
})
export class NewsFilterComponent implements OnInit {

    newsFilter: FormGroup;
    categories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
    sourcesSelected = false;

    constructor(private newsService: NewsService) { }

    ngOnInit() {
        this.newsFilter = new FormGroup({
            'country': new FormControl(this.newsService.DEFAULT_COUNTRY, Validators.pattern(/^[a-zA-z]{2}$/)),
            'category': new FormControl(null),
            'sources': new FormControl(null, Validators.minLength(1)),
            'keyword': new FormControl(null, Validators.minLength(1))
        });
    }

    onFilter() {
        if (this.areFiltersValid()) {
            return this.newsService.applyFilter(this.newsFilter.value);
        }
        // TODO: Provide feedback here
    }

    private areFiltersValid(): boolean {
        if (!this.newsFilter.valid) {
            return false;
        }
        const filters = this.newsFilter.value;
        return !(filters.sources && (filters.country || filters.category));
    }
}
