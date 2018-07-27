import gql from 'graphql-tag';
import {POST_FRAGMENT} from './post';

export const FEED_QUERY = gql`
    query SocialFeed($first: Int, $skip: Int) {
        feed(orderBy: createdAt_DESC, first: $first, skip: $skip) {
            ...PostParts
        }
    }
    ${POST_FRAGMENT}
`;
