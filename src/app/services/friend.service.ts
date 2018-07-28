import {Injectable, OnDestroy} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {UserService} from './user.service';
import {Subscription} from 'rxjs';
import {User} from '../models';
import {ACCEPT_FRIEND, ADD_FRIEND, DELETE_FRIEND, FETCH_FRIENDS} from '../queries/friendship';
import {FEED_QUERY} from '../queries/feed';

@Injectable({
    providedIn: 'root'
})
export class FriendService implements OnDestroy {

    private userSub: Subscription;
    private currentUser: User;
    private feedQuery = {
        query: FEED_QUERY,
        variables: {
            first: 10,
            skip: 0
        }
    };

    constructor(private apollo: Apollo, private userService: UserService) {
        this.userSub = userService.currentUser.subscribe(user => this.currentUser = user);
    }

    addFriend(target: User) {
        this.apollo.mutate({
            mutation: ADD_FRIEND,
            variables: { targetId: target.id },

            optimisticResponse: {
                __typename: 'Mutation',
                addFriend: {
                    __typename: 'Friendship',
                    id: '',
                    accepted: false,
                    createdAt: new Date(),
                    initiator: this.currentUser,
                    target: target
                }
            },

            update: (proxy, { data: { addFriend } }) => {
                const data: any = proxy.readQuery({ query: FETCH_FRIENDS });
                data.currentUser.addedFriends.push(addFriend);
                proxy.writeQuery({ query: FETCH_FRIENDS, data });
            }
        }).subscribe();
    }

    acceptFriend(id: string) {
        this.apollo.mutate({
            mutation: ACCEPT_FRIEND,
            variables: { id },

            optimisticResponse: {
                __typename: 'Mutation',
                acceptFriend: {
                    __typename: 'Friendship',
                    id: id,
                    accepted: true
                }
            },

            refetchQueries: [this.feedQuery]
        }).subscribe();
    }

    removeFriend(id: string) {
        this.apollo.mutate({
            mutation: DELETE_FRIEND,
            variables: { id },

            optimisticResponse: {
                __typename: 'Mutation',
                deleteFriend: {
                    __typename: 'Friendship',
                    id: id
                }
            },

            refetchQueries: [this.feedQuery],

            update: (proxy, { data: { deleteFriend } }) => {
                const data: any = proxy.readQuery({ query: FETCH_FRIENDS });
                data.currentUser.addedFriends = data.currentUser.addedFriends.filter(friend => friend.id !== deleteFriend.id);
                data.currentUser.acceptedFriends = data.currentUser.acceptedFriends.filter(friend => friend.id !== deleteFriend.id);
                proxy.writeQuery({ query: FETCH_FRIENDS, data });
            }
        }).subscribe();
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }
}
