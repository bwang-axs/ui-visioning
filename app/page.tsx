'use client';

import { useState, useMemo } from 'react';
import { mockEvents } from '@/lib/data/mockEvents';
import { mockArtists } from '@/lib/data/mockArtists';
import EventCard from '@/components/wireframe/EventCard';
import SearchBar from '@/components/wireframe/SearchBar';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) {
      return mockEvents;
    }

    const query = searchQuery.toLowerCase();
    return mockEvents.filter((event) => {
      const artist = mockArtists.find((a) => a.id === event.artistId);
      return (
        event.title.toLowerCase().includes(query) ||
        event.venue.name.toLowerCase().includes(query) ||
        artist?.name.toLowerCase().includes(query) ||
        event.category?.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Discover Events</h1>
        <SearchBar onSearch={setSearchQuery} />
      </div>

      {/* Filters placeholder */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <span className="text-sm text-gray-600">Filters:</span>
        <button className="px-4 py-2 border-2 border-gray-300 hover:border-gray-500 text-sm">
          All Dates
        </button>
        <button className="px-4 py-2 border-2 border-gray-300 hover:border-gray-500 text-sm">
          All Categories
        </button>
        <button className="px-4 py-2 border-2 border-gray-300 hover:border-gray-500 text-sm">
          All Venues
        </button>
      </div>

      {/* Events Grid */}
      <div className="space-y-4">
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="border-2 border-gray-300 p-12 text-center">
            <p className="text-gray-600">No events found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}