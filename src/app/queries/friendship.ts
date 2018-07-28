import gql from 'graphql-tag';
import {MIN_USER_FRAGMENT} from './users';

export const FRIENDSHIP_FRAGMENT = gql`
    fragment FriendshipParts on Friendship {
        __typename
        id
        createdAt
        accepted
        initiator {
            ...MinUserInfo
        }
        target {
            ...MinUserInfo
        }
    }
    ${MIN_USER_FRAGMENT}
`;

export const FETCH_FRIENDS = gql`
    query fetchFriends {
        currentUser {
            ...MinUserInfo
            addedFriends {
                ...FriendshipParts
            }
            acceptedFriends {
                ...FriendshipParts
            }
        }
    }
    ${MIN_USER_FRAGMENT}
    ${FRIENDSHIP_FRAGMENT}
`;

export const ADD_FRIEND = gql`
    mutation addFriend($targetId: ID!) {
        addFriend(targetId: $targetId) {
            ...FriendshipParts
        }
    }
    ${FRIENDSHIP_FRAGMENT}
`;

export const ACCEPT_FRIEND = gql`
    mutation acceptFriend($id: ID!) {
        acceptFriend(id: $id) {
            __typename
            id
            accepted
        }
    }
`;

export const DELETE_FRIEND = gql`
    mutation deleteFriend($id: ID!) {
        deleteFriend(id: $id) {
            __typename
            id
        }
    }
`;

export const FRIENDSHIP_SUBSCRIPTION = gql`
    subscription friendshipSub {
        friendshipSub {
            mutation
            node {
                __typename
                id
                createdAt
                accepted
                initiator {
                    id
                    givenName
                    familyName
                    pictureUrl
                }
                target {
                    id
                    givenName
                    familyName
                    pictureUrl
                }
            }
            previousValues { id }
        }
    }
`;
