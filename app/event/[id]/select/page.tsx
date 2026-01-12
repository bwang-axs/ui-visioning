'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { mockEvents } from '@/lib/data/mockEvents';
import { mockTickets } from '@/lib/data/mockTickets';
import InteractiveSeatMap from '@/components/wireframe/InteractiveSeatMap';
import TicketPanel from '@/components/wireframe/TicketPanel';
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
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);

  // Initialize tickets based on current section or all tickets
  useEffect(() => {
    if (!event) return;

    let tickets: Ticket[];

    if (currentSectionId) {
      // Show tickets for the current section
      const section = event.sections.find((s) => s.id === currentSectionId);
      if (section) {
        tickets = mockTickets.filter(
          (ticket) =>
            ticket.eventId === eventId && ticket.section === section.name
        );
      } else {
        tickets = [];
      }
    } else {
      // Show all tickets for the event
      tickets = mockTickets.filter((ticket) => ticket.eventId === eventId);
    }

    setAvailableTickets(tickets);
  }, [currentSectionId, eventId, event]);

  // Update selected tickets when seats are clicked
  useEffect(() => {
    if (!event || selectedSeatIds.length === 0) return;

    const tickets = mockTickets.filter((ticket) => {
      return (
        ticket.eventId === eventId &&
        selectedSeatIds.some((seatId) => {
          const [sectionId, row, seat] = seatId.split('-');
          const section = event.sections.find((s) => s.id === sectionId);
          return (
            section &&
            ticket.section === section.name &&
            ticket.row === row &&
            ticket.seat === seat
          );
        })
      );
    });

    // Update available tickets to include selected seats
    setAvailableTickets((prev) => {
      const newTickets = [...prev];
      tickets.forEach((ticket) => {
        if (!newTickets.find((t) => t.id === ticket.id)) {
          newTickets.push(ticket);
        }
      });
      return newTickets;
    });

    // Auto-select first ticket if none selected
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

  const handleSectionChange = (sectionId: string | null) => {
    setCurrentSectionId(sectionId);
    // Clear selections when changing sections
    setSelectedSeatIds([]);
    setSelectedTicketIds([]);
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

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Seatmap - Full screen background */}
      <div className="fixed inset-0">
        <InteractiveSeatMap
          event={event}
          selectedSeatIds={selectedSeatIds}
          onSeatClick={handleSeatClick}
          onSectionChange={handleSectionChange}
          rightPanelWidth={384} // w-96 = 384px
        />
      </div>

      {/* Header - Floating overlay */}
      <div className="absolute top-4 left-4 z-30 bg-white border-2 border-gray-300 p-4 shadow-lg">
        <Link
          href={`/event/${eventId}`}
          className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-block"
        >
          ← Back to event
        </Link>
        <h1 className="text-xl font-bold text-gray-900">{event.title}</h1>
      </div>

      {/* Floating Ticket Panel - Fixed on right */}
      <TicketPanel
        eventId={eventId}
        tickets={availableTickets}
        selectedTicketIds={selectedTicketIds}
        onSelectTicket={handleSelectTicket}
        quantity={quantity}
        onQuantityChange={setQuantity}
        currentSectionId={currentSectionId}
        onContinue={handleContinue}
      />
    </div>
  );
}