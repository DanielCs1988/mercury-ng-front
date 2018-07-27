import gql from 'graphql-tag';
import {COMMENT_LIKE_FRAGMENT} from './likes';
import {MIN_USER_FRAGMENT} from './users';

export const COMMENT_CORE = gql`
    fragment CommentCore on Comment {
        __typename
        id
        text
        createdAt
    }
`;

export const COMMENT_FRAGMENT = gql`
    fragment CommentParts on Comment {
        ...CommentCore
        user {
            ...MinUserInfo
        }
        likes {
            ...CommentLikeParts
        }
    }
    ${COMMENT_CORE}
    ${MIN_USER_FRAGMENT}
    ${COMMENT_LIKE_FRAGMENT}
`;

export const FETCH_COMMENTS = gql`
    query fetchComments($postId: ID!) {
        comments(postId: $postId) {
            ...CommentParts
        }
    }
    ${COMMENT_FRAGMENT}
`;

export const CREATE_COMMENT_MUTATION = gql`
    mutation createComment($postId: ID!, $text: String!) {
        createComment(postId: $postId, text: $text) {
            ...CommentParts
        }
    }
    ${COMMENT_FRAGMENT}
`;

export const UPDATE_COMMENT_MUTATION = gql`
    mutation updateComment($id: ID!, $text: String!) {
        updateComment(id: $id, text: $text) {
            ...CommentCore
        }
    }
    ${COMMENT_CORE}
`;

export const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($id: ID!) {
        deleteComment(id: $id) {
            __typename
            id
        }
    }
`;

export const COMMENT_SUBSCRIPTION = gql`
    subscription commentSub($postId: ID!) {
        commentSub(postId: $postId) {
            mutation
            node {
                __typename
                id
                text
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

export const COMMENT_LIKES = gql`
    fragment commentLikes on Comment {
        __typename
        id
        likes {
            ...CommentLikeParts
        }
    }
    ${COMMENT_LIKE_FRAGMENT}
`;
