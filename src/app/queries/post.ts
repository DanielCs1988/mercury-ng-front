import gql from 'graphql-tag';
import {COMMENT_FRAGMENT} from './comment';
import {POST_LIKE_FRAGMENT} from './likes';
import {MIN_USER_FRAGMENT} from './users';

export const POST_CORE = gql`
    fragment PostCore on Post {
        __typename
        id
        text
        pictureUrl
        createdAt
    }
`;

export const POST_FRAGMENT = gql`
    fragment PostParts on Post {
        ...PostCore
        user {
            ...MinUserInfo
        }
        likes {
            ...PostLikeParts
        }
    }
    ${POST_CORE}
    ${MIN_USER_FRAGMENT}
    ${POST_LIKE_FRAGMENT}
`;

export const CREATE_POST_MUTATION = gql`
    mutation createPost($text: String!, $pictureUrl: String) {
        createPost(text: $text, pictureUrl: $pictureUrl) {
            ...PostParts
        }
    }
    ${POST_FRAGMENT}
`;

export const UPDATE_POST_MUTATION = gql`
    mutation updatePost($id: ID!, $text: String, $pictureUrl: String) {
        updatePost(id: $id, text: $text, pictureUrl: $pictureUrl) {
            ...PostCore
        }
    }
    ${POST_CORE}
`;

export const DELETE_POST_MUTATION = gql`
    mutation deletePost($id: ID!) {
        deletePost(id: $id) {
            id
            __typename
        }
    }
`;

export const POST_SUBSCRIPTION = gql`
    subscription postSub {
        postSub {
            mutation
            node {
                __typename
                id
                text
                pictureUrl
                createdAt
                user {
                    id
                    givenName
                    familyName
                    pictureUrl
                }
                likes {
                    id
                }
            }
            previousValues { id }
        }
    }
`;

export const MIN_POST_FRAGMENT = gql`
    fragment minPost on Post {
        id
        __typename
        comments {
            ...CommentParts
        }
    }
    ${COMMENT_FRAGMENT}
`;

export const POST_LIKES = gql`
    fragment postLikes on Post {
        __typename
        id
        likes {
            ...PostLikeParts
        }
    }
    ${POST_LIKE_FRAGMENT}
`;
