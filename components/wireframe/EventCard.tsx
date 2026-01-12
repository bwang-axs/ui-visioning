'use client';

import Link from 'next/link';
import { Event } from '@/lib/types';
import { mockArtists } from '@/lib/data/mockArtists';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const artist = mockArtists.find((a) => a.id === event.artistId);
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="border-2 border-gray-300 p-4 flex flex-col">
      <div className="space-y-2 flex-1">
        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
        {artist && (
          <Link
            href={`/artist/${artist.id}`}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            {artist.name}
          </Link>
        )}
        <div className="text-sm text-gray-600">
          <p>{formattedDate} at {formattedTime}</p>
          <p>{event.venue.name}</p>
        </div>
        {event.category && (
          <span className="inline-block px-2 py-1 text-xs border border-gray-300 bg-gray-50">
            {event.category}
          </span>
        )}
        <p className="text-sm text-gray-700 line-clamp-2">{event.description}</p>
      </div>
      
      {/* Action Buttons */}
      <div className="mt-4 pt-4 border-t-2 border-gray-300 flex gap-2">
        <Link
          href={`/event/${event.id}`}
          className="flex-1 px-4 py-2 border-2 border-gray-300 hover:border-gray-500 text-center text-sm font-medium transition-colors"
        >
          View Details
        </Link>
        <Link
          href={`/event/${event.id}/select`}
          className="flex-1 px-4 py-2 border-2 border-gray-900 bg-gray-900 text-white hover:bg-gray-700 text-center text-sm font-medium transition-colors"
        >
          Get Tickets
        </Link>
      </div>
    </div>
  );
}
