import {Injectable, OnDestroy} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {CREATE_POST_MUTATION, DELETE_POST_MUTATION, UPDATE_POST_MUTATION} from '../queries/post';
import {FEED_QUERY} from '../queries/feed';
import {UserService} from './user.service';
import {User} from '../models';
import {Subscription} from 'rxjs';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService implements OnDestroy {

    private userSubscription: Subscription;
    private currentUser: User;

    refetchNeeded = new Subject<void>();

    readonly QUERY_VARIABLES = {
        first: 10,
        skip: 0
    };

    constructor(private apollo: Apollo, private userService: UserService) {
        this.userSubscription = this.userService.currentUser.subscribe(user => this.currentUser = user);
    }

    createPost(text: string, pictureUrl?: string) {
        this.apollo.mutate({
            mutation: CREATE_POST_MUTATION,
            variables: { text, pictureUrl },

            optimisticResponse: {
                __typename: 'Mutation',
                createPost :{
                    __typename: 'Post',
                    id: '',
                    text: text,
                    pictureUrl: pictureUrl,
                    createdAt: new Date(),
                    likes: [],
                    user: this.currentUser
                }
            },

            update: (proxy, { data: { createPost } }) => {
                const data: any = proxy.readQuery({ query: FEED_QUERY, variables: this.QUERY_VARIABLES });
                data.feed = [createPost, ...data.feed];
                proxy.writeQuery({ query: FEED_QUERY, variables: this.QUERY_VARIABLES, data });
            }
        }).subscribe();
    }

    updatePost(id: string, createdAt: Date, text?: string, pictureUrl?: string) {
        this.apollo.mutate({
            mutation: UPDATE_POST_MUTATION,
            variables: { id, text, pictureUrl },

            optimisticResponse: {
                __typename: 'Mutation',
                updatePost: {
                    __typename: 'Post',
                    id: id,
                    text: text,
                    pictureUrl: pictureUrl,
                    createdAt: createdAt
                }
            }
        }).subscribe();
    }

    deletePost(id: string) {
        this.apollo.mutate({
            mutation: DELETE_POST_MUTATION,
            variables: { id },

            optimisticResponse: {
                __typename: 'Mutation',
                deletePost: {
                    __typename: 'Post',
                    id: id
                }
            },

            update: (proxy, { data: { deletePost } }) => {
                const data: any = proxy.readQuery({ query: FEED_QUERY, variables: this.QUERY_VARIABLES });
                data.feed = data.feed.filter(post => post.id !== deletePost.id);
                proxy.writeQuery({ query: FEED_QUERY, variables: this.QUERY_VARIABLES, data });
            }
        }).subscribe();
    }

    triggerRefetch() {
        this.refetchNeeded.next();
    }

    ngOnDestroy(): void {
        this.userSubscription.unsubscribe();
    }
}
