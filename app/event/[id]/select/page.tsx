'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { mockEvents } from '@/lib/data/mockEvents';
import { mockTickets } from '@/lib/data/mockTickets';
import SeatMap from '@/components/wireframe/SeatMap';
import TicketList from '@/components/wireframe/TicketList';
import { Ticket } from '@/lib/types';

export default function TicketSelectionPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const event = mockEvents.find((e) => e.id === eventId);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [selectedTicketIds, setSelectedTicketIds] = useState<string[]>([]);
  const [availableTickets, setAvailableTickets] = useState<Ticket[]>([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!event) return;

    // Get tickets for seats that match the selected seats
    const tickets = mockTickets.filter((ticket) => {
      return (
        ticket.eventId === eventId &&
        selectedSeatIds.some((seatId) => {
          const [sectionId, row, seat] = seatId.split('-');
          return (
            ticket.section.toLowerCase().includes(sectionId.toLowerCase()) &&
            ticket.row === row &&
            ticket.seat === seat
          );
        })
      );
    });

    setAvailableTickets(tickets);
    if (tickets.length > 0 && selectedTicketIds.length === 0) {
      setSelectedTicketIds([tickets[0].id]);
    }
  }, [selectedSeatIds, eventId, event]);

  const handleSeatClick = (sectionId: string, row: string, seat: string) => {
    const seatId = `${sectionId}-${row}-${seat}`;
    setSelectedSeatIds((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTicketIds((prev) => {
      if (prev.includes(ticketId)) {
        return prev.filter((id) => id !== ticketId);
      } else {
        return [ticketId];
      }
    });
  };

  const handleContinue = () => {
    if (selectedTicketIds.length === 0) return;

    // Store purchase info in sessionStorage for confirmation page
    const purchaseData = {
      eventId,
      ticketIds: selectedTicketIds,
      quantity,
      tickets: availableTickets.filter((t) => selectedTicketIds.includes(t.id)),
    };
    sessionStorage.setItem('pendingPurchase', JSON.stringify(purchaseData));
    router.push('/confirmation');
  };

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="border-2 border-gray-300 p-8 text-center">
          <p className="text-gray-600">Event not found</p>
          <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const selectedTickets = availableTickets.filter((t) =>
    selectedTicketIds.includes(t.id)
  );
  const totalPrice =
    selectedTickets.length > 0 ? selectedTickets[0].price * quantity : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href={`/event/${eventId}`}
          className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-block"
        >
          ← Back to event
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Select Tickets - {event.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seatmap */}
        <div className="lg:col-span-2">
          <SeatMap
            event={event}
            selectedSeatIds={selectedSeatIds}
            onSeatClick={handleSeatClick}
          />
        </div>

        {/* Ticket List */}
        <div>
          <TicketList
            tickets={availableTickets}
            selectedTicketIds={selectedTicketIds}
            onSelectTicket={handleSelectTicket}
            quantity={quantity}
            onQuantityChange={setQuantity}
          />

          {selectedTicketIds.length > 0 && (
            <div className="mt-4">
              <button
                onClick={handleContinue}
                className="w-full px-6 py-4 bg-gray-900 text-white border-2 border-gray-900 hover:bg-gray-700 transition-colors text-lg font-semibold"
              >
                Continue to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
