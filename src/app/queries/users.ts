import gql from 'graphql-tag';

const USER_FRAGMENT = gql`
    fragment UserInfo on User {
        id
        googleId
        givenName
        familyName
        pictureUrl
        createdAt
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
