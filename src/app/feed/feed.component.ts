import {Component, OnDestroy, OnInit} from '@angular/core';
import {Post} from '../models';
import {Apollo, QueryRef} from 'apollo-angular';
import {FEED_QUERY} from '../queries/feed';
import {Subscription} from 'rxjs';
import {SubscriptionService} from '../services/subscription.service';
import {PostService} from '../services/post.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, OnDestroy {

  private feedQuery: QueryRef<any>;
  private querySubscription: Subscription;
  posts: Post[] = [];
  loading = false;

  constructor(private apollo: Apollo, private subService: SubscriptionService, private postService: PostService) { }

    ngOnInit() {
        this.feedQuery = this.apollo.watchQuery<any>({
            query: FEED_QUERY,
            variables: {
                first: this.postService.POSTS_PER_PAGE,
                skip: 0
            }
        });
        this.querySubscription = this.feedQuery
            .valueChanges
            .subscribe(({data, loading}) => {
                this.loading = loading;
                this.posts = data.feed;
            });
        this.subService.subscribeToPosts(this.feedQuery);
        this.subService.subscribeToComments(this.feedQuery);
        this.subService.subscribeToPostLikes(this.feedQuery);
        this.subService.subscribeToCommentLikes(this.feedQuery);
    }

  ngOnDestroy(): void {
    this.querySubscription.unsubscribe();
  }
}
