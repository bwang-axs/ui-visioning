'use client';

import { Event, SeatSection } from '@/lib/types';
import { useState } from 'react';

interface SeatMapProps {
  event: Event;
  selectedSeatIds: string[];
  onSeatClick: (sectionId: string, row: string, seat: string) => void;
}

export default function SeatMap({ event, selectedSeatIds, onSeatClick }: SeatMapProps) {
  const getSeatId = (sectionId: string, row: string, seat: string) => {
    return `${sectionId}-${row}-${seat}`;
  };

  const isSeatSelected = (sectionId: string, row: string, seat: string) => {
    return selectedSeatIds.includes(getSeatId(sectionId, row, seat));
  };

  return (
    <div className="border-2 border-gray-300 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
        Select Your Seats
      </h3>
      
      {/* Stage/Performance Area */}
      <div className="mb-6 text-center">
        <div className="border-2 border-gray-400 bg-gray-200 py-4 px-8 inline-block">
          <p className="text-sm font-medium text-gray-700">STAGE</p>
        </div>
      </div>

      {/* Seat Sections */}
      <div className="space-y-6">
        {event.sections.map((section) => (
          <div key={section.id} className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{section.name}</h4>
              <span className="text-sm text-gray-600">${section.price}</span>
            </div>
            
            <div className="space-y-1">
              {section.rows.map((row, rowIndex) => (
                <div key={row.row} className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-8">{row.row}</span>
                  <div className="flex gap-1 flex-wrap">
                    {row.seats.map((seat) => {
                      const seatId = getSeatId(section.id, row.row, seat.seat);
                      const isSelected = isSeatSelected(section.id, row.row, seat.seat);
                      
                      return (
                        <button
                          key={seat.seat}
                          onClick={() => onSeatClick(section.id, row.row, seat.seat)}
                          disabled={!seat.available}
                          className={`w-8 h-8 text-xs border-2 transition-colors ${
                            !seat.available
                              ? 'bg-gray-400 border-gray-500 cursor-not-allowed'
                              : isSelected
                              ? 'bg-gray-900 border-gray-900 text-white'
                              : 'bg-gray-100 border-gray-300 hover:border-gray-500 hover:bg-gray-200'
                          }`}
                          title={`${section.name} Row ${row.row} Seat ${seat.seat} - $${seat.price}`}
                        >
                          {seat.seat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t-2 border-gray-300">
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-100 border-2 border-gray-300"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-900 border-2 border-gray-900"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-400 border-2 border-gray-500"></div>
            <span>Reserved</span>
          </div>
        </div>
      </div>
    </div>
  );
}
