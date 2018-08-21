import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styles: ['p, ul {font-size: 1.2rem}']
})
export class LobbyComponent {

    links = {
        LinkedIn: 'https://www.linkedin.com/in/daniel-cs%C3%A1sz%C3%A1r-56007a163/',
        GitHub: 'https://github.com/DanielCs1988',
        Frontend: 'https://github.com/DanielCs1988/mercury-ng-front',
        FeedApi: 'https://github.com/DanielCs1988/mercury-feed-api',
        ChatApi: 'https://github.com/DanielCs1988/mercury-chat-node',
        EventsApi: 'https://github.com/DanielCs1988/mercury-events-java',
        NewsApi: 'https://github.com/DanielCs1988/mercury-news-api'
    }

}
