import {Component, OnDestroy, OnInit} from '@angular/core';
import {Post} from '../models';
import {Apollo, QueryRef} from 'apollo-angular';
import {FEED_QUERY} from '../queries/feed';
import {Subscription} from 'rxjs';
import {PostService} from '../services/post.service';
import {POST_SUBSCRIPTION} from '../queries/post';
import {isDuplicateEntry} from '../services/utils';

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

  constructor(private apollo: Apollo, private postService: PostService) { }

  ngOnInit() {
    this.feedQuery = this.apollo.watchQuery<any>({ query: FEED_QUERY });
    this.querySubscription = this.feedQuery
      .valueChanges
      .subscribe(({data, loading}) => {
        this.loading = loading;
        this.posts = data.feed;
      });
    this.subscribeToPosts();
  }

  subscribeToPosts() {
    this.feedQuery.subscribeToMore({
      document: POST_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data.postSub) {
          return;
        }
        const isNewValue = subscriptionData.data.postSub.node != null;
        const newPost = isNewValue ? subscriptionData.data.postSub.node : subscriptionData.data.postSub.previousValues;
          if (isNewValue) {
              if (isDuplicateEntry(newPost, prev.feed)) {
                  return prev;
              }
            return {...prev, feed: [newPost, ...prev.feed]};
          } else {
            const filteredPosts = prev.feed.filter(post => post.id !== newPost.id);
            return {...prev, feed: filteredPosts};
          }
      }
    });
  }

  ngOnDestroy(): void {
    this.querySubscription.unsubscribe();
  }
}
