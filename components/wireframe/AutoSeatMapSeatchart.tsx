'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Event } from '@/lib/types';

interface AutoSeatMapSeatchartProps {
  event: Event;
  selectedSeatIds: string[];
  onSeatClick: (sectionId: string, row: string, seat: string) => void;
}

/**
 * Automatically generates an interactive seatmap from event data using Seatchart
 * This uses the Seatchart library which is already working in your project
 * and can automatically render seats from row/column configuration
 */
export default function AutoSeatMapSeatchart({
  event,
  selectedSeatIds,
  onSeatClick,
}: AutoSeatMapSeatchartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const seatmapInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Render all sections with Seatchart
  const renderAllSections = useCallback(async () => {
    if (!containerRef.current) return;

    // Destroy previous instance
    if (seatmapInstanceRef.current) {
      try {
        if (typeof seatmapInstanceRef.current.destroy === 'function') {
          seatmapInstanceRef.current.destroy();
        }
      } catch (e) {
        // Ignore errors
      }
    }

    // Clear container
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    try {
      // Dynamically import Seatchart
      const SeatchartModule = await import('seatchart');
      const Seatchart = (SeatchartModule as any).default || SeatchartModule;

      // Create a container for all sections
      const sectionsContainer = document.createElement('div');
      sectionsContainer.className = 'flex flex-col gap-8 p-4';
      containerRef.current.appendChild(sectionsContainer);

      let globalSeatId = 0;

      // Render each section
      for (const section of event.sections) {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'border-2 border-gray-300 p-4 rounded';
        
        const sectionTitle = document.createElement('h3');
        sectionTitle.className = 'text-lg font-semibold mb-4';
        sectionTitle.textContent = `${section.name} - $${section.price}`;
        sectionDiv.appendChild(sectionTitle);

        const seatchartDiv = document.createElement('div');
        seatchartDiv.className = 'seatchart-container';
        sectionDiv.appendChild(seatchartDiv);
        sectionsContainer.appendChild(sectionDiv);

        // Calculate dimensions
        const rows = section.rows.length;
        const columns = Math.max(...section.rows.map((r) => r.seats.length), 1);

        // Convert seats to Seatchart format
        const reservedSeats: Array<{ row: number; col: number }> = [];
        const selectedSeats: Array<{ row: number; col: number }> = [];
        const seatMap = new Map<string, { sectionId: string; row: string; seat: string; price: number }>();

        section.rows.forEach((row, rowIdx) => {
          row.seats.forEach((seat, seatIdx) => {
            if (!seat.available) {
              reservedSeats.push({ row: rowIdx, col: seatIdx });
            }

            const seatId = `${section.id}-${row.row}-${seat.seat}`;
            if (selectedSeatIds.includes(seatId)) {
              selectedSeats.push({ row: rowIdx, col: seatIdx });
            }

            seatMap.set(`${rowIdx}-${seatIdx}`, {
              sectionId: section.id,
              row: row.row,
              seat: seat.seat,
              price: seat.price,
            });
          });
        });

        // Create Seatchart instance for this section
        const options = {
          map: {
            rows,
            columns,
            seatTypes: {
              default: {
                label: section.name,
                price: section.price,
                cssClass: 'seat-default',
              },
            },
            reservedSeats,
            selectedSeats,
            seatLabel: (index: { row: number; col: number }) => {
              const key = `${index.row}-${index.col}`;
              const seatInfo = seatMap.get(key);
              return seatInfo?.seat || '';
            },
          },
          cart: {
            visible: false, // Hide cart, we use our own panel
          },
          onSeatSelect: (index: { row: number; col: number }) => {
            const key = `${index.row}-${index.col}`;
            const seatInfo = seatMap.get(key);
            if (seatInfo) {
              onSeatClick(seatInfo.sectionId, seatInfo.row, seatInfo.seat);
            }
          },
        };

        try {
          const seatChart = new Seatchart(seatchartDiv, options);
          // Store all instances for cleanup
          if (!seatmapInstanceRef.current) {
            seatmapInstanceRef.current = [];
          }
          seatmapInstanceRef.current.push(seatChart);
        } catch (e) {
          console.error(`Error creating Seatchart for section ${section.name}:`, e);
        }
      }

      setIsLoaded(true);
      setLoading(false);
      setError(null);
    } catch (err: any) {
      console.error('Error initializing Seatchart seatmap:', err);
      setError(err?.message || 'Failed to initialize seatmap');
      setLoading(false);
    }
  }, [event, selectedSeatIds, onSeatClick]);

  useEffect(() => {
    if (!containerRef.current) return;
    renderAllSections();

    // Cleanup
    return () => {
      if (seatmapInstanceRef.current && Array.isArray(seatmapInstanceRef.current)) {
        seatmapInstanceRef.current.forEach((instance: any) => {
          try {
            if (typeof instance.destroy === 'function') {
              instance.destroy();
            }
          } catch (e) {
            // Ignore errors
          }
        });
      }
    };
  }, [renderAllSections]);

  const totalSeats = event.sections.reduce(
    (acc, s) => acc + s.rows.reduce((sum, r) => sum + r.seats.length, 0),
    0
  );

  return (
    <div className="w-full h-full bg-gray-100 relative overflow-auto">
      {/* Header overlay */}
      <div className="sticky top-0 z-30 bg-white border-b-2 border-gray-300 p-4 shadow-lg">
        <h3 className="text-lg font-semibold">{event.title}</h3>
        <p className="text-sm text-gray-600">
          {event.venue.name} - {new Date(event.date).toLocaleDateString()}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Automatically generated seatmap - {totalSeats} seats across {event.sections.length} sections
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center">
            <div className="text-lg font-semibold mb-2">Loading seatmap...</div>
            <div className="text-sm text-gray-600">Initializing interactive seatmap with {totalSeats} seats</div>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
          <div className="text-center p-8">
            <div className="text-lg font-semibold text-red-600 mb-2">Error loading seatmap</div>
            <div className="text-sm text-red-500 mb-4">{error}</div>
            <div className="text-xs text-gray-600">Check the browser console for more details</div>
          </div>
        </div>
      )}

      {/* Seatmap container */}
      <div
        ref={containerRef}
        className="w-full"
        style={{ 
          minHeight: 'calc(100vh - 200px)',
          padding: '20px',
          display: loading || error ? 'none' : 'block',
        }}
      />
    </div>
  );
}

