import { Artist } from '@/lib/types';

export const mockArtists: Artist[] = [
  {
    id: 'artist-1',
    name: 'Taylor Swift',
    bio: 'Multi-platinum recording artist known for chart-topping hits and sold-out stadium tours.',
    image: undefined,
    eventIds: ['event-1', 'event-2'],
  },
  {
    id: 'artist-2',
    name: 'Ed Sheeran',
    bio: 'Grammy-winning singer-songwriter with global hits and acoustic performances.',
    image: undefined,
    eventIds: ['event-3'],
  },
  {
    id: 'artist-3',
    name: 'Beyoncé',
    bio: 'Iconic performer, entrepreneur, and cultural phenomenon with legendary live shows.',
    image: undefined,
    eventIds: ['event-4'],
  },
  {
    id: 'artist-4',
    name: 'The Weeknd',
    bio: 'Chart-topping R&B artist known for atmospheric music and electrifying performances.',
    image: undefined,
    eventIds: ['event-5'],
  },
];
