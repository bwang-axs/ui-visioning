import { Event } from '@/lib/types';

export const mockEvents: Event[] = [
  {
    id: 'event-1',
    title: 'The Eras Tour',
    artistId: 'artist-1',
    date: '2024-06-15T19:00:00',
    venue: {
      name: 'Madison Square Garden',
      address: '4 Pennsylvania Plaza, New York, NY 10001',
    },
    description: 'An unforgettable journey through all eras of music featuring greatest hits and fan favorites.',
    category: 'Pop',
    sections: [
      {
        id: 'section-1',
        name: 'Floor A',
        price: 299,
        rows: [
          {
            row: 'A',
            seats: [
              { seat: '1', available: true, price: 299 },
              { seat: '2', available: true, price: 299 },
              { seat: '3', available: false, price: 299 },
              { seat: '4', available: true, price: 299 },
              { seat: '5', available: true, price: 299 },
            ],
          },
          {
            row: 'B',
            seats: [
              { seat: '1', available: true, price: 299 },
              { seat: '2', available: false, price: 299 },
              { seat: '3', available: true, price: 299 },
              { seat: '4', available: true, price: 299 },
              { seat: '5', available: false, price: 299 },
            ],
          },
        ],
      },
      {
        id: 'section-2',
        name: 'Lower Bowl',
        price: 199,
        rows: [
          {
            row: '1',
            seats: [
              { seat: '1', available: true, price: 199 },
              { seat: '2', available: true, price: 199 },
              { seat: '3', available: true, price: 199 },
              { seat: '4', available: false, price: 199 },
            ],
          },
          {
            row: '2',
            seats: [
              { seat: '1', available: true, price: 199 },
              { seat: '2', available: true, price: 199 },
              { seat: '3', available: true, price: 199 },
              { seat: '4', available: true, price: 199 },
            ],
          },
        ],
      },
      {
        id: 'section-3',
        name: 'Upper Bowl',
        price: 99,
        rows: [
          {
            row: '1',
            seats: [
              { seat: '1', available: true, price: 99 },
              { seat: '2', available: true, price: 99 },
              { seat: '3', available: true, price: 99 },
              { seat: '4', available: true, price: 99 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'event-2',
    title: 'The Eras Tour - Night 2',
    artistId: 'artist-1',
    date: '2024-06-16T19:00:00',
    venue: {
      name: 'Madison Square Garden',
      address: '4 Pennsylvania Plaza, New York, NY 10001',
    },
    description: 'Second night of The Eras Tour with surprise songs and special performances.',
    category: 'Pop',
    sections: [
      {
        id: 'section-1',
        name: 'Floor A',
        price: 299,
        rows: [
          {
            row: 'A',
            seats: [
              { seat: '1', available: false, price: 299 },
              { seat: '2', available: true, price: 299 },
              { seat: '3', available: true, price: 299 },
            ],
          },
        ],
      },
      {
        id: 'section-2',
        name: 'Lower Bowl',
        price: 199,
        rows: [
          {
            row: '1',
            seats: [
              { seat: '1', available: true, price: 199 },
              { seat: '2', available: true, price: 199 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'event-3',
    title: 'Mathematics Tour',
    artistId: 'artist-2',
    date: '2024-07-20T20:00:00',
    venue: {
      name: 'Hollywood Bowl',
      address: '2301 N Highland Ave, Los Angeles, CA 90068',
    },
    description: 'Intimate acoustic performance featuring hits from all albums.',
    category: 'Pop',
    sections: [
      {
        id: 'section-1',
        name: 'Floor',
        price: 249,
        rows: [
          {
            row: 'A',
            seats: [
              { seat: '1', available: true, price: 249 },
              { seat: '2', available: true, price: 249 },
              { seat: '3', available: true, price: 249 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'event-4',
    title: 'Renaissance World Tour',
    artistId: 'artist-3',
    date: '2024-08-10T19:30:00',
    venue: {
      name: 'SoFi Stadium',
      address: '1000 S Prairie Ave, Inglewood, CA 90301',
    },
    description: 'The ultimate celebration of music, culture, and performance.',
    category: 'R&B',
    sections: [
      {
        id: 'section-1',
        name: 'VIP Floor',
        price: 599,
        rows: [
          {
            row: 'A',
            seats: [
              { seat: '1', available: true, price: 599 },
              { seat: '2', available: false, price: 599 },
            ],
          },
        ],
      },
      {
        id: 'section-2',
        name: 'Lower Level',
        price: 299,
        rows: [
          {
            row: '1',
            seats: [
              { seat: '1', available: true, price: 299 },
              { seat: '2', available: true, price: 299 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'event-5',
    title: 'After Hours Til Dawn Tour',
    artistId: 'artist-4',
    date: '2024-09-05T20:00:00',
    venue: {
      name: 'MetLife Stadium',
      address: '1 MetLife Stadium Dr, East Rutherford, NJ 07073',
    },
    description: 'Epic stadium show featuring hits from After Hours and Dawn FM.',
    category: 'R&B',
    sections: [
      {
        id: 'section-1',
        name: 'Floor',
        price: 349,
        rows: [
          {
            row: 'A',
            seats: [
              { seat: '1', available: true, price: 349 },
              { seat: '2', available: true, price: 349 },
              { seat: '3', available: true, price: 349 },
            ],
          },
        ],
      },
    ],
  },
];
