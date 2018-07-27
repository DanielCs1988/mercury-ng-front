import {Component, OnDestroy, OnInit} from '@angular/core';
import {Post} from '../models';
import {Apollo, QueryRef} from 'apollo-angular';
import {FEED_QUERY} from '../queries/feed';
import {Subscription} from 'rxjs';
import {PostService} from '../services/post.service';
import {PostSubscription} from '../services/subscriptions/post.subscription';
import {PostLikeSubscription} from '../services/subscriptions/post-like.subscription';

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

  constructor(
      private apollo: Apollo,
      private postService: PostService,
      private postSub: PostSubscription,
      private postLikeSub: PostLikeSubscription
  ) { }

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
        this.postSub.subscribeToPosts(this.feedQuery);
        this.postLikeSub.subscribeToPostLikes(this.feedQuery);
    }

  ngOnDestroy(): void {
    this.querySubscription.unsubscribe();
  }
}
