import { Event } from '@/lib/types';
import { generateSeats, stadiumSectionPositions, graySections } from './stadiumLayout';

// Helper to create a section
function createSection(
  id: string,
  name: string,
  price: number,
  numRows: number,
  seatsPerRow: number,
  availabilityRatio: number = 0.8
) {
  // Override availability for gray sections
  const isGray = graySections.has(name);
  const finalAvailability = isGray ? 0.3 : availabilityRatio;
  
  return {
    id,
    name,
    price,
    rows: generateSeats(id, name, numRows, seatsPerRow, price, finalAvailability),
    position: stadiumSectionPositions[name] || { x: 50, y: 50 },
  };
}

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
      // Floor sections (A-J)
      createSection('section-A', 'A', 350, 15, 20, 0.85),
      createSection('section-B', 'B', 350, 15, 20, 0.85),
      createSection('section-C', 'C', 350, 15, 20, 0.85),
      createSection('section-D', 'D', 350, 15, 18, 0.85),
      createSection('section-E', 'E', 350, 15, 18, 0.3), // Low availability (gray)
      createSection('section-F', 'F', 350, 15, 18, 0.85),
      createSection('section-G', 'G', 350, 15, 16, 0.85),
      createSection('section-H', 'H', 350, 15, 16, 0.3), // Low availability (gray)
      createSection('section-J', 'J', 350, 15, 16, 0.85),

      // 100-level sections (101-122)
      createSection('section-101', '101', 250, 20, 25, 0.85),
      createSection('section-102', '102', 250, 20, 25, 0.85),
      createSection('section-103', '103', 250, 20, 25, 0.3), // Low availability
      createSection('section-104', '104', 250, 20, 25, 0.85),
      createSection('section-105', '105', 250, 20, 25, 0.85),
      createSection('section-106', '106', 250, 20, 25, 0.85),
      createSection('section-107', '107', 250, 20, 25, 0.85),
      createSection('section-108', '108', 250, 20, 25, 0.85),
      createSection('section-109', '109', 250, 20, 25, 0.85),
      createSection('section-110', '110', 250, 20, 25, 0.85),
      createSection('section-111', '111', 250, 20, 25, 0.85),
      createSection('section-112', '112', 250, 20, 25, 0.85),
      createSection('section-113', '113', 250, 20, 25, 0.85),
      createSection('section-114', '114', 250, 20, 25, 0.85),
      createSection('section-115', '115', 250, 20, 25, 0.3), // Low availability
      createSection('section-116', '116', 250, 20, 25, 0.3),
      createSection('section-117', '117', 250, 20, 25, 0.3),
      createSection('section-118', '118', 250, 20, 25, 0.3),
      createSection('section-119', '119', 250, 20, 25, 0.3),
      createSection('section-120', '120', 250, 20, 25, 0.3),
      createSection('section-121', '121', 250, 20, 25, 0.85),
      createSection('section-122', '122', 250, 20, 25, 0.85),

      // 200-level Mezzanine Upper
      createSection('section-201', '201', 150, 15, 20, 0.85),
      createSection('section-202', '202', 150, 15, 20, 0.3),
      createSection('section-203', '203', 150, 15, 20, 0.85),
      createSection('section-204', '204', 150, 15, 20, 0.85),
      createSection('section-227', '227', 150, 15, 20, 0.85),
      createSection('section-228', '228', 150, 15, 20, 0.85),
      createSection('section-229', '229', 150, 15, 20, 0.85),
      createSection('section-230', '230', 150, 15, 20, 0.85),

      // 200-level Mezzanine Lower
      createSection('section-212', '212', 150, 15, 20, 0.85),
      createSection('section-213', '213', 150, 15, 20, 0.3),
      createSection('section-214', '214', 150, 15, 20, 0.3),
      createSection('section-215', '215', 150, 15, 20, 0.3),
      createSection('section-216', '216', 150, 15, 20, 0.85),
      createSection('section-217', '217', 150, 15, 20, 0.85),
      createSection('section-218', '218', 150, 15, 20, 0.85),
      createSection('section-219', '219', 150, 15, 20, 0.85),

      // 200-level Side sections
      createSection('section-205', '205', 150, 15, 20, 0.85),
      createSection('section-206', '206', 150, 15, 20, 0.85),
      createSection('section-207', '207', 150, 15, 20, 0.85),
      createSection('section-208', '208', 150, 15, 20, 0.85),
      createSection('section-209', '209', 150, 15, 20, 0.85),
      createSection('section-210', '210', 150, 15, 20, 0.3),
      createSection('section-211', '211', 150, 15, 20, 0.85),
      createSection('section-220', '220', 150, 15, 20, 0.85),
      createSection('section-221', '221', 150, 15, 20, 0.85),
      createSection('section-222', '222', 150, 15, 20, 0.85),
      createSection('section-223', '223', 150, 15, 20, 0.85),
      createSection('section-224', '224', 150, 15, 20, 0.85),
      createSection('section-225', '225', 150, 15, 20, 0.85),
      createSection('section-226', '226', 150, 15, 20, 0.85),
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
  {
    id: 'event-6',
    title: 'Concert with Auto-Generated Seatmap',
    artistId: 'artist-1',
    date: '2024-10-15T20:00:00',
    venue: {
      name: 'Grand Concert Hall',
      address: '500 Music Boulevard, Los Angeles, CA 90001',
    },
    description: 'Experience this amazing concert with an automatically generated interactive seatmap featuring 5 sections and 300 seats.',
    category: 'Pop',
    sections: [
      // Section 1: Premium Floor (60 seats = 6 rows x 10 seats)
      createSection('section-premium-A', 'Premium Floor A', 450, 6, 10, 0.85),
      // Section 2: Floor Left (60 seats = 6 rows x 10 seats)
      createSection('section-floor-B', 'Floor Left', 350, 6, 10, 0.75),
      // Section 3: Floor Right (60 seats = 6 rows x 10 seats)
      createSection('section-floor-C', 'Floor Right', 350, 6, 10, 0.80),
      // Section 4: Lower Bowl (60 seats = 10 rows x 6 seats)
      createSection('section-lower-D', 'Lower Bowl', 250, 10, 6, 0.70),
      // Section 5: Upper Bowl (60 seats = 10 rows x 6 seats)
      createSection('section-upper-E', 'Upper Bowl', 150, 10, 6, 0.90),
    ],
  },
];
