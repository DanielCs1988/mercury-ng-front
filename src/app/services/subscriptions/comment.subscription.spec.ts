import {CommentSub, CommentSubscription} from './comment.subscription';
import {Comment, Mutation} from '../../models';

describe('Comment Subscription', () => {

    const subscription = new CommentSubscription();
    const state: {dummy: string, comments: Comment[]} = {
        dummy: 'should not be touched',
        comments: [
            {
                id: 'abc',
                text: 'First!',
                createdAt: new Date(),
                user: { id: 'mate' },
                likes: [{ id: 'liek', user: { id: 'mate' } }]
            },
            {
                id: 'smh',
                text: 'Because 1 comment just wont do it!',
                createdAt: new Date(),
                user: { id: 'Jane' },
                likes: [{ id: 'liek2', user: { id: 'mate' } }]
            }
        ]
    };

    it('should merge new comments to state',  () => {
        const subscriptionData: CommentSub = {
            data: {
                commentSub: {
                    mutation: Mutation.CREATED,
                    node: {
                        id: 'def',
                        text: 'Second!',
                        createdAt: new Date(),
                        user: { id: 'Jack' },
                        likes: []
                    }
                }
            }
        };
        const expected = {
            ...state, comments: [...state.comments, subscriptionData.data.commentSub.node]
        };
        const result = subscription.commentReducer(state, { subscriptionData });
        expect(result).toEqual(expected);
    });

    it('should update existing comments', () => {
        const subscriptionData: CommentSub = {
            data: {
                commentSub: {
                    mutation: Mutation.UPDATED,
                    node: {
                        ...state.comments[0],
                        text: 'Still the first comment.'
                    }
                }
            }
        };
        const expected = {
            ...state, comments: [subscriptionData.data.commentSub.node, state.comments[1]]
        };
        const result = subscription.commentReducer(state, { subscriptionData });
        expect(result).toEqual(expected);
    });

    it('should delete comments', () => {
        const subscriptionData: CommentSub = {
            data: {
                commentSub: {
                    mutation: Mutation.DELETED,
                    previousValues: { id: 'abc' }
                }
            }
        };
        const expected = {
            ...state, comments: [state.comments[1]]
        };
        const result = subscription.commentReducer(state, { subscriptionData });
        expect(result).toEqual(expected);
    });

    it('should return undefined when receiving an error', () => {
        const subscriptionData = { error: 'Something bad happened!' };
        const result = subscription.commentReducer(state, { subscriptionData });
        expect(result).toBeUndefined();
    });

});
