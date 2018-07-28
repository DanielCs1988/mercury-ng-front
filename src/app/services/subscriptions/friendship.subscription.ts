import {Injectable} from '@angular/core';
import {Mutation} from '../../models';
import {PostService} from '../post.service';

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
        const action = subscriptionData.data.friendshipSub;
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
                this.postService.refetchNeeded.next();
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
                this.postService.refetchNeeded.next();
                const filteredAcceptedFriends = state.currentUser.acceptedFriends
                    .filter(friend => friend.id !== action.previousValues.id);
                const filteredAddedFriends = state.currentUser.addedFriends
                    .filter(friend => friend.id !== action.previousValues.id);
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
