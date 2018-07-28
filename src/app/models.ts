export interface Post {
  id: string;
  text: string;
  pictureUrl: string;
  createdAt: Date;
  user: User;
  likes: Like[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  createdAt: Date;
  user: User;
  likes: Like[];
}

export interface User {
  id: string;
  googleId?: string;
  givenName?: string;
  familyName?: string;
  pictureUrl?: string;
  createdAt?: Date;
}

export interface Like {
  id: string;
  user: User;
}

export interface Event {
    _id: string;
    name: string;
    description: string;
    pictureUrl?: string;
    startDate: number;
    endDate: number;
    createdAt?: number;
    location: string;
    organizer: User;
    participants: User[];
}

export interface Message {
    id?: number;
    content: string;
    from?: string;
    to: string;
    createdAt?: number;
}

export interface Article {
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    source: string;
}

export interface Weather {
    location: string;
    summary: string;
    icon: string;
    temperature: number;
}

export interface Friendship {
    id: string;
    createdAt: Date;
    accepted?: boolean;
}

export const enum Mutation {
    CREATED = 'CREATED',
    UPDATED = 'UPDATED',
    DELETED = 'DELETED'
}
