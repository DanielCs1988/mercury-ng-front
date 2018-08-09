import {TestBed} from '@angular/core/testing';
import {Apollo} from 'apollo-angular';
import {CommentLikeSub, CommentLikeSubscription} from './comment-like.subscription';
import {COMMENT_LIKE_FRAGMENT} from '../../queries/likes';
import {Comment, Mutation} from '../../models';


describe('CommentLike Subscription', () => {

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
                likes: [
                    {
                        id: 'liek2',
                        user: { id: 'mate' }
                    },
                    {
                        id: 'liek3',
                        user: { id: 'Jack' }
                    },
                ]
            }
        ]
    };

    let subscription: CommentLikeSubscription;
    let apolloSpy: jasmine.SpyObj<Apollo>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('Apollo', ['getClient']);
        const readFragment = (params: any) => ({ comment: { id: 'smh' } });

        TestBed.configureTestingModule({
            providers: [
                CommentLikeSubscription,
                { provide: Apollo, useValue: spy }
            ]
        });

        subscription = TestBed.get(CommentLikeSubscription);
        apolloSpy = TestBed.get(Apollo);
        apolloSpy.getClient.and.returnValue({ readFragment });
    });

    it('Apollo should be injected', () => {
        expect(apolloSpy).toBeTruthy();
    });

    it('Apollo getClient should return the dummy comment id when called', () => {
        const data: any = apolloSpy.getClient().readFragment({
            id: 'CommentLike:liek3',
            fragment: COMMENT_LIKE_FRAGMENT,
            fragmentName: 'CommentLikeParts'
        });
        expect(data.comment.id).toBe('smh');
    });

    it('should add new comment like to the state', () => {
        const subscriptionData: CommentLikeSub = {
            data: {
                commentLikeSub: {
                    mutation: Mutation.CREATED,
                    node: {
                        id: 'liek4',
                        user: { id: 'randomJoe' },
                        comment: { id: 'smh' }
                    }
                }
            }
        };
        const expected = {
            ...state,
            comments: [state.comments[0], {
                ...state.comments[1], likes: [...state.comments[1].likes, subscriptionData.data.commentLikeSub.node]
            }]
        };
        const result = subscription.commentLikeReducer(state, { subscriptionData });
        expect(result).toEqual(expected);
    });

    it('should remove comment likes', () => {
        const subscriptionData: CommentLikeSub = {
            data: {
                commentLikeSub: {
                    mutation: Mutation.DELETED,
                    previousValues: { id: 'liek3' }
                }
            }
        };
        const expected = {
            ...state,
            comments: [state.comments[0], {
                ...state.comments[1], likes: [state.comments[1].likes[0]]
            }]
        };
        const result = subscription.commentLikeReducer(state, { subscriptionData });
        expect(result).toEqual(expected);
    });

});
