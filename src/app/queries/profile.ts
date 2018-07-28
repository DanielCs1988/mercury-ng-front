import gql from 'graphql-tag';
import {POST_FRAGMENT} from './post';
import {USER_FRAGMENT} from './users';

export const PROFILE_FRAGMENT = gql`
    fragment ProfileParts on Profile {
        id
        introduction
        birthday
        address
        email
        phone
    }
`;

export const FETCH_PROFILE = gql`
    query fetchProfile($id: ID!) {
        user(id: $id) {
            ...UserInfo
            profile {
                ...ProfileParts
            }
            posts {
                ...PostParts
            }
            addedFriends {
                accepted
                target {
                    id
                    givenName
                    familyName
                    pictureUrl
                }
            }
            acceptedFriends {
                accepted
                initiator {
                    id
                    givenName
                    familyName
                    pictureUrl
                }
            }
        }
    }
    ${USER_FRAGMENT}
    ${PROFILE_FRAGMENT}
    ${POST_FRAGMENT}
`;

export const CREATE_PROFILE = gql`
    mutation createProfile($data: ProfileInput) {
        createProfile(data: $data) {
            ...ProfileParts
        }
    }
    ${PROFILE_FRAGMENT}
`;

export const UPDATE_PROFILE = gql`
    mutation updateProfile($id: ID!, $data: ProfileInput) {
        updateProfile(id: $id, data: $data) {
            ...ProfileParts
        }
    }
    ${PROFILE_FRAGMENT}
`;
