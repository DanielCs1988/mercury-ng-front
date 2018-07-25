import * as fromEvents from './event.reducers';
import * as fromActions from './event.actions';
import {Event, User} from '../../models';

const person1: User = { id: 'asd', googleId: 'wasd', givenName: 'Jack', familyName: 'Smith', pictureUrl: 'bleh', createdAt: null };
const person2: User = { id: '123', googleId: '456', givenName: 'Jane', familyName: 'Smith', pictureUrl: 'blah', createdAt: null };

const event1: Event = {
    _id: 'id1', name: 'name1', description: 'too lazy to write one',
    createdAt: 123, startDate: 234, endDate: 345, pictureUrl: 'smh nice',
    location: 'here', organizer: person1, participants: [person1, person2]
};
const event2: Event = {
    _id: 'id2', name: 'name2', description: 'still too lazy to write one',
    createdAt: 124, startDate: 235, endDate: 346, pictureUrl: 'smh nicer',
    location: 'there', organizer: person2, participants: [person2]
};

describe('EventReducer', () => {

    describe('undefined action', () => {
        it('should return the default state', () => {
            const { defaultState } = fromEvents;
            const action = {} as any;
            const state = fromEvents.eventReducer(undefined, action);

            expect(state).toBe(defaultState);
        });
    });

    describe('EVENTS_FETCHED action', () => {
        it('should merge events response data to the store ', () => {
            const { defaultState } = fromEvents;
            const expected = {
                ...defaultState,
                events: [event1, event2],
                fetchedEvents: true
            };
            const action = new fromActions.EventsFetched([event1, event2]);
            const state = fromEvents.eventReducer(defaultState, action);

            expect(state).toEqual(expected);
        });
    });

    describe('EVENTS_CREATED action', () => {
        it('should add new events to the store, clearing the optimistic responses ', () => {
            const defaultState = {
                ...fromEvents.defaultState,
                events: [{ ...event1, _id: '' }]
            };
            const expected = {
                ...defaultState,
                events: [event1]
            };
            const action = new fromActions.EventCreated(event1);
            const state = fromEvents.eventReducer(defaultState, action);

            expect(state).toEqual(expected);
        });

        it('should add the optimistic response to the store, leaving others untouched ', () => {
            const defaultState = {
                ...fromEvents.defaultState,
                events: [{ ...event1, _id: '' }]
            };
            const expected = {
                ...defaultState,
                events: [
                    { ...event1, _id: '' },
                    { ...event2, _id: '' }
                ]
            };
            const action = new fromActions.EventCreated({ ...event2, _id: '' });
            const state = fromEvents.eventReducer(defaultState, action);

            expect(state).toEqual(expected);
        });
    });

    describe('EVENT_UPDATED action', () => {
        it('should update events ', () => {
            const updatedEvent = {
                ...event2,
                name: 'new name', description: 'new desc', endDate: 1000,
                participants: []
            };
            const defaultState = {
                ...fromEvents.defaultState,
                events: [event1, event2]
            };
            const expected = {
                ...defaultState,
                events: [event1, updatedEvent]
            };
            const action = new fromActions.EventUpdated(updatedEvent);
            const state = fromEvents.eventReducer(defaultState, action);

            expect(state).toEqual(expected);
        });
    });

    describe('EVENT_DELETED action', () => {
        it('should delete events ', () => {
            const defaultState = {
                ...fromEvents.defaultState,
                events: [event1, event2]
            };
            const expected = {
                ...defaultState,
                events: [event1]
            };
            const action = new fromActions.EventDeleted(event2._id);
            const state = fromEvents.eventReducer(defaultState, action);

            expect(state).toEqual(expected);
        });
    });

});
