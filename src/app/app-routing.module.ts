import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {FeedComponent} from './feed/feed.component';
import {ChatPaneComponent} from './chat-pane/chat-pane.component';
import {EventPaneComponent} from './event-pane/event-pane.component';
import {NewsPaneComponent} from './news-pane/news-pane.component';
import {EventListComponent} from './event-pane/event-list/event-list.component';
import {EventDetailsComponent} from './event-pane/event-details/event-details.component';
import {AuthGuard} from './auth/auth-guard';
import {UsersGuard} from './utils/users.guard';
import {EventEditComponent} from './event-pane/event-edit/event-edit.component';

const routes: Routes = [
  {path: 'feed', component: FeedComponent, canActivate: [AuthGuard]},
  {path: 'chat/:id', component: ChatPaneComponent, canActivate: [AuthGuard, UsersGuard]},
  {path: 'events', component: EventPaneComponent, canActivate: [AuthGuard, UsersGuard], children: [
      {path: '', pathMatch: 'full', component: EventListComponent},
      {path: 'new', component: EventEditComponent},
      {path: ':id', component: EventDetailsComponent},
      {path: ':id/edit', component: EventEditComponent}
    ]},
  {path: 'news', component: NewsPaneComponent},
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
