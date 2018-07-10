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
    organizer: User;
    participants: User[];
}
