import { Injectable } from '@angular/core';
import {Apollo} from 'apollo-angular';
import {CREATE_POST_MUTATION, DELETE_POST_MUTATION, UPDATE_POST_MUTATION} from '../queries/post';
import {FEED_QUERY} from '../queries/feed';
import {isDuplicateEntry} from './utils';
import {UserService} from './user.service';
import {User} from '../models';

@Injectable({
  providedIn: 'root'
})
export class PostService {

    private currentUser: User;

    constructor(private apollo: Apollo, private userService: UserService) {
        this.userService.currentUser.subscribe(user => this.currentUser = user);
    }

  createPost(text: string, pictureUrl?: string) {
    this.apollo.mutate({
      mutation: CREATE_POST_MUTATION,
      variables: { text, pictureUrl },

      optimisticResponse: {
        __typename: 'Mutation',
        createPost :{
          __typename: 'Post',
          id: '',
          text: text,
          pictureUrl: pictureUrl,
          createdAt: new Date(),
          likes: [],
          comments: [],
          user: this.currentUser
        }
      },

      update: (proxy, { data: { createPost } }) => {
        const data: any = proxy.readQuery({ query: FEED_QUERY });
        // if (isDuplicateEntry(createPost, data.feed)) {
        //   return;
        // }
        data.feed.push(createPost);
        proxy.writeQuery({ query: FEED_QUERY, data });
      }
    }).subscribe();
  }

  updatePost(id: string, text?: string, pictureUrl?: string) {
    this.apollo.mutate({
      mutation: UPDATE_POST_MUTATION,
      variables: { id, text, pictureUrl },

      optimisticResponse: {
        __typename: 'Mutation',
        updatePost: {
          __typename: 'Post',
          id: id,
          text: text,
          pictureUrl: pictureUrl
        }
      }
    }).subscribe();
  }

  deletePost(id: string) {
    this.apollo.mutate({
      mutation: DELETE_POST_MUTATION,
      variables: { id },

      optimisticResponse: {
        __typename: 'Mutation',
        deletePost: {
          __typename: 'Post',
          id: id
        }
      },

      update: (proxy, { data: deletePost }) => {
        const data: any = proxy.readQuery({ query: FEED_QUERY });
        data.feed = data.feed.filter(post => post.id !== id);
        proxy.writeQuery({ query: FEED_QUERY, data });
      }
    }).subscribe();
  }
}
