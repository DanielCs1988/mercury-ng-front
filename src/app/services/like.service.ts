import {Injectable, OnDestroy} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Subscription} from 'rxjs';
import {User} from '../models';
import {UserService} from './user.service';
import {DISLIKE_COMMENT, DISLIKE_POST, LIKE_COMMENT, LIKE_POST} from '../queries/likes';
import {POST_LIKES} from '../queries/post';
import {COMMENT_LIKES} from '../queries/comment';

@Injectable({
  providedIn: 'root'
})
export class LikeService implements OnDestroy {

    private userSubscription: Subscription;
    private currentUser: User;

    constructor(private apollo: Apollo, private userService: UserService) {
        this.userSubscription = this.userService.currentUser.subscribe(user => this.currentUser = user);
    }

    likePost(postId: string) {
        return this.apollo.mutate({
            mutation: LIKE_POST,
            variables: { postId },
            optimisticResponse: {
                __typename: 'Mutation',
                likePost: {
                    __typename: 'PostLike',
                    id: '',
                    user: this.currentUser,
                    post: {
                        __typename: 'Post',
                        id: postId
                    }
                }
            },
            update: (proxy, { data: { likePost } }) => {
                const data: any = proxy.readFragment({
                    id: `Post:${postId}`,
                    fragment: POST_LIKES,
                    fragmentName: 'postLikes'
                });
                data.likes.push(likePost);
                proxy.writeFragment({
                    id: `Post:${postId}`,
                    fragment: POST_LIKES,
                    fragmentName: 'postLikes',
                    data: data
                });
            }
        });
    }

    dislikePost(id: string, postId: string) {
        this.apollo.mutate({
            mutation: DISLIKE_POST,
            variables: { id },
            optimisticResponse: {
                __typename: 'Mutation',
                dislikePost: {
                    __typename: 'PostLike',
                    id: id
                }
            },
            update: (proxy, { data: { dislikePost } }) => {
                const data: any = proxy.readFragment({
                    id: `Post:${postId}`,
                    fragment: POST_LIKES,
                    fragmentName: 'postLikes'
                });
                data.likes = data.likes.filter(like => like.id !== dislikePost.id);
                proxy.writeFragment({
                    id: `Post:${postId}`,
                    fragment: POST_LIKES,
                    fragmentName: 'postLikes',
                    data: data
                });
            }
        }).subscribe();
    }

    likeComment(commentId: string) {
        return this.apollo.mutate({
            mutation: LIKE_COMMENT,
            variables: { commentId },
            optimisticResponse: {
                __typename: 'Mutation',
                likeComment: {
                    __typename: 'CommentLike',
                    id: '',
                    user: this.currentUser,
                    comment: {
                        __typename: 'Comment',
                        id: commentId
                    }
                }
            },
            update: (proxy, { data: { likeComment } }) => {
                const data: any = proxy.readFragment({
                    id: `Comment:${commentId}`,
                    fragment: COMMENT_LIKES,
                    fragmentName: 'commentLikes'
                });
                data.likes.push(likeComment);
                proxy.writeFragment({
                    id: `Comment:${commentId}`,
                    fragment: COMMENT_LIKES,
                    fragmentName: 'commentLikes',
                    data: data
                });
            }
        });
    }

    dislikeComment(id: string, commentId: string) {
        this.apollo.mutate({
            mutation: DISLIKE_COMMENT,
            variables: { id },
            optimisticResponse: {
                __typename: 'Mutation',
                dislikeComment: {
                    __typename: 'CommentLike',
                    id: id
                }
            },
            update: (proxy, { data: { dislikeComment } }) => {
                const data: any = proxy.readFragment({
                    id: `Comment:${commentId}`,
                    fragment: COMMENT_LIKES,
                    fragmentName: 'commentLikes'
                });
                data.likes = data.likes.filter(like => like.id !== dislikeComment.id);
                proxy.writeFragment({
                    id: `Comment:${commentId}`,
                    fragment: COMMENT_LIKES,
                    fragmentName: 'commentLikes',
                    data: data
                });
            }
        }).subscribe();
    }

    ngOnDestroy(): void {
        this.userSubscription.unsubscribe();
    }
}
