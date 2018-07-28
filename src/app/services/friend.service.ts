import {Injectable, OnDestroy} from '@angular/core';
import {Apollo, QueryRef} from 'apollo-angular';
import {UserService} from './user.service';
import {Subscription} from 'rxjs';
import {Friendship, User} from '../models';
import {ACCEPT_FRIEND, ADD_FRIEND, DELETE_FRIEND, FETCH_FRIENDS, FRIENDSHIP_SUBSCRIPTION} from '../queries/friendship';
import {FEED_QUERY} from '../queries/feed';
import {FriendshipSubscription} from './subscriptions/friendship.subscription';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FriendService implements OnDestroy {

    private friendsQuery: QueryRef<any>;
    private userSub: Subscription;
    private currentUser: User;
    private readonly feedQuery = {
        query: FEED_QUERY,
        variables: {
            first: 10,
            skip: 0
        }
    };

    friendlist = new BehaviorSubject<Map<string, Friendship>>(new Map<string, Friendship>());
    friendRequests = new BehaviorSubject<Map<string, Friendship>>(new Map<string, Friendship>());

    constructor(private apollo: Apollo, private userService: UserService, private friendshipReducer: FriendshipSubscription) {
        this.userSub = userService.currentUser.subscribe(user => this.currentUser = user);
        this.fetchFriendlist();
    }

    private fetchFriendlist() {
        this.friendsQuery = this.apollo.watchQuery<any>({ query: FETCH_FRIENDS });
        this.friendsQuery.valueChanges.subscribe(({ data }) => {
            this.updateFriendList(data);
            this.updateFriendRequestList(data);
        });
        this.friendsQuery.subscribeToMore({
            document: FRIENDSHIP_SUBSCRIPTION,
            updateQuery: this.friendshipReducer.friendshipReducer
        });
    }

    private updateFriendList(data: any) {
        const friends = new Map<string, Friendship>();
        data.currentUser.addedFriends
            .forEach(friendship => friends.set(
                friendship.target.id,
                {id: friendship.id, accepted: friendship.accepted, createdAt: friendship.createdAt}
            ));
        data.currentUser.acceptedFriends
            .filter(friendship => friendship.accepted)
            .forEach(friendship => friends.set(
                friendship.initiator.id,
                {id: friendship.id, accepted: friendship.accepted, createdAt: friendship.createdAt}
            ));
        this.friendlist.next(friends);
    }

    private updateFriendRequestList(data: any) {
        const requests = new Map<string, Friendship>();
        data.currentUser.acceptedFriends
            .filter(friendship => !friendship.accepted)
            .forEach(friendship => requests.set(
                friendship.initiator.id,
                {id: friendship.id, createdAt: friendship.createdAt}
            ));
        this.friendRequests.next(requests);
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
