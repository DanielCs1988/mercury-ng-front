import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {COMMENT_LIKE_FRAGMENT} from '../../queries/likes';
import {Like, Mutation} from '../../models';

@Injectable({
    providedIn: 'root'
})
export class CommentLikeSubscription {

    constructor(private apollo: Apollo) {
        this.commentLikeReducer = this.commentLikeReducer.bind(this);
    }

    commentLikeReducer(state, { subscriptionData }) {
        if (!subscriptionData.hasOwnProperty('data')) {
            return;
        }
        const action: CommentLikeSubPayload = subscriptionData.data.commentLikeSub;
        const updatedComments = [...state.comments];

        switch (action.mutation) {
            case Mutation.CREATED:
                const indexOfComment = updatedComments.findIndex(comment => comment.id === action.node.comment.id);
                updatedComments[indexOfComment] = {
                    ...updatedComments[indexOfComment],
                    likes: [...updatedComments[indexOfComment].likes, {...action.node}]
                };
                return { ...state, comments: updatedComments };
            case Mutation.DELETED:
                const likeId = action.previousValues.id;
                const commentId = this.fetchCommentId(likeId);
                const commentIndex = updatedComments.findIndex(comment => comment.id === commentId);
                if (commentIndex === -1) {
                    return state;
                }
                updatedComments[commentIndex] = {
                    ...updatedComments[commentIndex],
                    likes: updatedComments[commentIndex].likes.filter(like => like.id !== likeId)
                };
                return { ...state, comments: updatedComments };
            default:
                return state;
        }
    }

    private fetchCommentId(likeId: string): string {
        const data: any = this.apollo.getClient().readFragment({
            id: `CommentLike:${likeId}`,
            fragment: COMMENT_LIKE_FRAGMENT,
            fragmentName: 'CommentLikeParts'
        });
        return data.comment.id;
    }
}

export interface CommentLikeSub {
    data?: { commentLikeSub: CommentLikeSubPayload };
}

export interface CommentLikeSubPayload {
    mutation: Mutation;
    node?: Like;
    previousValues?: {
        id: string;
    }
}
