import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FeedComponent } from './feed/feed.component';
import { ChatPaneComponent } from './chat-pane/chat-pane.component';
import { EventPaneComponent } from './event-pane/event-pane.component';
import { NewsPaneComponent } from './news-pane/news-pane.component';
import { PostComponent } from './feed/post/post.component';
import { CommentComponent } from './feed/post/comment/comment.component';
import { LikeComponent } from './feed/like/like.component';
import { EventListComponent } from './event-pane/event-list/event-list.component';
import { EventDetailsComponent } from './event-pane/event-details/event-details.component';
import { EditorComponent } from './feed/editor/editor.component';
import { UserListComponent } from './user-list/user-list.component';
import {AppRoutingModule} from './app-routing.module';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthInterceptor} from './auth/auth.interceptor';
import { EventEditComponent } from './event-pane/event-edit/event-edit.component';
import { ArticleComponent } from './news-pane/article/article.component';
import { NewsFilterComponent } from './news-pane/news-filter/news-filter.component';
import { WeatherComponent } from './news-pane/weather/weather.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { LobbyComponent } from './lobby/lobby.component';
import {StoreModule} from '@ngrx/store';
import {reducers} from './store/app.reducers';
import {EffectsModule} from '@ngrx/effects';
import {EventEffects} from './store/event/event.effects';
import {StoreRouterConnectingModule} from '@ngrx/router-store';
import {environment} from '../environments/environment';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {AppApolloModule} from './app-apollo.module';

@NgModule({
    declarations: [
        AppComponent,
        NavigationComponent,
        FeedComponent,
        ChatPaneComponent,
        EventPaneComponent,
        NewsPaneComponent,
        PostComponent,
        CommentComponent,
        LikeComponent,
        EventListComponent,
        EventDetailsComponent,
        EditorComponent,
        UserListComponent,
        EventEditComponent,
        ArticleComponent,
        NewsFilterComponent,
        WeatherComponent,
        LobbyComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        AppApolloModule,
        FontAwesomeModule,
        StoreModule.forRoot(reducers),
        EffectsModule.forRoot([EventEffects]),
        StoreRouterConnectingModule,
        !environment.production ? StoreDevtoolsModule : []
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
