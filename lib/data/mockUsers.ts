import { User, Purchase } from '@/lib/types';

export const mockPurchases: Purchase[] = [
  {
    id: 'purchase-1',
    userId: 'user-1',
    eventId: 'event-1',
    ticketIds: ['ticket-event-1-section-1-A-1', 'ticket-event-1-section-1-A-2'],
    purchaseDate: '2024-05-01T10:00:00',
    price: 598,
  },
  {
    id: 'purchase-2',
    userId: 'user-1',
    eventId: 'event-3',
    ticketIds: ['ticket-event-3-section-1-A-1'],
    purchaseDate: '2024-04-15T14:30:00',
    price: 249,
  },
];

export const mockUser: User = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  purchases: mockPurchases,
};
