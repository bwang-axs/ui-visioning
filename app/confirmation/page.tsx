'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockEvents } from '@/lib/data/mockEvents';
import { mockArtists } from '@/lib/data/mockArtists';

interface PurchaseData {
  eventId: string;
  ticketIds: string[];
  quantity: number;
  tickets: Array<{
    id: string;
    section: string;
    row: string;
    seat: string;
    price: number;
  }>;
}

export default function ConfirmationPage() {
  const router = useRouter();
  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const stored = sessionStorage.getItem('pendingPurchase');
    if (!stored) {
      router.push('/');
      return;
    }

    const data = JSON.parse(stored) as PurchaseData;
    setPurchaseData(data);
    const ticketPrice = data.tickets[0]?.price || 0;
    setTotal(ticketPrice * data.quantity);
  }, [router]);

  if (!purchaseData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="border-2 border-gray-300 p-8 text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const event = mockEvents.find((e) => e.id === purchaseData.eventId);
  const artist = event
    ? mockArtists.find((a) => a.id === event.artistId)
    : null;
  const eventDate = event
    ? new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  // Clear purchase data after display
  useEffect(() => {
    return () => {
      sessionStorage.removeItem('pendingPurchase');
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Success Message */}
      <div className="border-2 border-gray-900 bg-gray-100 p-8 mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          You've got your ticket!
        </h1>
        <p className="text-lg text-gray-700">Your purchase was successful</p>
      </div>

      {/* Receipt */}
      <div className="border-2 border-gray-300 p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
          Receipt
        </h2>

        {event && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
              {artist && (
                <p className="text-gray-700">{artist.name}</p>
              )}
              <p className="text-gray-600">{eventDate}</p>
              <p className="text-gray-600">{event.venue.name}</p>
            </div>

            <div className="border-t-2 border-gray-300 pt-4">
              <h4 className="font-semibold text-gray-900 mb-2">Ticket Details</h4>
              {purchaseData.tickets.map((ticket, index) => (
                <div key={index} className="mb-2 text-gray-700">
                  <p>
                    {ticket.section} - Row {ticket.row}, Seat {ticket.seat}
                  </p>
                </div>
              ))}
              <p className="text-sm text-gray-600 mt-2">
                Quantity: {purchaseData.quantity}
              </p>
            </div>

            <div className="border-t-2 border-gray-300 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upgrade Options */}
      <div className="border-2 border-gray-300 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
          Add Upgrades
        </h2>
        <div className="space-y-3">
          <div className="border-2 border-gray-300 p-4 flex justify-between items-center hover:border-gray-500 transition-colors cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Parking Pass</p>
              <p className="text-sm text-gray-600">Reserved parking spot</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">$25.00</p>
              <button className="mt-2 px-4 py-2 border-2 border-gray-300 hover:border-gray-500 text-sm">
                Add
              </button>
            </div>
          </div>
          <div className="border-2 border-gray-300 p-4 flex justify-between items-center hover:border-gray-500 transition-colors cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">VIP Package</p>
              <p className="text-sm text-gray-600">Early entry, meet & greet</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">$199.00</p>
              <button className="mt-2 px-4 py-2 border-2 border-gray-300 hover:border-gray-500 text-sm">
                Add
              </button>
            </div>
          </div>
          <div className="border-2 border-gray-300 p-4 flex justify-between items-center hover:border-gray-500 transition-colors cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Merchandise Bundle</p>
              <p className="text-sm text-gray-600">T-shirt, poster, and more</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">$49.99</p>
              <button className="mt-2 px-4 py-2 border-2 border-gray-300 hover:border-gray-500 text-sm">
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <Link
          href="/account"
          className="px-6 py-3 border-2 border-gray-900 bg-gray-900 text-white hover:bg-gray-700 transition-colors font-semibold"
        >
          View My Tickets
        </Link>
        <Link
          href="/"
          className="px-6 py-3 border-2 border-gray-300 hover:border-gray-500 transition-colors font-semibold"
        >
          Browse More Events
        </Link>
      </div>
    </div>
  );
}
