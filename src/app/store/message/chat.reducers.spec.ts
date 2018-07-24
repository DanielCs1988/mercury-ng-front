import {Message} from '../../models';
import * as fromActions from './chat.actions';
import * as fromChat from './chat.reducers';

const received: Message = { content: 'your stuff', to: 'me', from: 'target', createdAt: 123, id: 1 };
const sent: Message = { content: 'my stuff', to: 'target', from: 'me', createdAt: 223, id: 2 };

describe('ChatReducer', () => {

    describe('undefined action', () => {
        it('should return the default state', () => {
            const { defaultState } = fromChat;
            const action = {} as any;
            const state = fromChat.chatReducer(undefined, action);

            expect(state).toBe(defaultState);
        });
    });

    describe('HISTORY_FETCHED action', () => {
        it('should add the message history to the correct target key', () => {
            const messages = [received, sent];
            const defaultState = {
                ...fromChat.defaultState,
                target: 'target'
            };
            const expected = {
                ...defaultState,
                history: {
                    'target': messages
                }
            };
            const action = new fromActions.HistoryFetched(messages);
            const state = fromChat.chatReducer(defaultState, action);

            expect(state).toEqual(expected);
        });
    });

    describe('MESSAGE_SENT action', () => {
        it('should add own messages to the target user\'s history ', () => {
            const defaultState = {
                ...fromChat.defaultState,
                history: {
                    'target': [received]
                }
            };
            const expected = {
                ...defaultState,
                history: {
                    'target': [received, sent]
                }
            };
            const action = new fromActions.MessageSent(sent);
            const state = fromChat.chatReducer(defaultState, action);

            expect(state).toEqual(expected);
        });
    });

    describe('RECEIVE_MESSAGE action', () => {
        it('should add received messages to the sending user\'s history ', () => {
            const defaultState = {
                ...fromChat.defaultState,
                history: {
                    'target': [sent]
                }
            };
            const expected = {
                ...defaultState,
                history: {
                    'target': [sent, received]
                }
            };
            const action = new fromActions.ReceiveMessage(received);
            const state = fromChat.chatReducer(defaultState, action);

            expect(state).toEqual(expected);
        });
    });

    describe('CHANGE_TARGET action', () => {
        it('should change current target when called upon ', () => {
            const target = 'target';
            const { defaultState } = fromChat;
            const expected = {
                ...defaultState,
                target: target,
                openChannels: [target]
            };
            const action = new fromActions.ChangeTarget(target);
            const state = fromChat.chatReducer(defaultState, action);
            expect(state).toEqual(expected);
        });

        it('should not add the same target to the openChannels more than once ', () => {
            const target = 'target';
            const { defaultState } = fromChat;
            const expected = {
                ...defaultState,
                target: target,
                openChannels: [target]
            };
            const action = new fromActions.ChangeTarget(target);
            let state = fromChat.chatReducer(defaultState, action);
            state = fromChat.chatReducer(state, action);
            expect(state).toEqual(expected);
        });
    });

    describe('CLOSE_CHAT action', () => {
        it('should null current target if chat is closed ', () => {
            const { defaultState } = fromChat;
            const action = new fromActions.CloseChat();
            const state = fromChat.chatReducer(defaultState, action);

            expect(state.target).toEqual(null);
        });
    });
});
