import { Component, OnInit } from '@angular/core';
import {Weather} from '../../models';
import {NewsService} from '../../services/news.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

    weather: Weather;

    constructor(private newsService: NewsService) { }

    ngOnInit() {
        this.newsService.getCurrentWeather()
            .then(weather => this.weather = weather)
            .catch(err => console.error(err));
    }

}
