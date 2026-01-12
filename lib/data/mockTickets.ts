import { Ticket } from '@/lib/types';
import { mockEvents } from './mockEvents';

// Generate tickets from events
export const mockTickets: Ticket[] = [];

mockEvents.forEach((event) => {
  event.sections.forEach((section) => {
    section.rows.forEach((row) => {
      row.seats.forEach((seat) => {
        mockTickets.push({
          id: `ticket-${event.id}-${section.id}-${row.row}-${seat.seat}`,
          eventId: event.id,
          section: section.name,
          row: row.row,
          seat: seat.seat,
          price: seat.price,
          available: seat.available,
        });
      });
    });
  });
});
