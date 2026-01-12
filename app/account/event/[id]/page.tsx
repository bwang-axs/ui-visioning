import { notFound } from 'next/navigation';
import Link from 'next/link';
import { mockEvents } from '@/lib/data/mockEvents';
import { mockArtists } from '@/lib/data/mockArtists';
import { mockUser } from '@/lib/data/mockUsers';
import { mockTickets } from '@/lib/data/mockTickets';

interface AccountEventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AccountEventPage({ params }: AccountEventPageProps) {
  const { id } = await params;
  const event = mockEvents.find((e) => e.id === id);

  if (!event) {
    notFound();
  }

  const artist = mockArtists.find((a) => a.id === event.artistId);
  const userPurchase = mockUser.purchases.find((p) => p.eventId === event.id);
  const purchasedTickets = userPurchase
    ? userPurchase.ticketIds
        .map((ticketId) => mockTickets.find((t) => t.id === ticketId))
        .filter((t) => t !== undefined)
    : [];

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/account"
          className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-block"
        >
          ← Back to Account
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
        {artist && (
          <p className="text-lg text-gray-700">{artist.name}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border-2 border-gray-300 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
              Event Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Date & Time</p>
                <p className="font-medium text-gray-900">
                  {formattedDate} at {formattedTime}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Venue</p>
                <p className="font-medium text-gray-900">{event.venue.name}</p>
                <p className="text-sm text-gray-700">{event.venue.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Description</p>
                <p className="text-gray-700">{event.description}</p>
              </div>
            </div>
          </div>

          {/* Purchased Tickets */}
          <div className="border-2 border-gray-300 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
              Your Tickets
            </h2>
            {purchasedTickets.length > 0 ? (
              <div className="space-y-3">
                {purchasedTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="border-2 border-gray-300 p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {ticket.section} - Row {ticket.row}, Seat {ticket.seat}
                      </p>
                      <p className="text-sm text-gray-600">
                        ${ticket.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No tickets found for this event.</p>
            )}
          </div>
        </div>

        {/* Upgrades & Actions */}
        <div className="space-y-6">
          {/* Upgrades */}
          <div className="border-2 border-gray-300 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
              Add Upgrades
            </h2>
            <div className="space-y-3">
              <div className="border-2 border-gray-300 p-4">
                <p className="font-medium text-gray-900 mb-1">Parking Pass</p>
                <p className="text-sm text-gray-600 mb-2">$25.00</p>
                <button className="w-full px-4 py-2 border-2 border-gray-300 hover:border-gray-500 text-sm">
                  Add Parking
                </button>
              </div>
              <div className="border-2 border-gray-300 p-4">
                <p className="font-medium text-gray-900 mb-1">VIP Package</p>
                <p className="text-sm text-gray-600 mb-2">$199.00</p>
                <button className="w-full px-4 py-2 border-2 border-gray-300 hover:border-gray-500 text-sm">
                  Add VIP
                </button>
              </div>
              <div className="border-2 border-gray-300 p-4">
                <p className="font-medium text-gray-900 mb-1">Merchandise Bundle</p>
                <p className="text-sm text-gray-600 mb-2">$49.99</p>
                <button className="w-full px-4 py-2 border-2 border-gray-300 hover:border-gray-500 text-sm">
                  Add Bundle
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-2 border-gray-300 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
              Ticket Actions
            </h2>
            <div className="space-y-3">
              {purchasedTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border-2 border-gray-300 p-3 space-y-2"
                >
                  <p className="text-sm font-medium text-gray-900">
                    {ticket.section} - Row {ticket.row}, Seat {ticket.seat}
                  </p>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 border-2 border-gray-300 hover:border-gray-500 text-sm">
                      Transfer
                    </button>
                    <button className="flex-1 px-3 py-2 border-2 border-gray-300 hover:border-gray-500 text-sm">
                      Resale
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return mockUser.purchases.map((purchase) => ({
    id: purchase.eventId,
  }));
}
