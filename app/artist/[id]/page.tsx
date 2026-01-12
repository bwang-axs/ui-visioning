import { notFound } from 'next/navigation';
import Link from 'next/link';
import { mockArtists } from '@/lib/data/mockArtists';
import { mockEvents } from '@/lib/data/mockEvents';
import EventCard from '@/components/wireframe/EventCard';

interface ArtistPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { id } = await params;
  const artist = mockArtists.find((a) => a.id === id);

  if (!artist) {
    notFound();
  }

  const artistEvents = mockEvents.filter((event) =>
    artist.eventIds.includes(event.id)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Artist Info */}
      <div className="mb-8 border-2 border-gray-300 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{artist.name}</h1>
        <div className="border-t-2 border-gray-300 pt-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">About</h2>
          <p className="text-gray-700">{artist.bio}</p>
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
        {artistEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {artistEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="border-2 border-gray-300 p-8 text-center">
            <p className="text-gray-600">No upcoming events scheduled.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return mockArtists.map((artist) => ({
    id: artist.id,
  }));
}
