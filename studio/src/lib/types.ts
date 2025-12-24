export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio: string;
}

export interface Comment {
  id: string;
  text: string;
  user: User; // This will be denormalized
  createdAt: Date; // Will become commentDate from firestore
  // Firestore fields
  mediaContentId: string;
  authorId: string;
  authorName?: string;
  authorAvatar?: string;
  commentDate: any; // Firestore Timestamp
}

export interface Media {
  id: string;
  type: 'video' | 'photo';
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  user: User;
  createdAt: Date;
  views: number;
  likes: number;
  comments: Omit<Comment, 'user' | 'mediaContentId'>[];
  imageHint: string;
  mediaUrl: string;
}
