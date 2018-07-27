import {Apollo, QueryRef} from 'apollo-angular';
import {Injectable} from '@angular/core';
import {POST_LIKE_CORE, POST_LIKE_SUBSCRIPTION} from '../../queries/likes';
import {Mutation} from '../../models';

@Injectable({
    providedIn: 'root'
})
export class PostLikeSubscription {

    constructor(private apollo: Apollo) { }

    subscribeToPostLikes(feedQuery: QueryRef<any>) {
        feedQuery.subscribeToMore({
            document: POST_LIKE_SUBSCRIPTION,
            updateQuery: this.postLikeReducer
        });
    }

    private postLikeReducer(state, { subscriptionData }) {
        if (!subscriptionData.hasOwnProperty('data')) {
            return;
        }
        const action = subscriptionData.data.postLikeSub;
        const updatedFeed = [...state.feed];

        switch (action.mutation) {
            case Mutation.CREATED:
                const indexOfPost = updatedFeed.findIndex(post => post.id === action.node.post.id);
                updatedFeed[indexOfPost] = [...updatedFeed[indexOfPost], {...action.node}];
                return { ...state, feed: updatedFeed };
            case Mutation.DELETED:
                const likeId = action.previousValues.id;
                const postId = this.fetchPostLikeId(likeId);
                const postIndex = updatedFeed.findIndex(post => post.id === postId);
                updatedFeed[postIndex] = updatedFeed[postIndex].filter(like => like.id !== likeId);
                return { ...state, feed: updatedFeed };
            default:
                return state;
        }
    }

    private fetchPostLikeId(likeId) {
        const data: any = this.apollo.getClient().readFragment({
            id: `PostLike:${likeId}`,
            fragment: POST_LIKE_CORE
        });
        return data.post.id;
    }
}
