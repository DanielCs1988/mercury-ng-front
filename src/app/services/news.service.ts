import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {Article, Weather} from '../models';
import {Endpoints} from '../utils/endpoints';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

    readonly DEFAULT_COUNTRY = 'hu';
    onNewArticles = new BehaviorSubject<Article[]>([]);

    constructor(private http: HttpClient) { }

    async applyFilter(filters: any) {
        const url = filters.sources ? Endpoints.ARTICLES + 'by-source/' : Endpoints.ARTICLES;
        const params = this.constructQueryParams(filters);
        const articles =  await this.http.get<Article[]>(url, {params: params}).toPromise();
        this.onNewArticles.next(articles);
    }

    async getCurrentWeather(): Promise<Weather> {
        if (navigator.geolocation) {
            const pos: any = await new Promise((res, rej) => {
                navigator.geolocation.getCurrentPosition(res, rej);
            });
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            return this.http.get<Weather>(`${Endpoints.WEATHER}?latitude=${lat}&longitude=${lng}`).toPromise();
        }
        return this.http.get<Weather>(`${Endpoints.WEATHER}?country=${this.DEFAULT_COUNTRY}`).toPromise();
    }

    private constructQueryParams(filters: any) {
        let params = new HttpParams();
        for (let filter in filters) {
            if (filters[filter]) {
                params = params.append(filter, filters[filter]);
            }
        }
        return params;
    }
}
