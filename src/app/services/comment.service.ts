import {Injectable, OnDestroy} from '@angular/core';
import {User} from '../models';
import {Apollo} from 'apollo-angular';
import {UserService} from './user.service';
import {CREATE_COMMENT_MUTATION, DELETE_COMMENT_MUTATION, FETCH_COMMENTS, UPDATE_COMMENT_MUTATION} from '../queries/comment';
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
                    likes: []
                }
            },

            update: (proxy, { data: { createComment } }) => {
                const data: any = proxy.readQuery({ query: FETCH_COMMENTS, variables: { postId } });
                data.comments.push(createComment);
                proxy.writeQuery({ query: FETCH_COMMENTS, variables: { postId }, data });
            }
        }).subscribe();
    }

    updateComment(id: string, text: string, createdAt: Date) {
        this.apollo.mutate({
            mutation: UPDATE_COMMENT_MUTATION,
            variables: { id, text },

            optimisticResponse: {
                __typename: 'Mutation',
                updateComment: {
                    __typename: 'Comment',
                    id: id,
                    text: text,
                    createdAt: createdAt
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
                const data: any = proxy.readQuery({ query: FETCH_COMMENTS, variables: { postId } });
                data.comments = data.comments.filter(comment => comment.id !== deleteComment.id);
                proxy.writeQuery({ query: FETCH_COMMENTS, variables: { postId }, data });
            }
        }).subscribe();
    }

    ngOnDestroy(): void {
        this.userSubscription.unsubscribe();
    }
}
