import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FeedComponent } from './feed/feed.component';
import { ChatPaneComponent } from './chat-pane/chat-pane.component';
import { EventPaneComponent } from './event-pane/event-pane.component';
import { NewsPaneComponent } from './news-pane/news-pane.component';
import { FooterComponent } from './footer/footer.component';
import { PostComponent } from './feed/post/post.component';
import { CommentComponent } from './feed/post/comment/comment.component';
import { LikeComponent } from './feed/like/like.component';
import { EventListComponent } from './event-pane/event-list/event-list.component';
import { EventDetailsComponent } from './event-pane/event-details/event-details.component';
import { EditorComponent } from './feed/editor/editor.component';
import { UserListComponent } from './user-list/user-list.component';
import {AppRoutingModule} from './app-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {Apollo, ApolloModule} from 'apollo-angular';
import {HttpLink, HttpLinkModule} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {AuthInterceptor} from './auth/auth.interceptor';
import {WebSocketLink} from 'apollo-link-ws';
import { split } from 'apollo-link';
import {getMainDefinition} from 'apollo-utilities';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    FeedComponent,
    ChatPaneComponent,
    EventPaneComponent,
    NewsPaneComponent,
    FooterComponent,
    PostComponent,
    CommentComponent,
    LikeComponent,
    EventListComponent,
    EventDetailsComponent,
    EditorComponent,
    UserListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ApolloModule,
    HttpLinkModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  private MERCURY_FEED_API = 'https://protected-island-21893.herokuapp.com/';
  private MERCURY_FEED_WS = 'wss://protected-island-21893.herokuapp.com/';

  constructor(apollo: Apollo, httpLink: HttpLink) {
    const http = httpLink.create({uri: this.MERCURY_FEED_API});
    const ws = new WebSocketLink({
      uri: this.MERCURY_FEED_WS,
      options: {
        reconnect: true
      }
    });

    const link = split(({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    }, ws, http);

    apollo.create({
      link: link,
      cache: new InMemoryCache()
    });
  }

}
