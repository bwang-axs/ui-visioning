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

        // Wait for container to be properly rendered with dimensions
        // Check multiple times to ensure it has dimensions
        let attempts = 0;
        while ((container.offsetWidth === 0 || container.offsetHeight === 0) && attempts < 10) {
          console.log(`Waiting for container dimensions (attempt ${attempts + 1})...`, {
            width: container.offsetWidth,
            height: container.offsetHeight
          });
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }

        if (container.offsetWidth === 0 || container.offsetHeight === 0) {
          console.warn('Container still has zero dimensions after waiting, but proceeding anyway');
        }

        // Ensure container is empty and ready
        container.innerHTML = '';

        // Import CSS first - load from public folder
        if (!document.getElementById('seatmap-canvas-styles')) {
          const link = document.createElement('link');
          link.id = 'seatmap-canvas-styles';
          link.rel = 'stylesheet';
          link.href = '/seatmap-canvas.css';
          document.head.appendChild(link);
        }

        // Wait a bit for CSS to load
        await new Promise(resolve => setTimeout(resolve, 200));

        const SeatmapCanvasModule = await import('@alisaitteke/seatmap-canvas');
        const SeatMapCanvas = (SeatmapCanvasModule as any).default || (SeatmapCanvasModule as any).SeatMapCanvas || SeatmapCanvasModule;

        // Ensure we have a unique ID and class for the container
        // Use a unique ID to avoid conflicts
        const uniqueId = `seatmap-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        if (!container.id) {
          container.id = uniqueId;
        }
        // Ensure only seats_container class (remove other classes that might conflict)
        container.className = 'seats_container';

        // Convert event data to seatmap format FIRST (before creating instance)
        const seatmapData = convertEventToSeatmapData();
        
        // Validate data before creating instance
        if (!seatmapData || !seatmapData.blocks || seatmapData.blocks.length === 0) {
          throw new Error('Invalid seatmap data: no blocks found');
        }

        // Validate each block and seat before passing to library
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

        console.log('Seatmap data prepared:', {
          blocks: seatmapData.blocks.length,
          totalSeats: seatmapData.blocks.reduce((sum: number, b: any) => sum + (b.seats?.length || 0), 0),
          firstBlockSample: seatmapData.blocks[0] ? {
            id: seatmapData.blocks[0].id,
            title: seatmapData.blocks[0].title,
            seatCount: seatmapData.blocks[0].seats?.length,
            firstSeat: seatmapData.blocks[0].seats?.[0]
          } : null
        });

        // Configuration for seatmap-canvas - ensure all required properties are defined
        const config: any = {
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

        // Verify container is in DOM and has dimensions
        const rect = container.getBoundingClientRect();
        const hasDimensions = container.offsetWidth > 0 && container.offsetHeight > 0;
        
        console.log('Container state before initialization:', {
          id: container.id,
          width: container.offsetWidth,
          height: container.offsetHeight,
          clientWidth: container.clientWidth,
          clientHeight: container.clientHeight,
          boundingRect: rect,
          isConnected: container.isConnected,
          hasDimensions: hasDimensions
        });

        // Force container to have visible dimensions
        // The library might need dimensions during initialization
        if (!hasDimensions) {
          container.style.display = 'block';
          container.style.width = '800px';
          container.style.height = '600px';
          container.style.position = 'relative';
          console.log('Forced container dimensions');
          // Wait one more frame for styles to apply
          await new Promise(resolve => requestAnimationFrame(resolve));
        }

        // Create seatmap instance using the unique ID selector
        const selector = `#${container.id}`;
        console.log('Creating SeatMapCanvas with selector:', selector);
        console.log('Final container check:', {
          selector: selector,
          found: !!document.querySelector(selector),
          width: container.offsetWidth,
          height: container.offsetHeight
        });
        
        let seatmap;
        try {
          seatmap = new SeatMapCanvas(selector, config);
          console.log('SeatMapCanvas instance created successfully');
        } catch (e: any) {
          console.error('Error creating SeatMapCanvas:', e);
          console.error('Full error:', e);
          // Try one more time with element directly
          console.log('Attempting fallback: creating with element directly...');
          try {
            seatmap = new SeatMapCanvas(container, config);
            console.log('SeatMapCanvas created successfully with element');
          } catch (e2: any) {
            console.error('Fallback also failed:', e2);
            throw e; // Throw original error
          }
        }
        
        // Remove the old log that might be too large
        console.log('Seatmap data prepared:', {
          blocks: seatmapData.blocks.length,
          totalSeats: seatmapData.blocks.reduce((sum: number, b: any) => sum + (b.seats?.length || 0), 0)
        });

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
          minHeight: 'calc(100vh - 120px)',
          height: 'calc(100vh - 120px)',
          width: '100%',
          paddingTop: '120px', // Space for header
          position: 'relative',
          display: loading || error ? 'none' : 'block',
          overflow: 'hidden',
        }}
      />
    </div>
  );
}

