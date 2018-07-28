import {Injectable} from '@angular/core';
import {Mutation} from '../../models';

@Injectable({
    providedIn: 'root'
})
export class CommentSubscription {

    commentReducer(state, { subscriptionData }) {
        if (!subscriptionData.hasOwnProperty('data')) {
            return;
        }
        const action = subscriptionData.data.commentSub;
        switch (action.mutation) {
            case Mutation.CREATED:
                return { ...state, comments: [...state.comments, {...action.node}] };
            case Mutation.UPDATED:
                const updatedComments = [...state.comments];
                const indexOfComment = updatedComments.findIndex(comment => comment.id === action.node.id);
                updatedComments[indexOfComment] = {...action.node};
                return { ...state, comments: updatedComments };
            case Mutation.DELETED:
                return {
                    ...state,
                    comments: state.comments.filter(comment => comment.id !== action.previousValues.id)
                };
            default:
                return state;
        }
    }
}
