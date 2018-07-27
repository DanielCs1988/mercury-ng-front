import gql from 'graphql-tag';
import {MIN_USER_FRAGMENT} from './users';

const FRIENDSHIP_CORE = gql`
    fragment FriendshipCore on Friendship {
        __typename
        id
        createdAt
        accepted
    }
`;

export const FRIENDSHIP_FRAGMENT = gql`
    fragment FriendshipParts on Friendship {
        ...FriendshipCore
        initiator {
            ...MinUserInfo
        }
        target {
            ...MinUserInfo
        }
    }
    ${MIN_USER_FRAGMENT}
    ${FRIENDSHIP_CORE}
`;

export const ADD_FRIEND = gql`
    mutation addFriend($targetId: ID!) {
        addFriend(targetId: $targetId) {
            ...FriendshipParts
        }
    }
`;

export const ACCEPT_FRIEND = gql`
    mutation acceptFriend($id: ID!) {
        acceptFriend(id: $id) {
            ...FriendshipCore
        }
    }
    ${FRIENDSHIP_CORE}
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
            __typename
            id
            createdAt
            accepted
        }
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
`;
