import gql from 'graphql-tag';

const POST_FRAGMENT = gql`
  fragment PostParts on Post {
    id
    text
    pictureUrl
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
    comments {
      id
    }
  }
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
      __typename
      id
      text
      pictureUrl
    }
  }
`;

export const DELETE_POST_MUTATION = gql`
  mutation deletePost($id: ID!) {
    deletePost(id: $id) {
      __typename
      id
    }
  }
`;

export const POST_SUBSCRIPTION = gql`
  subscription postSub {
    postSub {
      node { ...PostParts }
      previousValues { id }
    }
  }
  ${POST_FRAGMENT}
`;
