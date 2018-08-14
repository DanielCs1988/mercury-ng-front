import {Apollo, QueryRef} from 'apollo-angular';
import {Injectable} from '@angular/core';
import {POST_LIKE_FRAGMENT, POST_LIKE_SUBSCRIPTION} from '../../queries/likes';
import {Like, Mutation} from '../../models';
import {getFixedId} from '../../utils/id.fix';

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

    postLikeReducer(state, { subscriptionData }) {
        if (!subscriptionData.hasOwnProperty('data')) {
            return;
        }
        const action: PostLikeSubPayload = subscriptionData.data.postLikeSub;
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
                const likeId = getFixedId(action.previousValues.id);
                const postId = this.fetchPostId(likeId);
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

    private fetchPostId(likeId: string): string {
        const data: any = this.apollo.getClient().readFragment({
            id: `PostLike:${likeId}`,
            fragment: POST_LIKE_FRAGMENT,
            fragmentName: 'PostLikeParts'
        });
        return data.post.id;
    }
}

export interface PostLikeSub {
    data?: { postLikeSub: PostLikeSubPayload };
}

export interface PostLikeSubPayload {
    mutation: Mutation;
    node?: Like;
    previousValues?: {
        id: string;
    }
}
