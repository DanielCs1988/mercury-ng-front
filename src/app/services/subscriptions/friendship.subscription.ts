import {Injectable} from '@angular/core';
import {Mutation} from '../../models';

@Injectable({
    providedIn: 'root'
})
export class FriendshipSubscription {

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
