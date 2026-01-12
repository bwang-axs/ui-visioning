'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Event, SeatSection } from '@/lib/types';

interface InteractiveSeatMapProps {
  event: Event;
  selectedSeatIds: string[];
  onSeatClick: (sectionId: string, row: string, seat: string) => void;
  onSectionChange?: (sectionId: string | null) => void;
}

type ZoomLevel = 'sections' | 'seats';

export default function InteractiveSeatMap({
  event,
  selectedSeatIds,
  onSeatClick,
  onSectionChange,
}: InteractiveSeatMapProps) {
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('sections');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const getSeatId = (sectionId: string, row: string, seat: string) => {
    return `${sectionId}-${row}-${seat}`;
  };

  const isSeatSelected = (sectionId: string, row: string, seat: string) => {
    return selectedSeatIds.includes(getSeatId(sectionId, row, seat));
  };

  const handleSectionClick = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    setZoomLevel('seats');
    setScale(2);
    setPan({ x: 0, y: 0 });
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
  };

  const handleZoomOut = () => {
    setZoomLevel('sections');
    setSelectedSectionId(null);
    setScale(1);
    setPan({ x: 0, y: 0 });
    if (onSectionChange) {
      onSectionChange(null);
    }
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 4));
  };

  const handleZoomOutBtn = () => {
    if (zoomLevel === 'seats' && scale <= 1.5) {
      handleZoomOut();
    } else {
      setScale((prev) => Math.max(prev - 0.5, 0.5));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel === 'seats') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && zoomLevel === 'seats') {
        setPan({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    },
    [isDragging, dragStart, zoomLevel]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove]);

  // Render sections view (zoomed out)
  const renderSectionsView = () => {
    const padding = 40;
    const stageWidth = 400;
    const stageHeight = 200;

    // Calculate availability for each section
    const sectionsWithAvailability = event.sections.map((section) => {
      const availableSeats = section.rows.reduce(
        (acc, r) => acc + r.seats.filter((s) => s.available).length,
        0
      );
      const totalSeats = section.rows.reduce(
        (acc, r) => acc + r.seats.length,
        0
      );
      return {
        ...section,
        availableSeats,
        totalSeats,
        availabilityRatio: availableSeats / totalSeats,
      };
    });

    // Group sections by type (floor vs upper sections)
    const floorSections = sectionsWithAvailability.filter((s) =>
      s.name.toLowerCase().includes('floor') || s.name.toLowerCase().includes('a')
    );
    const upperSections = sectionsWithAvailability.filter(
      (s) => !floorSections.includes(s)
    );

    return (
      <div
        className="relative flex items-center justify-center"
        style={{ width: '100%', height: '100%', minHeight: '600px' }}
      >
        {/* Stage */}
        <div
          className="absolute border-4 border-gray-700 bg-gray-800 text-white flex items-center justify-center font-bold text-2xl z-10"
          style={{
            bottom: padding,
            left: '50%',
            transform: 'translateX(-50%)',
            width: stageWidth,
            height: stageHeight,
          }}
        >
          STAGE
        </div>

        {/* Stadium Layout */}
        <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
          {/* Upper Sections - Arranged in semi-circle above stage */}
          {upperSections.length > 0 && (
            <div className="mb-8">
              <div className="text-xs text-gray-600 mb-2 text-center font-semibold">
                MEZZANINE UPPER
              </div>
              <div className="flex flex-wrap justify-center gap-2 max-w-4xl">
                {upperSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionClick(section.id)}
                    className={`border-2 px-4 py-3 rounded transition-all hover:scale-105 min-w-[100px] ${
                      section.availabilityRatio > 0.5
                        ? 'border-blue-500 bg-blue-100 hover:bg-blue-200'
                        : section.availabilityRatio > 0
                        ? 'border-orange-500 bg-orange-100 hover:bg-orange-200'
                        : 'border-gray-400 bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-center">
                      <p className="font-semibold text-sm">{section.name}</p>
                      <p className="text-xs mt-1">${section.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Floor Sections - Around the stage */}
          {floorSections.length > 0 && (
            <div className="mb-32">
              <div className="text-xs text-gray-600 mb-2 text-center font-semibold">
                MEZZANINE LOWER
              </div>
              <div className="flex flex-wrap justify-center gap-2 max-w-5xl">
                {floorSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionClick(section.id)}
                    className={`border-2 px-4 py-3 rounded transition-all hover:scale-105 min-w-[100px] ${
                      section.availabilityRatio > 0.5
                        ? 'border-blue-500 bg-blue-100 hover:bg-blue-200'
                        : section.availabilityRatio > 0
                        ? 'border-orange-500 bg-orange-100 hover:bg-orange-200'
                        : 'border-gray-400 bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-center">
                      <p className="font-semibold text-sm">{section.name}</p>
                      <p className="text-xs mt-1">${section.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fallback: Show all sections in grid if grouping doesn't work */}
          {floorSections.length === 0 && upperSections.length === 0 && (
            <div className="grid grid-cols-8 gap-3 w-full">
              {sectionsWithAvailability.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className={`border-2 p-3 rounded transition-all hover:scale-105 ${
                    section.availabilityRatio > 0.5
                      ? 'border-blue-500 bg-blue-100 hover:bg-blue-200'
                      : section.availabilityRatio > 0
                      ? 'border-orange-500 bg-orange-100 hover:bg-orange-200'
                      : 'border-gray-400 bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  <div className="text-center">
                    <p className="font-semibold text-sm">{section.name}</p>
                    <p className="text-xs mt-1">${section.price}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render seats view (zoomed in)
  const renderSeatsView = () => {
    const section = event.sections.find((s) => s.id === selectedSectionId);
    if (!section) return null;

    const seatSize = 24;
    const rowSpacing = 30;
    const seatSpacing = 28;

    return (
      <div
        className="relative overflow-hidden"
        style={{ width: '100%', height: '100%', minHeight: '600px' }}
        onMouseDown={handleMouseDown}
      >
        <div
          className="absolute"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          }}
        >
          {/* Section Header */}
          <div className="mb-4 text-center">
            <button
              onClick={handleZoomOut}
              className="px-4 py-2 border-2 border-gray-300 bg-white hover:border-gray-500 mb-2"
            >
              ← Back to Sections
            </button>
            <h3 className="text-xl font-bold">{section.name}</h3>
            <p className="text-sm text-gray-600">${section.price}</p>
          </div>

          {/* Seats Grid */}
          <div className="flex flex-col items-center gap-2">
            {section.rows.map((row, rowIndex) => (
              <div key={row.row} className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-8 text-right">{row.row}</span>
                <div className="flex gap-1">
                  {row.seats.map((seat) => {
                    const seatId = getSeatId(section.id, row.row, seat.seat);
                    const isSelected = isSeatSelected(section.id, row.row, seat.seat);

                    return (
                      <button
                        key={seat.seat}
                        onClick={() => onSeatClick(section.id, row.row, seat.seat)}
                        disabled={!seat.available}
                        className={`rounded-full border-2 transition-all ${
                          !seat.available
                            ? 'bg-gray-400 border-gray-500 cursor-not-allowed'
                            : isSelected
                            ? 'bg-blue-600 border-blue-700 ring-2 ring-blue-400'
                            : 'bg-gray-100 border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                        }`}
                        style={{
                          width: seatSize,
                          height: seatSize,
                          fontSize: '10px',
                        }}
                        title={`${section.name} Row ${row.row} Seat ${seat.seat} - $${seat.price}`}
                      >
                        {seatSize > 20 ? seat.seat : ''}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={canvasRef}
      className="relative bg-gray-100 border-2 border-gray-300 overflow-hidden"
      style={{ width: '100%', minHeight: '600px' }}
    >
      {/* Zoom Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 border-2 border-gray-300 bg-white">
        <button
          onClick={handleZoomIn}
          className="px-3 py-2 border-b border-gray-300 hover:bg-gray-100 font-bold"
          disabled={scale >= 4}
        >
          +
        </button>
        <button
          onClick={handleZoomOutBtn}
          className="px-3 py-2 hover:bg-gray-100 font-bold"
          disabled={zoomLevel === 'sections' && scale <= 1}
        >
          −
        </button>
      </div>

      {/* Seatmap Content */}
      {zoomLevel === 'sections' ? renderSectionsView() : renderSeatsView()}
    </div>
  );
}
