import gql from 'graphql-tag';

export const COMMENT_FRAGMENT = gql`
    fragment CommentParts on Comment {
        id
        text
        createdAt
        __typename
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
`;

export const COMMENTS_QUERY = gql`
    query comments($postId: ID!) {
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
            id
            text
            __typename
        }
    }
`;

export const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($id: ID!) {
        deleteComment(id: $id) {
            id
            __typename
        }
    }
`;
