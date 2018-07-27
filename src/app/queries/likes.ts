import gql from 'graphql-tag';
import {MIN_USER_FRAGMENT} from './users';

export const POST_LIKE_CORE = gql`
    fragment PostLikeCore on Postlike {
        __typename
        id
        post {
            id
        }
    }
`;

export const POST_LIKE_FRAGMENT = gql`
    fragment PostLikeParts on PostLike {
        ...PostLikeCore
        user {
            ...MinUserInfo
        }
    }
    ${POST_LIKE_CORE}
    ${MIN_USER_FRAGMENT}
`;

export const COMMENT_LIKE_PARTS = gql`
    fragment CommentLikeParts on CommentLike {
        __typename
        id
        user {
            ...MinUserInfo
        }
        comment {
            id
        }
    }
    ${MIN_USER_FRAGMENT}
`;

export const LIKE_POST = gql`
    mutation likePost($postId: ID!) {
        likePost(postId: $postId) {
            ...PostLikeParts
        }
    }
    ${POST_LIKE_FRAGMENT}
`;

export const DISLIKE_POST = gql`
    mutation dislikePost($id: ID!) {
        dislikePost(id: $id) {
            __typename
            id
        }
    }
`;

export const LIKE_COMMENT = gql`
    mutation likeComment($commentId: ID!) {
        likeComment(commentId: $commentId) {
            ...CommentLikeParts
        }
    }
    ${COMMENT_LIKE_PARTS}
`;

export const DISLIKE_COMMENT = gql`
    mutation dislikeComment($id: ID!) {
        dislikeComment(id: $id) {
            __typename
            id
        }
    }
`;

export const POST_LIKE_SUBSCRIPTION = gql`
    subscription postLikeSub {
        postLikeSub {
            mutation
            node {
                __typename
                id
                user {
                    id
                    givenName
                    familyName
                    pictureUrl
                }
                post {
                    id
                }
            }
            previousValues { id }
        }
    }
`;

export const COMMENT_LIKE_SUBSCRIPTION = gql`
    subscription commentLikeSub($postId: ID!) {
        commentLikeSub(postId: $postId) {
            mutation
            node {
                __typename
                id
                user {
                    id
                    givenName
                    familyName
                    pictureUrl
                }
                comment {
                    id
                }
            }
            previousValues { id }
        }
    }
`;
