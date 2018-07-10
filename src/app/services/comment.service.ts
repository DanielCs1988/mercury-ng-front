import {Injectable, OnDestroy} from '@angular/core';
import {User} from '../models';
import {Apollo} from 'apollo-angular';
import {UserService} from './user.service';
import {CREATE_COMMENT_MUTATION, DELETE_COMMENT_MUTATION, UPDATE_COMMENT_MUTATION} from '../queries/comment';
import {MIN_POST_FRAGMENT} from '../queries/post';
import {Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService implements OnDestroy {

    private userSubscription: Subscription;
    private currentUser: User;

    constructor(private apollo: Apollo, private userService: UserService) {
        this.userSubscription = this.userService.currentUser.subscribe(user => this.currentUser = user);
    }

    createComment(postId: string, text: string) {
        this.apollo.mutate({
            mutation: CREATE_COMMENT_MUTATION,
            variables: { postId, text },

            optimisticResponse: {
                __typename: 'Mutation',
                createComment: {
                    __typename: 'Comment',
                    id: '',
                    text: text,
                    createdAt: new Date(),
                    user: this.currentUser,
                    likes: [],
                    post: {
                        __typename: 'Post',
                        id: postId
                    }
                }
            },

            update: (proxy, { data: { createComment } }) => {
                const data: any = proxy.readFragment({
                    id: `Post:${postId}`,
                    fragment: MIN_POST_FRAGMENT,
                    fragmentName: 'minPost'
                });
                data.comments.push(createComment);
                proxy.writeFragment({
                    id: `Post:${postId}`,
                    fragment: MIN_POST_FRAGMENT,
                    fragmentName: 'minPost',
                    data: data
                });
            }
        }).subscribe();
    }

    updateComment(id: string, text: string) {
        this.apollo.mutate({
            mutation: UPDATE_COMMENT_MUTATION,
            variables: { id, text },

            optimisticResponse: {
                __typename: 'Mutation',
                updateComment: {
                    __typename: 'Comment',
                    id: id,
                    text: text
                }
            }
        }).subscribe();
    }

    deleteComment(id: string, postId: string) {
        this.apollo.mutate({
            mutation: DELETE_COMMENT_MUTATION,
            variables: { id },

            optimisticResponse: {
                __typename: 'Mutation',
                deleteComment: {
                    __typename: 'Comment',
                    id: id
                }
            },

            update: (proxy, { data: { deleteComment } }) => {
                const data: any = proxy.readFragment({
                    id: `Post:${postId}`,
                    fragment: MIN_POST_FRAGMENT,
                    fragmentName: 'minPost'
                });
                data.comments = data.comments.filter(comment => comment.id !== id);
                proxy.writeFragment({
                    id: `Post:${postId}`,
                    fragment: MIN_POST_FRAGMENT,
                    fragmentName: 'minPost',
                    data: data
                });
            }
        }).subscribe();
    }

    ngOnDestroy(): void {
        this.userSubscription.unsubscribe();
    }
}
