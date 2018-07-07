import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {FeedComponent} from './feed/feed.component';
import {ChatPaneComponent} from './chat-pane/chat-pane.component';
import {EventPaneComponent} from './event-pane/event-pane.component';
import {NewsPaneComponent} from './news-pane/news-pane.component';
import {EventListComponent} from './event-pane/event-list/event-list.component';
import {EventDetailsComponent} from './event-pane/event-details/event-details.component';

const routes: Routes = [
  {path: 'feed', component: FeedComponent},
  {path: 'chat', component: ChatPaneComponent},
  {path: 'events', component: EventPaneComponent},
  {path: 'news', component: NewsPaneComponent, children: [
      {path: '', pathMatch: 'full', component: EventListComponent},
      {path: ':event', component: EventDetailsComponent}
  ]},
  {path: '**', redirectTo: 'feed'}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
