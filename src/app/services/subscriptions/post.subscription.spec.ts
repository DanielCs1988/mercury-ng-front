import {Mutation, Post} from '../../models';
import {PostSub, PostSubscription} from './post.subscription';

describe('Post Subscription', () => {

    const subscription = new PostSubscription();
    const state: {dummy: string, feed: Post[]} = {
        dummy: 'should not be touched',
        feed: [
            {
                id: 'abc',
                text: 'First!',
                pictureUrl: 'random food',
                createdAt: new Date(),
                user: { id: 'mate' },
                likes: [{ id: 'liek', user: { id: 'mate' } }],
                comments: [{
                    id: 'commentIdX0',
                    text: 'First!',
                    createdAt: new Date(),
                    user: { id: 'Jane' },
                    likes: [{ id: 'liek3', user: { id: 'mate' } }]
                }]
            },
            {
                id: 'smh',
                text: 'Because 1 post just wont do it!',
                createdAt: new Date(),
                user: { id: 'Jane' },
                likes: [{ id: 'liek2', user: { id: 'mate' } }],
                comments: []
            }
        ]
    };

    it('should merge new posts to state',  () => {
        const subscriptionData: PostSub = {
            data: {
                postSub: {
                    mutation: Mutation.CREATED,
                    node: {
                        id: 'def',
                        text: 'Second!',
                        pictureUrl: 'random Coelho quote decorated in paint',
                        createdAt: new Date(),
                        user: { id: 'Jack' },
                        likes: [],
                        comments: []
                    }
                }
            }
        };
        const expected = {
            ...state, feed: [subscriptionData.data.postSub.node, ...state.feed]
        };
        const result = subscription.postReducer(state, { subscriptionData });
        expect(result).toEqual(expected);
    });

    it('should update existing posts', () => {
        const subscriptionData: PostSub = {
            data: {
                postSub: {
                    mutation: Mutation.UPDATED,
                    node: {
                        ...state.feed[0],
                        text: 'here is a much nicer pic',
                        pictureUrl: 'the much nicer pic'
                    }
                }
            }
        };
        const expected = {
            ...state, feed: [subscriptionData.data.postSub.node, state.feed[1]]
        };
        const result = subscription.postReducer(state, { subscriptionData });
        expect(result).toEqual(expected);
    });

    it('should delete posts', () => {
        const subscriptionData: PostSub = {
            data: {
                postSub: {
                    mutation: Mutation.DELETED,
                    previousValues: { id: 'abc' }
                }
            }
        };
        const expected = {
            ...state, feed: [state.feed[1]]
        };
        const result = subscription.postReducer(state, { subscriptionData });
        expect(result).toEqual(expected);
    });

    it('should return undefined when receiving an error', () => {
        const subscriptionData = { error: 'Something bad happened!' };
        const result = subscription.postReducer(state, { subscriptionData });
        expect(result).toBeUndefined();
    });

});
