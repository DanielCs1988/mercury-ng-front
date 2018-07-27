import {Apollo, QueryRef} from 'apollo-angular';
import {Injectable} from '@angular/core';
import {POST_LIKE_FRAGMENT, POST_LIKE_SUBSCRIPTION} from '../../queries/likes';
import {Mutation} from '../../models';

@Injectable({
    providedIn: 'root'
})
export class PostLikeSubscription {

    constructor(private apollo: Apollo) { }

    subscribeToPostLikes(feedQuery: QueryRef<any>) {
        feedQuery.subscribeToMore({
            document: POST_LIKE_SUBSCRIPTION,
            updateQuery: this.postLikeReducer.bind(this)
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
                updatedFeed[indexOfPost] = {
                    ...updatedFeed[indexOfPost],
                    likes: [...updatedFeed[indexOfPost].likes, {...action.node}]
                };
                return { ...state, feed: updatedFeed };
            case Mutation.DELETED:
                const likeId = action.previousValues.id;
                const postId = this.fetchPostLikeId(likeId);
                const postIndex = updatedFeed.findIndex(post => post.id === postId);
                updatedFeed[postIndex] = {
                    ...updatedFeed[postIndex],
                    likes: updatedFeed[postIndex].likes.filter(like => like.id !== likeId)
                };
                return { ...state, feed: updatedFeed };
            default:
                return state;
        }
    }

    private fetchPostLikeId(likeId: string): string {
        const data: any = this.apollo.getClient().readFragment({
            id: `PostLike:${likeId}`,
            fragment: POST_LIKE_FRAGMENT,
            fragmentName: 'PostLikeParts'
        });
        return data.post.id;
    }
}
