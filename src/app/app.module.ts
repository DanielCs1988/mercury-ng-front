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
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {Apollo, ApolloModule} from 'apollo-angular';
import {HttpLink, HttpLinkModule} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

  private MERCURY_FEED_API = 'https://protected-island-21893.herokuapp.com/';

  constructor(apollo: Apollo, httpLink: HttpLink) {
    apollo.create({
      link: httpLink.create({uri: this.MERCURY_FEED_API}),
      cache: new InMemoryCache()
    });
  }

}
