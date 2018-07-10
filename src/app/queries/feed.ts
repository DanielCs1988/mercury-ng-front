import gql from 'graphql-tag';

export const FEED_QUERY = gql`
    query SocialFeed {
        feed {
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
                post {
                    id
                }
                user {
                    id
                    givenName
                    familyName
                }
            }
            comments {
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
                    comment {
                        id
                    }
                    user {
                        id
                        givenName
                        familyName
                    }
                }
                post {
                    id
                }
            }
        }
    }
`;
