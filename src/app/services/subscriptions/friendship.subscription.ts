import {Injectable} from '@angular/core';
import {Friendship, Mutation} from '../../models';
import {PostService} from '../post.service';
import {getFixedId} from '../../utils/id.fix';

@Injectable({
    providedIn: 'root'
})
export class FriendshipSubscription {

    constructor(private postService: PostService) {
        this.friendshipReducer = this.friendshipReducer.bind(this);
    }

    friendshipReducer(state, { subscriptionData }) {
        if (!subscriptionData.hasOwnProperty('data')) {
            return;
        }
        const action: FriendshipSubPayload = subscriptionData.data.friendshipSub;
        switch (action.mutation) {
            case Mutation.CREATED:
                return {
                    ...state,
                    currentUser: {
                        ...state.currentUser,
                        acceptedFriends: [...state.currentUser.acceptedFriends, {...action.node}]
                    }
                };
            case Mutation.UPDATED:
                this.postService.triggerRefetch();
                const addedFriends = [...state.currentUser.addedFriends];
                const friendshipIndex = addedFriends.findIndex(friendship => friendship.id === action.node.id);
                addedFriends[friendshipIndex] = {...action.node};
                return {
                    ...state,
                    currentUser: {
                        ...state.currentUser,
                        addedFriends: addedFriends
                    }
                };
            case Mutation.DELETED:
                const id = getFixedId(action.previousValues.id);
                this.postService.triggerRefetch();
                const filteredAcceptedFriends = state.currentUser.acceptedFriends
                    .filter(friend => friend.id !== id);
                const filteredAddedFriends = state.currentUser.addedFriends
                    .filter(friend => friend.id !== id);
                return {
                    ...state,
                    currentUser: {
                        ...state.currentUser,
                        acceptedFriends: filteredAcceptedFriends,
                        addedFriends: filteredAddedFriends
                    }
                };
            default:
                return state;
        }
    }
}

export interface FriendshipSub {
    data?: { friendshipSub: FriendshipSubPayload };
}

export interface FriendshipSubPayload {
    mutation: Mutation;
    node?: Friendship;
    previousValues?: {
        id: string;
    }
}
