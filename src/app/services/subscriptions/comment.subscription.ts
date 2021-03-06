import {Injectable} from '@angular/core';
import {Comment, Mutation} from '../../models';
import {getFixedId} from '../../utils/id.fix';

@Injectable({
    providedIn: 'root'
})
export class CommentSubscription {

    commentReducer(state, { subscriptionData }) {
        if (!subscriptionData.hasOwnProperty('data')) {
            return;
        }
        const action: CommentSubPayload = subscriptionData.data.commentSub;
        switch (action.mutation) {
            case Mutation.CREATED:
                return { ...state, comments: [...state.comments, {...action.node}] };
            case Mutation.UPDATED:
                const updatedComments = [...state.comments];
                const indexOfComment = updatedComments.findIndex(comment => comment.id === action.node.id);
                updatedComments[indexOfComment] = {...action.node};
                return { ...state, comments: updatedComments };
            case Mutation.DELETED:
                const id = getFixedId(action.previousValues.id);
                return {
                    ...state,
                    comments: state.comments.filter(comment => comment.id !== id)
                };
            default:
                return state;
        }
    }
}

export interface CommentSub {
    data?: { commentSub: CommentSubPayload };
}

export interface CommentSubPayload {
    mutation: Mutation;
    node?: Comment;
    previousValues?: {
        id: string;
    }
}
