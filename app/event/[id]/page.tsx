import { notFound } from 'next/navigation';
import Link from 'next/link';
import { mockEvents } from '@/lib/data/mockEvents';
import { mockArtists } from '@/lib/data/mockArtists';

interface EventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const event = mockEvents.find((e) => e.id === id);

  if (!event) {
    notFound();
  }

  const artist = mockArtists.find((a) => a.id === event.artistId);
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

  // Get top tickets (cheapest available tickets from each section)
  const topTickets = event.sections
    .map((section) => {
      const availableSeats = section.rows
        .flatMap((row) => row.seats.filter((seat) => seat.available))
        .sort((a, b) => a.price - b.price);
      return availableSeats.length > 0
        ? {
            section: section.name,
            price: availableSeats[0].price,
            sectionId: section.id,
          }
        : null;
    })
    .filter((ticket) => ticket !== null)
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Event Header */}
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-block"
        >
          ← Back to events
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{event.title}</h1>
        {artist && (
          <Link
            href={`/artist/${artist.id}`}
            className="text-xl text-gray-700 hover:text-gray-900 underline"
          >
            {artist.name}
          </Link>
        )}
      </div>

      {/* Event Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Date & Venue */}
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
            </div>
          </div>

          {/* Description */}
          <div className="border-2 border-gray-300 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
              About This Event
            </h2>
            <p className="text-gray-700">{event.description}</p>
          </div>
        </div>

        {/* Top Tickets */}
        <div className="space-y-6">
          <div className="border-2 border-gray-300 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
              Top Tickets
            </h2>
            {topTickets.length > 0 ? (
              <div className="space-y-3">
                {topTickets.map((ticket, index) => (
                  <div
                    key={index}
                    className="border-2 border-gray-300 p-3 hover:border-gray-500 transition-colors"
                  >
                    <p className="font-medium text-gray-900">{ticket.section}</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ${ticket.price}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No tickets available</p>
            )}
          </div>

          {/* Parking & VIP */}
          <div className="border-2 border-gray-300 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
              Add-Ons
            </h2>
            <div className="space-y-3">
              <div className="border-2 border-gray-300 p-3">
                <p className="font-medium text-gray-900">Parking Pass</p>
                <p className="text-sm text-gray-600">$25.00</p>
              </div>
              <div className="border-2 border-gray-300 p-3">
                <p className="font-medium text-gray-900">VIP Package</p>
                <p className="text-sm text-gray-600">$199.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-center">
        <Link
          href={`/event/${event.id}/select`}
          className="inline-block px-8 py-4 bg-gray-900 text-white border-2 border-gray-900 hover:bg-gray-700 transition-colors text-lg font-semibold"
        >
          Select Tickets
        </Link>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return mockEvents.map((event) => ({
    id: event.id,
  }));
}
