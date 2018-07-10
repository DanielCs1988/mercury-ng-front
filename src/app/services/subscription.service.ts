import { Injectable } from '@angular/core';
import {POST_SUBSCRIPTION} from '../queries/post';
import {isDuplicateEntry} from './utils';
import {Apollo, QueryRef} from 'apollo-angular';
import {COMMENT_SUBSCRIPTION} from '../queries/comment';
import {COMMENT_LIKE_SUBSCRIPTION, GET_COMMENT_AND_POST_ID, POST_LIKE_SUBSCRIPTION} from '../queries/likes';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

    constructor(private apollo: Apollo) { }

    subscribeToPosts(feedQuery: QueryRef<any>) {
        feedQuery.subscribeToMore({
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

    subscribeToComments(feedQuery: QueryRef<any>) {
        feedQuery.subscribeToMore({
            document: COMMENT_SUBSCRIPTION,

            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data.commentSub) {
                    return;
                }
                const isNewValue = subscriptionData.data.commentSub.node != null;
                const newComment = isNewValue ? subscriptionData.data.commentSub.node : subscriptionData.data.commentSub.previousValues;
                let post = isNewValue ?
                    prev.feed.find(post => post.id === newComment.post.id) :
                    prev.feed.find(post => post.comments.filter(comment => comment.id === newComment.id).length > 0);
                if (!post) {
                    return;
                }
                if (isNewValue) {
                    if (isDuplicateEntry(newComment, post.comments)) {
                        return prev;
                    }
                    post = {...post, comments: [...post.comments, newComment]};
                } else {
                    post = {...post, comments: post.comments.filter(comment => comment.id !== newComment.id)};
                }
                const filteredFeed = prev.feed.filter(pst => pst.id !== post.id);
                return {...prev, feed: [post, ...filteredFeed]};
            }
        })
    }

    subscribeToPostLikes(feedQuery: QueryRef<any>) {
        feedQuery.subscribeToMore({
            document: POST_LIKE_SUBSCRIPTION,

            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data.postLikeSub) {
                    return;
                }
                const isNewValue = subscriptionData.data.postLikeSub.node != null;
                const newLike = isNewValue ? subscriptionData.data.postLikeSub.node : subscriptionData.data.postLikeSub.previousValues;
                let post = isNewValue ?
                    prev.feed.find(post => post.id === newLike.post.id) :
                    prev.feed.find(post => post.likes.filter(like => like.id === newLike.id).length > 0);
                if (!post) {
                    return;
                }
                if (isNewValue) {
                    if (isDuplicateEntry(newLike, post.likes)) {
                        return prev;
                    }
                    post = {...post, likes: [...post.likes, newLike]};
                } else {
                    post = {...post, likes: post.likes.filter(like => like.id !== newLike.id)};
                }
                const filteredFeed = prev.feed.filter(pst => pst.id !== post.id);
                return {...prev, feed: [post, ...filteredFeed]};
            }
        })
    }

    subscribeToCommentLikes(feedQuery: QueryRef<any>) {
        feedQuery.subscribeToMore({
            document: COMMENT_LIKE_SUBSCRIPTION,

            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data.commentLikeSub) {
                    return;
                }
                const isNewLike = subscriptionData.data.commentLikeSub.node != null;
                const newLike = isNewLike ? subscriptionData.data.commentLikeSub.node : subscriptionData.data.commentLikeSub.previousValues;

                const parentIds: any = this.apollo.getClient().readFragment({
                    id: `CommentLike:${newLike.id}`,
                    fragment: GET_COMMENT_AND_POST_ID
                });
                const postIndex = prev.feed.findIndex(post => post.id === parentIds.comment.post.id);
                const commentIndex = prev.feed[postIndex].comments.findIndex(comment => comment.id === parentIds.comment.id);
                const newFeed = prev.feed.slice();

                let post = newFeed[postIndex];
                let comment =newFeed[postIndex].comments[commentIndex];
                if (!comment) {
                    return;
                }

                if (isNewLike) {
                    if (isDuplicateEntry(newLike, comment.likes)) {
                        return prev;
                    }
                    comment = {...comment, likes: [...comment.likes, newLike]};
                } else {
                    comment = {...comment, likes: comment.likes.filter(like => like.id !== newLike.id)};
                }

                post = {...post, comments: [...post.comments.filter(cm => cm.id !== comment.id), comment]};

                const filteredFeed = prev.feed.filter(pst => pst.id !== post.id);
                return {...prev, feed: [post, ...filteredFeed]};
            }
        })
    }
}
