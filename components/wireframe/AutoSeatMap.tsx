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

  // Convert event sections to seatmap-canvas block format
  const convertEventToSeatmapData = useCallback(() => {
    const blocks = event.sections.map((section, sectionIndex) => {
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

      let globalSeatId = 1;
      section.rows.forEach((row, rowIndex) => {
        row.seats.forEach((seat, seatIndex) => {
          const seatId = `${section.id}-${row.row}-${seat.seat}`;
          const isSelected = selectedSeatIds.includes(seatId);

          seats.push({
            id: globalSeatId++,
            title: seat.seat,
            x: sectionXOffset + seatIndex * seatSpacing,
            y: rowIndex * rowSpacing,
            salable: seat.available,
            note: `${section.name} - Row ${row.row} - Seat ${seat.seat} - $${seat.price}`,
            color: isSelected ? '#56aa45' : undefined,
            custom_data: {
              sectionId: section.id,
              row: row.row,
              seat: seat.seat,
              price: seat.price,
            },
          });
        });
      });

      return {
        id: sectionIndex + 1,
        title: section.name,
        color: '#e2e2e2',
        labels: [
          {
            title: section.name,
            x: -20,
            y: -10,
          },
        ],
        seats,
      };
    });

    return { blocks };
  }, [event, selectedSeatIds]);

  useEffect(() => {
    if (!containerRef.current || isLoaded) return;

    // Dynamically import seatmap-canvas
    const initSeatmap = async () => {
      try {
        const SeatmapCanvasModule = await import('@alisaitteke/seatmap-canvas');
        const SeatmapCanvas = (SeatmapCanvasModule as any).default || SeatmapCanvasModule;

        // Import CSS - load from public folder
        if (!document.getElementById('seatmap-canvas-styles')) {
          const link = document.createElement('link');
          link.id = 'seatmap-canvas-styles';
          link.rel = 'stylesheet';
          link.href = '/seatmap-canvas.css';
          document.head.appendChild(link);
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

        // Create seatmap instance
        const seatmap = new SeatmapCanvas(containerRef.current, config);

        // Convert event data to seatmap format
        const seatmapData = convertEventToSeatmapData();

        // Set the data (automatically generates all seats)
        // The library automatically renders all seats from the blocks data
        if (seatmap.data && seatmap.data.replaceData) {
          seatmap.data.replaceData(seatmapData.blocks);
        } else if (seatmap.setData) {
          // Fallback to setData if replaceData not available
          seatmap.setData(seatmapData);
        }

        // Handle seat clicks
        seatmap.addEventListener('seat_click', (seat: any) => {
          if (seat.custom_data) {
            onSeatClick(
              seat.custom_data.sectionId,
              seat.custom_data.row,
              seat.custom_data.seat
            );
          }
        });

        seatmapInstanceRef.current = seatmap;
        setIsLoaded(true);
      } catch (error) {
        console.error('Error initializing seatmap-canvas:', error);
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

      {/* Seatmap container - full screen */}
      <div
        ref={containerRef}
        className="seats_container w-full h-full"
        style={{ 
          minHeight: '100vh',
          width: '100%',
          paddingTop: '120px', // Space for header
        }}
      />
    </div>
  );
}

