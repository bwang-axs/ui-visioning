'use client';

import { Ticket } from '@/lib/types';

interface TicketListProps {
  tickets: Ticket[];
  selectedTicketIds: string[];
  onSelectTicket: (ticketId: string) => void;
  quantity?: number;
  onQuantityChange?: (quantity: number) => void;
}

export default function TicketList({
  tickets,
  selectedTicketIds,
  onSelectTicket,
  quantity = 1,
  onQuantityChange,
}: TicketListProps) {
  if (tickets.length === 0) {
    return (
      <div className="border-2 border-gray-300 p-8 text-center text-gray-600">
        <p>Click on a seat to see ticket details</p>
      </div>
    );
  }

  return (
    <div className="border-2 border-gray-300 p-4 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 border-b-2 border-gray-300 pb-2">
        Available Tickets
      </h3>
      <div className="space-y-3">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className={`border-2 p-3 cursor-pointer transition-colors ${
              selectedTicketIds.includes(ticket.id)
                ? 'border-gray-900 bg-gray-100'
                : 'border-gray-300 hover:border-gray-500'
            }`}
            onClick={() => onSelectTicket(ticket.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-900">
                  {ticket.section} - Row {ticket.row}, Seat {ticket.seat}
                </p>
                <p className="text-sm text-gray-600">
                  ${ticket.price.toFixed(2)}
                </p>
              </div>
              {selectedTicketIds.includes(ticket.id) && (
                <span className="text-xs bg-gray-900 text-white px-2 py-1">
                  Selected
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      {selectedTicketIds.length > 0 && onQuantityChange && (
        <div className="border-t-2 border-gray-300 pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="border-2 border-gray-300 px-3 py-1 hover:border-gray-500"
            >
              -
            </button>
            <span className="px-4 py-1 border-2 border-gray-300 min-w-[60px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              className="border-2 border-gray-300 px-3 py-1 hover:border-gray-500"
            >
              +
            </button>
          </div>
          <div className="mt-4 pt-4 border-t-2 border-gray-300">
            <p className="text-lg font-semibold text-gray-900">
              Total: ${(tickets.find(t => selectedTicketIds.includes(t.id))?.price || 0) * quantity}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
