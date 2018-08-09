import {TestBed} from '@angular/core/testing';
import {Apollo} from 'apollo-angular';
import {POST_LIKE_FRAGMENT} from '../../queries/likes';
import {Mutation, Post} from '../../models';
import {PostLikeSub, PostLikeSubscription} from './post-like.subscription';


describe('PostLike Subscription', () => {

    const state: {dummy: string, feed: Post[]} = {
        dummy: 'should not be touched',
        feed: [
            {
                id: 'abc',
                text: 'First!',
                pictureUrl: 'random food',
                createdAt: new Date(),
                user: { id: 'mate' },
                likes: [{
                    id: 'liek',
                    user: { id: 'mate' }
                }, {
                    id: 'liek4',
                    user: { id: 'Jack' }
                }],
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

    let subscription: PostLikeSubscription;
    let apolloSpy: jasmine.SpyObj<Apollo>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('Apollo', ['getClient']);
        const readFragment = (params: any) => ({ post: { id: 'abc' } });

        TestBed.configureTestingModule({
            providers: [
                PostLikeSubscription,
                { provide: Apollo, useValue: spy }
            ]
        });

        subscription = TestBed.get(PostLikeSubscription);
        apolloSpy = TestBed.get(Apollo);
        apolloSpy.getClient.and.returnValue({ readFragment });
    });

    it('Apollo should be injected', () => {
        expect(apolloSpy).toBeTruthy();
    });

    it('Apollo getClient should return the dummy post id when called', () => {
        const data: any = apolloSpy.getClient().readFragment({
            id: 'CommentLike:liek4',
            fragment: POST_LIKE_FRAGMENT,
            fragmentName: 'PostLikeParts'
        });
        expect(data.post.id).toBe('abc');
    });

    it('should add new post like to the state', () => {
        const subscriptionData: PostLikeSub = {
            data: {
                postLikeSub: {
                    mutation: Mutation.CREATED,
                    node: {
                        id: 'liek5',
                        user: { id: 'Jane' },
                        post: { id: 'abc' }
                    }
                }
            }
        };
        const expected = {
            ...state,
            feed: [{
                ...state.feed[0],
                likes: [...state.feed[0].likes, subscriptionData.data.postLikeSub.node]
            }, state.feed[1]]
        };
        const result = subscription.postLikeReducer(state, { subscriptionData });
        expect(result).toEqual(expected);
    });

    it('should remove post likes', () => {
        const subscriptionData: PostLikeSub = {
            data: {
                postLikeSub: {
                    mutation: Mutation.DELETED,
                    previousValues: { id: 'liek4' }
                }
            }
        };
        const expected = {
            ...state,
            feed: [{
                ...state.feed[0], likes: [state.feed[0].likes[0]]
            }, state.feed[1]]
        };
        const result = subscription.postLikeReducer(state, { subscriptionData });
        expect(result).toEqual(expected);
    });

});
