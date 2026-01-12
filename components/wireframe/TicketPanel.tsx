'use client';

import { Ticket } from '@/lib/types';
import { mockEvents } from '@/lib/data/mockEvents';

interface TicketPanelProps {
  eventId: string;
  tickets: Ticket[];
  selectedTicketIds: string[];
  onSelectTicket: (ticketId: string) => void;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  currentSectionId: string | null;
  onContinue: () => void;
}

export default function TicketPanel({
  eventId,
  tickets,
  selectedTicketIds,
  onSelectTicket,
  quantity,
  onQuantityChange,
  currentSectionId,
  onContinue,
}: TicketPanelProps) {
  const event = mockEvents.find((e) => e.id === eventId);

  // Filter tickets by current section if zoomed in
  const filteredTickets = currentSectionId
    ? tickets.filter((ticket) => {
        const section = event?.sections.find((s) => s.id === currentSectionId);
        return section && ticket.section === section.name;
      })
    : tickets;

  // Get price range
  const prices = filteredTickets.map((t) => t.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  const selectedTickets = filteredTickets.filter((t) =>
    selectedTicketIds.includes(t.id)
  );
  const totalPrice =
    selectedTickets.length > 0 ? selectedTickets[0].price * quantity : 0;

  if (!event) return null;

  const eventDate = new Date(event.date);
  const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = eventDate.getDate();
  const formattedDate = `${month} ${day}`;
  const formattedDay = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="fixed right-0 top-0 h-screen w-96 bg-white border-l-2 border-gray-300 shadow-lg overflow-y-auto z-20">
      <div className="p-6 space-y-6">
        {/* Event Header */}
        <div className="border-b-2 border-gray-300 pb-4">
          <div className="bg-gray-100 px-3 py-1 inline-block mb-2">
            <span className="text-sm font-semibold text-gray-700">
              {formattedDate}
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{event.title}</h2>
          <p className="text-sm text-gray-600">
            {formattedDay} {formattedTime} | {event.venue.name}, {event.venue.address.split(',')[1]?.trim()}
          </p>
        </div>

        {/* Pricing Info */}
        <div className="space-y-2">
          <p className="text-xs text-gray-600">
            We're all in! All prices you see will include fees and taxes
          </p>
          <div className="bg-gray-100 px-4 py-2 border-2 border-gray-300">
            <span className="text-sm font-semibold text-gray-900">
              ${minPrice.toFixed(0)} - ${maxPrice.toFixed(0)}+
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <select className="flex-1 px-3 py-2 border-2 border-gray-300 text-sm">
              <option>2 Tickets</option>
              <option>1 Ticket</option>
              <option>3 Tickets</option>
              <option>4 Tickets</option>
            </select>
            <select className="flex-1 px-3 py-2 border-2 border-gray-300 text-sm">
              <option>Benefits (All)</option>
              <option>VIP</option>
              <option>Early Entry</option>
            </select>
          </div>
        </div>

        {/* Ticket List */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Available Tickets
            {currentSectionId && (
              <span className="ml-2 text-xs text-gray-600 font-normal">
                ({filteredTickets.length})
              </span>
            )}
          </h3>
          <div className="space-y-2">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => onSelectTicket(ticket.id)}
                  className={`w-full text-left p-3 border-2 transition-colors ${
                    selectedTicketIds.includes(ticket.id)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs">🏟️</span>
                        <span className="text-sm font-medium text-gray-900">
                          Section {ticket.section} • Row {ticket.row}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">VIP</p>
                      <p className="text-sm font-semibold text-gray-900">
                        ${ticket.price.toFixed(2)} ea
                      </p>
                      <p className="text-xs text-gray-500">incl. fees</p>
                    </div>
                    {selectedTicketIds.includes(ticket.id) && (
                      <span className="text-blue-600 text-xs">✓</span>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="border-2 border-gray-300 p-8 text-center text-gray-600">
                <p className="text-sm">
                  {currentSectionId
                    ? 'No tickets available in this section'
                    : 'Click on a section to view tickets'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Tickets Summary */}
        {selectedTicketIds.length > 0 && (
          <div className="border-t-2 border-gray-300 pt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                  className="px-3 py-2 border-2 border-gray-300 hover:border-gray-500"
                >
                  −
                </button>
                <span className="px-4 py-2 border-2 border-gray-300 min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => onQuantityChange(quantity + 1)}
                  className="px-3 py-2 border-2 border-gray-300 hover:border-gray-500"
                >
                  +
                </button>
              </div>
            </div>
            <div className="pt-2 border-t-2 border-gray-300">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-600">Total</span>
                <span className="text-xl font-bold text-gray-900">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <button
                onClick={onContinue}
                className="w-full px-6 py-3 bg-gray-900 text-white border-2 border-gray-900 hover:bg-gray-700 transition-colors font-semibold"
              >
                Continue to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
