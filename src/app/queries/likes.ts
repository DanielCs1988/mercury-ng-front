import gql from 'graphql-tag';

export const POST_LIKE_PARTS = gql`
    fragment PostLikeParts on PostLike {
        id
        __typename
        user {
            id
            givenName
            familyName
        }
        post {
            id
        }
    }
`;

export const COMMENT_LIKE_PARTS = gql`
    fragment CommentLikeParts on CommentLike {
        id
        __typename
        user {
            id
            givenName
            familyName
        }
        comment {
            id
        }
    }
`;

export const LIKE_POST = gql`
    mutation likePost($postId: ID!) {
        likePost(postId: $postId) {
            ...PostLikeParts
        }
    }
    ${POST_LIKE_PARTS}
`;

export const DISLIKE_POST = gql`
    mutation dislikePost($id: ID!) {
        dislikePost(id: $id) {
            id
            __typename
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
            id
            __typename
        }
    }
`;

export const POST_LIKE_SUBSCRIPTION = gql`
    subscription postLikeSub {
        postLikeSub {
            node {
                id
                __typename
                user {
                    id
                    givenName
                    familyName
                }
                post {
                    id
                }
            }
            previousValues {
                id
            }
        }
    }
`;

export const COMMENT_LIKE_SUBSCRIPTION = gql`
    subscription commentLikeSub {
        commentLikeSub {
            node {
                id
                __typename
                user {
                    id
                    givenName
                    familyName
                }
                comment {
                    id
                    post {
                        id
                    }
                }
            }
            previousValues {
                id
            }
        }
    }
`;

export const GET_COMMENT_AND_POST_ID = gql`
    fragment getCommentAndPostId on CommentLike {
        comment {
            id
            post {
                id
            }
        }
    }
`;
