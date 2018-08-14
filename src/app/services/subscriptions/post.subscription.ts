import {Injectable} from '@angular/core';
import {QueryRef} from 'apollo-angular';
import {POST_SUBSCRIPTION} from '../../queries/post';
import {Mutation, Post} from '../../models';
import {getFixedId} from '../../utils/id.fix';

@Injectable({
    providedIn: 'root'
})
export class PostSubscription {

    subscribeToPosts(feedQuery: QueryRef<any>) {
        feedQuery.subscribeToMore({
            document: POST_SUBSCRIPTION,
            updateQuery: this.postReducer
        });
    }

    postReducer(state, { subscriptionData }) {
        if (!subscriptionData.hasOwnProperty('data')) {
            // Why does this not purge the store? Throws an error if I return state, makes no sense.
            return;
        }
        const action: PostSubPayload = subscriptionData.data.postSub;
        switch (action.mutation) {
            case Mutation.CREATED:
                return { ...state, feed: [{...action.node}, ...state.feed] };
            case Mutation.UPDATED:
                const updatedFeed = [...state.feed];
                const indexOfPost = updatedFeed.findIndex(post => post.id === action.node.id);
                updatedFeed[indexOfPost] = {...action.node};
                return { ...state, feed: updatedFeed };
            case Mutation.DELETED:
                const id = getFixedId(action.previousValues.id);
                return {
                    ...state,
                    feed: state.feed.filter(post => post.id !== id)
                };
            default:
                return state;
        }
    }
}

export interface PostSub {
    data?: { postSub: PostSubPayload };
}

export interface PostSubPayload {
    mutation: Mutation;
    node?: Post;
    previousValues?: {
        id: string;
    }
}
