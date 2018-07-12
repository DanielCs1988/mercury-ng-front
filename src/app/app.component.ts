import { Component } from '@angular/core';
import {AuthService} from './auth/auth.service';
import {ChatService} from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private authService: AuthService, private chatService: ChatService) {
    authService.handleAuthentication();
    chatService.init();
  }

}
