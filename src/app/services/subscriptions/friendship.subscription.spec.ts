import {Mutation, User} from '../../models';
import {FriendshipSub, FriendshipSubscription} from './friendship.subscription';
import {PostService} from '../post.service';
import {TestBed} from '@angular/core/testing';

describe('Friendship Subscription', () => {

    const state: {dummy: string, currentUser: User} = {
        dummy: 'should not be touched',
        currentUser: {
            id: 'Jack01',
            addedFriends: [
                {
                    id: 'asd01',
                    accepted: true,
                    createdAt: new Date(),
                    initiator: { id: 'Jack01' },
                    target: { id: 'Jane01' }
                },
                {
                    id: 'asd02',
                    accepted: false,
                    createdAt: new Date(),
                    initiator: { id: 'Jack01' },
                    target: { id: 'Joe01' }
                }
            ],
            acceptedFriends: [
                {
                    id: 'asd03',
                    accepted: true,
                    createdAt: new Date(),
                    initiator: { id: 'John01' },
                    target: { id: 'Jack01' }
                }
            ]
        }
    };

    let subscription: FriendshipSubscription;
    let postServiceSpy: jasmine.SpyObj<PostService>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('PostService', ['triggerRefetch']);

        TestBed.configureTestingModule({
            providers: [
                FriendshipSubscription,
                { provide: PostService, useValue: spy }
            ]
        });

        subscription = TestBed.get(FriendshipSubscription);
        postServiceSpy = TestBed.get(PostService);
    });

    it('should add to be accepted friendships to the state',  () => {
        const subscriptionData: FriendshipSub = {
            data: {
                friendshipSub: {
                    mutation: Mutation.CREATED,
                    node: {
                        id: 'asd03',
                        accepted: false,
                        createdAt: new Date(),
                        initiator: { id: 'Joan01' },
                        target: { id: 'Jack01' }
                    }
                }
            }
        };
        const expected = {
            ...state, currentUser: {
                ...state.currentUser,
                acceptedFriends: [
                    ...state.currentUser.acceptedFriends,
                    subscriptionData.data.friendshipSub.node
                ]
            }
        };
        const result = subscription.friendshipReducer(state, { subscriptionData });
        expect(result).toEqual(expected);
    });

    it('should update the state when a pending friendship is accepted', () => {
        const subscriptionData: FriendshipSub = {
            data: {
                friendshipSub: {
                    mutation: Mutation.UPDATED,
                    node: {
                        ...state.currentUser.addedFriends[1],
                        accepted: true
                    }
                }
            }
        };
        const expected = {
            ...state, currentUser: {
                ...state.currentUser,
                addedFriends: [
                    state.currentUser.addedFriends[0],
                    subscriptionData.data.friendshipSub.node
                ]
            }
        };
        const result = subscription.friendshipReducer(state, { subscriptionData });
        expect(result).toEqual(expected);
    });

    it('should remove friendships from the state when they are deleted', () => {
        const subscriptionData: FriendshipSub = {
            data: {
                friendshipSub: {
                    mutation: Mutation.DELETED,
                    previousValues: { id: 'asd01' }
                }
            }
        };
        const expected = {
            ...state, currentUser: {
                ...state.currentUser,
                addedFriends: [state.currentUser.addedFriends[1]]
            }
        };
        const result = subscription.friendshipReducer(state, { subscriptionData });
        expect(result).toEqual(expected);
    });

    it('should return undefined when receiving an error', () => {
        const subscriptionData = { error: 'Something bad happened!' };
        const result = subscription.friendshipReducer(state, { subscriptionData });
        expect(result).toBeUndefined();
    });

});
