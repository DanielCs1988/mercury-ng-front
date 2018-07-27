import gql from 'graphql-tag';

export const USER_FRAGMENT = gql`
    fragment UserInfo on User {
        id
        googleId
        givenName
        familyName
        pictureUrl
        createdAt
    }
`;

export const MIN_USER_FRAGMENT = gql`
    fragment MinUserInfo on User {
        id
        givenName
        familyName
        pictureUrl
    }
`;

export const USERS_QUERY = gql`
    query allUsers {
        users {
            ...UserInfo
        }
    }
    ${USER_FRAGMENT}
`;

export const CURRENT_USER_QUERY = gql`
    query currentUser {
        currentUser {
            ...UserInfo
        }
    }
    ${USER_FRAGMENT}
`;

export const NEW_USER_SUBSCRIPTION = gql`
    subscription newUser {
        newUser {
            node {
                __typename
                id
                googleId
                givenName
                familyName
                pictureUrl
                createdAt
            }
        }
    }
`;
