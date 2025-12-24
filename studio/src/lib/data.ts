import { User, Media } from './types';
import { subDays, subHours, subMinutes } from 'date-fns';
import { PlaceHolderImages } from './placeholder-images';

export const users: User[] = [
  { id: 'user-1', username: 'aurora', name: 'Aurora', avatar: 'https://i.pravatar.cc/150?u=aurora', bio: 'Digital artist & coffee enthusiast.' },
  { id: 'user-2', username: 'finn', name: 'Finn', avatar: 'https://i.pravatar.cc/150?u=finn', bio: 'Capturing moments, one photo at a time.' },
  { id: 'user-3', username: 'leo', name: 'Leo', avatar: 'https://i.pravatar.cc/150?u=leo', bio: 'Filmmaker and storyteller.' },
  { id: 'user-4', username: 'nova', name: 'Nova', avatar: 'https://i.pravatar.cc/150?u=nova', bio: 'Exploring the world through my lens.' },
];

export const media: Omit<Media, 'id' | 'user' | 'createdAt' | 'views' | 'likes' | 'comments'>[] = [
  {
    type: 'photo',
    title: 'Misty Mountains',
    description: 'The sun rises over a misty mountain range.',
    url: PlaceHolderImages[0].imageUrl,
    thumbnailUrl: PlaceHolderImages[0].imageUrl,
    imageHint: PlaceHolderImages[0].imageHint,
    mediaUrl: PlaceHolderImages[0].imageUrl
  },
  {
    type: 'photo',
    title: 'City at Night',
    description: 'A bustling city skyline after dark.',
    url: PlaceHolderImages[1].imageUrl,
    thumbnailUrl: PlaceHolderImages[1].imageUrl,
    imageHint: PlaceHolderImages[1].imageHint,
    mediaUrl: PlaceHolderImages[1].imageUrl
  },
  {
    type: 'video',
    title: 'Ocean Waves',
    description: 'Calm waves washing over a sandy beach.',
    url: '', // Video URL would go here
    thumbnailUrl: PlaceHolderImages[2].imageUrl,
    imageHint: PlaceHolderImages[2].imageHint,
    mediaUrl: ''
  },
  {
    type: 'photo',
    title: 'Reflections',
    description: 'A thoughtful portrait.',
    url: PlaceHolderImages[3].imageUrl,
    thumbnailUrl: PlaceHolderImages[3].imageUrl,
    imageHint: PlaceHolderImages[3].imageHint,
    mediaUrl: PlaceHolderImages[3].imageUrl
  },
    {
    type: 'photo',
    title: 'Forest Path',
    description: 'A quiet path through a dense forest.',
    url: PlaceHolderImages[4].imageUrl,
    thumbnailUrl: PlaceHolderImages[4].imageUrl,
    imageHint: PlaceHolderImages[4].imageHint,
    mediaUrl: PlaceHolderImages[4].imageUrl
  },
  {
    type: 'video',
    title: 'Flower Blooming',
    description: 'Time-lapse of a flower opening its petals.',
    url: '', // Video URL
    thumbnailUrl: PlaceHolderImages[5].imageUrl,
    imageHint: PlaceHolderImages[5].imageHint,
    mediaUrl: ''
  },
  {
    type: 'photo',
    title: 'Modern Architecture',
    description: 'Geometric shapes of a modern building.',
    url: PlaceHolderImages[6].imageUrl,
    thumbnailUrl: PlaceHolderImages[6].imageUrl,
    imageHint: PlaceHolderImages[6].imageHint,
    mediaUrl: PlaceHolderImages[6].imageUrl
  },
  {
    type: 'photo',
    title: 'Candid Smile',
    description: 'A happy moment on a city street.',
    url: PlaceHolderImages[7].imageUrl,
    thumbnailUrl: PlaceHolderImages[7].imageUrl,
    imageHint: PlaceHolderImages[7].imageHint,
    mediaUrl: PlaceHolderImages[7].imageUrl
  },
];
