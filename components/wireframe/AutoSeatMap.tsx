'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Event } from '@/lib/types';

interface AutoSeatMapProps {
  event: Event;
  selectedSeatIds: string[];
  onSeatClick: (sectionId: string, row: string, seat: string) => void;
}

/**
 * Automatically generates an interactive seatmap from event data using @alisaitteke/seatmap-canvas
 * This component converts your Event/SeatSection data structure into the seatmap-canvas format
 * and automatically renders all seats (e.g., 500 seats) without manual creation.
 */
export default function AutoSeatMap({
  event,
  selectedSeatIds,
  onSeatClick,
}: AutoSeatMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const seatmapInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Convert event sections to seatmap-canvas block format
  const convertEventToSeatmapData = useCallback(() => {
    // Validate event data
    if (!event || !event.sections || !Array.isArray(event.sections)) {
      console.error('Invalid event data:', event);
      return { blocks: [] };
    }

    let globalSeatId = 1; // Unique across all blocks
    const blocks = event.sections
      .filter((section) => {
        // Filter out invalid sections
        if (!section || !section.rows || !Array.isArray(section.rows)) {
          console.warn('Skipping invalid section:', section);
          return false;
        }
        return true;
      })
      .map((section, sectionIndex) => {
      // Calculate starting position for each section (arrange horizontally)
      const sectionXOffset = sectionIndex * 400;
      const rowSpacing = 35; // Vertical spacing between rows
      const seatSpacing = 30; // Horizontal spacing between seats

      const seats: Array<{
        id: number;
        title: string;
        x: number;
        y: number;
        salable: boolean;
        note?: string;
        color?: string;
        custom_data?: {
          sectionId: string;
          row: string;
          seat: string;
          price: number;
        };
      }> = [];

      section.rows.forEach((row, rowIndex) => {
        // Skip if row or seats is missing
        if (!row || !row.seats || !Array.isArray(row.seats)) {
          console.warn(`Skipping invalid row in section ${section.name}:`, row);
          return;
        }

        row.seats.forEach((seat, seatIndex) => {
          // Skip if seat is missing or doesn't have required properties
          if (!seat) {
            console.warn(`Skipping invalid seat at index ${seatIndex} in row ${row.row}`);
            return;
          }

          // Ensure all required properties exist
          const seatNumber = seat.seat || `${seatIndex + 1}`;
          const seatPrice = seat.price ?? section.price ?? 0;
          const seatAvailable = seat.available !== undefined ? seat.available : true;

          const seatId = `${section.id}-${row.row}-${seatNumber}`;
          const isSelected = selectedSeatIds.includes(seatId);

          seats.push({
            id: globalSeatId++, // Keep numeric ID for seats
            title: seatNumber,
            x: sectionXOffset + seatIndex * seatSpacing,
            y: rowIndex * rowSpacing,
            salable: seatAvailable,
            note: `${section.name} - Row ${row.row} - Seat ${seatNumber} - $${seatPrice}`,
            color: isSelected ? '#56aa45' : undefined,
            custom_data: {
              sectionId: section.id,
              row: row.row || `Row${rowIndex + 1}`,
              seat: seatNumber,
              price: seatPrice,
            },
          });
        });
      });

      // Only return block if it has seats
      if (seats.length === 0) {
        console.warn(`Section ${section.name} has no valid seats`);
        return null;
      }

      return {
        id: `${section.id}-block`, // Use string ID for blocks
        title: section.name || `Section ${sectionIndex + 1}`,
        color: '#e2e2e2',
        labels: [
          {
            title: section.name || `Section ${sectionIndex + 1}`,
            x: -20,
            y: -10,
          },
        ],
        seats: seats.filter(Boolean), // Remove any null/undefined seats
      };
    })
    .filter((block): block is NonNullable<typeof block> => block !== null && block.seats && block.seats.length > 0); // Remove empty blocks

    console.log(`Converted ${blocks.length} blocks with ${blocks.reduce((sum, b) => sum + (b.seats?.length || 0), 0)} total seats`);
    
    return { blocks };
  }, [event, selectedSeatIds]);

  useEffect(() => {
    if (!containerRef.current || isLoaded) return;

    // Dynamically import seatmap-canvas
    const initSeatmap = async () => {
      try {
        const container = containerRef.current;
        if (!container) return;

        // Import CSS first - load from public folder
        if (!document.getElementById('seatmap-canvas-styles')) {
          const link = document.createElement('link');
          link.id = 'seatmap-canvas-styles';
          link.rel = 'stylesheet';
          link.href = '/seatmap-canvas.css';
          document.head.appendChild(link);
        }

        // Wait a bit for CSS to load
        await new Promise(resolve => setTimeout(resolve, 100));

        const SeatmapCanvasModule = await import('@alisaitteke/seatmap-canvas');
        const SeatMapCanvas = (SeatmapCanvasModule as any).default || (SeatmapCanvasModule as any).SeatMapCanvas || SeatmapCanvasModule;

        // Ensure we have a unique ID for the container
        if (!container.id) {
          container.id = `seatmap-container-${Date.now()}`;
        }

        // Configuration for seatmap-canvas
        const config = {
          resizable: true,
          seat_style: {
            radius: 12,
            color: '#6796ff',
            hover: '#5671ff',
            not_salable: '#424747',
            selected: '#56aa45',
            focus: '#435fa4',
            focus_out: '#56aa45',
          },
          block_style: {
            fill: '#e2e2e2',
            stroke: '#e2e2e2',
          },
          label_style: {
            color: '#000',
            radius: 12,
            'font-size': '12px',
            bg: '#ffffff',
          },
        };

        // Create seatmap instance - use element directly or selector
        // Try element first, fallback to selector
        let seatmap;
        try {
          seatmap = new SeatMapCanvas(container, config);
        } catch (e) {
          // If element doesn't work, try selector
          seatmap = new SeatMapCanvas(`#${container.id}`, config);
        }

        // Convert event data to seatmap format
        const seatmapData = convertEventToSeatmapData();
        
        console.log('Seatmap data:', JSON.stringify(seatmapData, null, 2));
        console.log('Number of blocks:', seatmapData.blocks.length);
        console.log('Total seats:', seatmapData.blocks.reduce((sum, b) => sum + b.seats.length, 0));

        // Wait a bit for the instance to fully initialize
        await new Promise(resolve => setTimeout(resolve, 200));

        // Validate seatmap data before setting
        if (!seatmapData || !seatmapData.blocks || seatmapData.blocks.length === 0) {
          throw new Error('Invalid seatmap data: no blocks found');
        }

        // Validate each block and seat
        seatmapData.blocks.forEach((block: any, blockIndex: number) => {
          if (!block || !block.seats || !Array.isArray(block.seats)) {
            throw new Error(`Block ${blockIndex} is invalid: missing seats array`);
          }
          block.seats.forEach((seat: any, seatIndex: number) => {
            if (!seat || typeof seat.id === 'undefined' || !seat.title || typeof seat.x === 'undefined' || typeof seat.y === 'undefined') {
              throw new Error(`Seat ${seatIndex} in block ${blockIndex} is invalid: missing required properties (id, title, x, y)`);
            }
          });
        });

        // Set the data (automatically generates all seats)
        // According to docs, setData expects { blocks: [...] }
        try {
          if (typeof seatmap.setData === 'function') {
            console.log('Using setData method');
            seatmap.setData(seatmapData);
          } else if (seatmap.data && typeof seatmap.data.replaceData === 'function') {
            console.log('Using data.replaceData method');
            seatmap.data.replaceData(seatmapData.blocks);
          } else {
            console.warn('Available methods:', Object.keys(seatmap));
            console.warn('Data model:', seatmap.data);
            // Try alternative: directly setting data.blocks
            if (seatmap.data) {
              seatmap.data.blocks = seatmapData.blocks;
              console.log('Set blocks directly on data model');
            }
          }
        } catch (error: any) {
          console.error('Error setting seatmap data:', error);
          console.error('Error stack:', error?.stack);
          throw error;
        }

        // Handle seat clicks
        if (seatmap.addEventListener) {
          seatmap.addEventListener('seat_click', (seat: any) => {
            try {
              if (seat && seat.custom_data && seat.custom_data.sectionId && seat.custom_data.row && seat.custom_data.seat) {
                onSeatClick(
                  seat.custom_data.sectionId,
                  seat.custom_data.row,
                  seat.custom_data.seat
                );
              } else {
                console.warn('Invalid seat data in click handler:', seat);
              }
            } catch (err) {
              console.error('Error in seat click handler:', err, seat);
            }
          });
        }

        seatmapInstanceRef.current = seatmap;
        setIsLoaded(true);
        setLoading(false);
        setError(null);
      } catch (err: any) {
        console.error('Error initializing seatmap-canvas:', err);
        setError(err?.message || 'Failed to initialize seatmap');
        setLoading(false);
      }
    };

    initSeatmap();

    // Cleanup
    return () => {
      if (seatmapInstanceRef.current) {
        try {
          // Cleanup if available
          if (typeof seatmapInstanceRef.current.destroy === 'function') {
            seatmapInstanceRef.current.destroy();
          }
        } catch (e) {
          console.error('Error destroying seatmap:', e);
        }
      }
    };
  }, [convertEventToSeatmapData, onSeatClick]); // Only run once on mount

  // Update selections when selectedSeatIds changes
  useEffect(() => {
    if (!seatmapInstanceRef.current || !isLoaded) return;

    // Re-convert data with updated selections
    const seatmapData = convertEventToSeatmapData();
    if (seatmapInstanceRef.current.data && seatmapInstanceRef.current.data.replaceData) {
      seatmapInstanceRef.current.data.replaceData(seatmapData.blocks);
    } else if (seatmapInstanceRef.current.setData) {
      seatmapInstanceRef.current.setData(seatmapData);
    }
  }, [selectedSeatIds, event, isLoaded, convertEventToSeatmapData]);

  const totalSeats = event.sections.reduce(
    (acc, s) => acc + s.rows.reduce((sum, r) => sum + r.seats.length, 0),
    0
  );

  return (
    <div className="w-full h-full bg-gray-100 relative">
      {/* Header overlay */}
      <div className="absolute top-4 left-4 z-30 bg-white border-2 border-gray-300 p-4 shadow-lg rounded">
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

      {/* Seatmap container - full screen */}
      <div
        ref={containerRef}
        className="seats_container w-full h-full"
        style={{ 
          minHeight: '100vh',
          width: '100%',
          paddingTop: '120px', // Space for header
          position: 'relative',
          display: loading || error ? 'none' : 'block',
        }}
      />
    </div>
  );
}

