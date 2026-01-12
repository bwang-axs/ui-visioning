'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockUser } from '@/lib/data/mockUsers';
import { mockEvents } from '@/lib/data/mockEvents';
import { mockTickets } from '@/lib/data/mockTickets';

type Tab = 'tickets' | 'resale' | 'transfer' | 'settings';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>('tickets');

  const userPurchases = mockUser.purchases.map((purchase) => {
    const event = mockEvents.find((e) => e.id === purchase.eventId);
    const tickets = purchase.ticketIds
      .map((ticketId) => mockTickets.find((t) => t.id === ticketId))
      .filter((t) => t !== undefined);
    return { purchase, event, tickets };
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Account</h1>

      {/* User Info */}
      <div className="border-2 border-gray-300 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{mockUser.name}</h2>
        <p className="text-gray-600">{mockUser.email}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b-2 border-gray-300 mb-6">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-4 py-2 border-2 border-b-0 -mb-[2px] ${
            activeTab === 'tickets'
              ? 'border-gray-900 bg-gray-100'
              : 'border-gray-300 hover:border-gray-500'
          }`}
        >
          My Tickets
        </button>
        <button
          onClick={() => setActiveTab('resale')}
          className={`px-4 py-2 border-2 border-b-0 -mb-[2px] ${
            activeTab === 'resale'
              ? 'border-gray-900 bg-gray-100'
              : 'border-gray-300 hover:border-gray-500'
          }`}
        >
          Resale
        </button>
        <button
          onClick={() => setActiveTab('transfer')}
          className={`px-4 py-2 border-2 border-b-0 -mb-[2px] ${
            activeTab === 'transfer'
              ? 'border-gray-900 bg-gray-100'
              : 'border-gray-300 hover:border-gray-500'
          }`}
        >
          Transfer
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 border-2 border-b-0 -mb-[2px] ${
            activeTab === 'settings'
              ? 'border-gray-900 bg-gray-100'
              : 'border-gray-300 hover:border-gray-500'
          }`}
        >
          Settings
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'tickets' && (
          <div className="space-y-4">
            {userPurchases.length > 0 ? (
              userPurchases.map(({ purchase, event, tickets }) => (
                <div key={purchase.id} className="border-2 border-gray-300 p-6">
                  {event && (
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {event.title}
                          </h3>
                          <p className="text-gray-600">
                            {new Date(event.date).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                          <p className="text-gray-600">{event.venue.name}</p>
                        </div>
                        <Link
                          href={`/account/event/${event.id}`}
                          className="px-4 py-2 border-2 border-gray-300 hover:border-gray-500 text-sm"
                        >
                          View Details
                        </Link>
                      </div>
                      <div className="border-t-2 border-gray-300 pt-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Tickets:</h4>
                        <div className="space-y-1">
                          {tickets.map((ticket) => (
                            <p key={ticket.id} className="text-sm text-gray-700">
                              {ticket.section} - Row {ticket.row}, Seat {ticket.seat}
                            </p>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className="border-2 border-gray-300 p-12 text-center">
                <p className="text-gray-600">No tickets purchased yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'resale' && (
          <div className="border-2 border-gray-300 p-8">
            <p className="text-gray-600 mb-4">Tickets available for resale:</p>
            <div className="space-y-4">
              {userPurchases.map(({ purchase, event, tickets }) =>
                tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="border-2 border-gray-300 p-4 flex justify-between items-center"
                  >
                    <div>
                      {event && <p className="font-medium text-gray-900">{event.title}</p>}
                      <p className="text-sm text-gray-600">
                        {ticket.section} - Row {ticket.row}, Seat {ticket.seat}
                      </p>
                    </div>
                    <button className="px-4 py-2 border-2 border-gray-300 hover:border-gray-500 text-sm">
                      List for Resale
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'transfer' && (
          <div className="border-2 border-gray-300 p-8">
            <p className="text-gray-600 mb-4">Transfer tickets to another user:</p>
            <div className="space-y-4">
              {userPurchases.map(({ purchase, event, tickets }) =>
                tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="border-2 border-gray-300 p-4 flex justify-between items-center"
                  >
                    <div>
                      {event && <p className="font-medium text-gray-900">{event.title}</p>}
                      <p className="text-sm text-gray-600">
                        {ticket.section} - Row {ticket.row}, Seat {ticket.seat}
                      </p>
                    </div>
                    <button className="px-4 py-2 border-2 border-gray-300 hover:border-gray-500 text-sm">
                      Transfer
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="border-2 border-gray-300 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
              Account Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  defaultValue={mockUser.name}
                  className="w-full px-4 py-2 border-2 border-gray-300 focus:border-gray-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue={mockUser.email}
                  className="w-full px-4 py-2 border-2 border-gray-300 focus:border-gray-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border-2 border-gray-300 focus:border-gray-500 focus:outline-none"
                />
              </div>
              <button className="px-6 py-2 border-2 border-gray-900 bg-gray-900 text-white hover:bg-gray-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
