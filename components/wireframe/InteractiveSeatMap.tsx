'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Event } from '@/lib/types';
import { stadiumSectionPositions } from '@/lib/data/stadiumLayout';

interface InteractiveSeatMapProps {
  event: Event;
  selectedSeatIds: string[];
  onSeatClick: (sectionId: string, row: string, seat: string) => void;
  onSectionChange?: (sectionId: string | null) => void;
  rightPanelWidth?: number;
}

// Zoom thresholds
const ZOOM_SECTIONS = 1; // Show sections as boxes
const ZOOM_TRANSITION = 3; // Start showing seats
const ZOOM_SEATS = 5; // Fully zoomed into seats

export default function InteractiveSeatMap({
  event,
  selectedSeatIds,
  onSeatClick,
  onSectionChange,
  rightPanelWidth = 384,
}: InteractiveSeatMapProps) {
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [focusedSectionId, setFocusedSectionId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [viewportWidth, setViewportWidth] = useState(1200);
  const canvasRef = useRef<HTMLDivElement>(null);

  const getSeatId = (sectionId: string, row: string, seat: string) => {
    return `${sectionId}-${row}-${seat}`;
  };

  const isSeatSelected = (sectionId: string, row: string, seat: string) => {
    return selectedSeatIds.includes(getSeatId(sectionId, row, seat));
  };

  // Track viewport width
  useEffect(() => {
    const updateViewport = () => {
      setViewportWidth(window.innerWidth);
    };
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  // Handle section click - smoothly zoom into section
  const handleSectionClick = (sectionId: string) => {
    const section = event.sections.find((s) => s.id === sectionId);
    if (!section) return;

    setFocusedSectionId(sectionId);
    // Animate zoom to transition level
    setScale(ZOOM_TRANSITION);
    
    // Center on section
    const position = section.position || stadiumSectionPositions[section.name] || { x: 50, y: 50 };
    const leftViewportWidth = viewportWidth - rightPanelWidth;
    const centerX = (position.x / 100) * leftViewportWidth;
    const centerY = (position.y / 100) * window.innerHeight;
    
    setPan({
      x: -(centerX - leftViewportWidth / 2) * ZOOM_TRANSITION,
      y: -(centerY - window.innerHeight / 2) * ZOOM_TRANSITION,
    });

    if (onSectionChange) {
      onSectionChange(sectionId);
    }
  };

  const handleZoomIn = () => {
    if (scale < 8) {
      setScale((prev) => Math.min(prev + 0.5, 8));
    }
  };

  const handleZoomOut = () => {
    if (scale > 1) {
      const newScale = Math.max(scale - 0.5, 1);
      setScale(newScale);
      
      // If zooming out completely, reset focus
      if (newScale <= ZOOM_SECTIONS) {
        setFocusedSectionId(null);
        setPan({ x: 0, y: 0 });
        if (onSectionChange) {
          onSectionChange(null);
        }
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > ZOOM_SECTIONS) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && scale > ZOOM_SECTIONS) {
        const newPanX = e.clientX - dragStart.x;
        const newPanY = e.clientY - dragStart.y;
        setPan({
          x: Math.min(newPanX, 0),
          y: newPanY,
        });
      }
    },
    [isDragging, dragStart, scale]
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

  // Calculate availability for a section
  const getSectionAvailability = (section: typeof event.sections[0]) => {
    const availableSeats = section.rows.reduce(
      (acc, r) => acc + r.seats.filter((s) => s.available).length,
      0
    );
    const totalSeats = section.rows.reduce((acc, r) => acc + r.seats.length, 0);
    return { availableSeats, totalSeats, ratio: availableSeats / totalSeats };
  };

  // Render a section as a box (low zoom)
  const renderSectionBox = (section: typeof event.sections[0], index: number) => {
    const availability = getSectionAvailability(section);
    const position = section.position || stadiumSectionPositions[section.name] || { x: 50, y: 50 };
    
    const showAsBox = scale < ZOOM_TRANSITION;
    const showSeats = scale >= ZOOM_TRANSITION;
    const isFocused = focusedSectionId === section.id;
    
    // Calculate opacity and scale based on zoom
    const sectionScale = isFocused && showSeats 
      ? 1 + (scale - ZOOM_TRANSITION) * 0.3 
      : 1;
    
    const sectionOpacity = showSeats && !isFocused 
      ? Math.max(0.1, 1 - (scale - ZOOM_TRANSITION) * 0.3) 
      : 1;

    if (showSeats && !isFocused && scale > ZOOM_TRANSITION + 1) {
      return null; // Hide other sections when fully zoomed
    }

    return (
      <div
        key={section.id}
        className="absolute"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: `translate(-50%, -50%) scale(${sectionScale})`,
          opacity: sectionOpacity,
          transition: isDragging ? 'none' : 'all 0.3s ease-out',
          pointerEvents: showSeats && !isFocused ? 'none' : 'auto',
        }}
      >
        {showAsBox ? (
          // Render as clickable box
          <button
            onClick={() => handleSectionClick(section.id)}
            className={`border-2 px-3 py-2 rounded transition-all hover:scale-110 min-w-[80px] ${
              availability.ratio > 0.5
                ? 'border-blue-500 bg-blue-100 hover:bg-blue-200'
                : availability.ratio > 0
                ? 'border-orange-500 bg-orange-100 hover:bg-orange-200'
                : 'border-gray-400 bg-gray-300 cursor-not-allowed'
            }`}
          >
            <div className="text-center">
              <p className="font-semibold text-xs">{section.name}</p>
              <p className="text-xs mt-1">${section.price}</p>
            </div>
          </button>
        ) : showSeats && isFocused ? (
          // Render as seats when zoomed in
          <div className="relative">
            <div className="mb-2 text-center">
              <p className="text-sm font-bold">{section.name}</p>
              <p className="text-xs">${section.price}</p>
            </div>
            <div className="flex flex-col items-center gap-1" style={{ transform: `scale(${Math.min(1, (scale - ZOOM_TRANSITION) / 2)})` }}>
              {section.rows.slice(0, Math.floor(scale - ZOOM_TRANSITION) * 2 + 3).map((row) => (
                <div key={row.row} className="flex items-center gap-1">
                  <span className="text-[8px] text-gray-600 w-6 text-right">{row.row}</span>
                  <div className="flex gap-0.5">
                    {row.seats.slice(0, Math.floor((scale - ZOOM_TRANSITION) * 3) + 5).map((seat) => {
                      const seatId = getSeatId(section.id, row.row, seat.seat);
                      const isSelected = isSeatSelected(section.id, row.row, seat.seat);
                      
                      return (
                        <button
                          key={seat.seat}
                          onClick={() => onSeatClick(section.id, row.row, seat.seat)}
                          disabled={!seat.available}
                          className={`rounded-full border transition-all ${
                            !seat.available
                              ? 'bg-gray-400 border-gray-500 cursor-not-allowed'
                              : isSelected
                              ? 'bg-blue-600 border-blue-700 ring-1 ring-blue-400'
                              : 'bg-gray-100 border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                          }`}
                          style={{
                            width: Math.max(12, 20 - (8 - scale) * 2),
                            height: Math.max(12, 20 - (8 - scale) * 2),
                            fontSize: scale > 6 ? '8px' : '0px',
                          }}
                          title={`${section.name} Row ${row.row} Seat ${seat.seat} - $${seat.price}`}
                        >
                          {scale > 6 ? seat.seat : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  const leftViewportWidth = viewportWidth - rightPanelWidth;

  return (
    <div
      ref={canvasRef}
      className="fixed inset-0 bg-gray-100 overflow-hidden"
      style={{ width: '100%', height: '100vh' }}
      onMouseDown={handleMouseDown}
    >
      {/* Zoom Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 border-2 border-gray-300 bg-white">
        <button
          onClick={handleZoomIn}
          className="px-3 py-2 border-b border-gray-300 hover:bg-gray-100 font-bold"
          disabled={scale >= 8}
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="px-3 py-2 hover:bg-gray-100 font-bold"
          disabled={scale <= 1}
        >
          −
        </button>
      </div>

      {/* Left viewport container */}
      <div
        className="absolute"
        style={{
          left: 0,
          top: 0,
          width: `${leftViewportWidth}px`,
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Stage - only show at low zoom */}
        {scale < ZOOM_TRANSITION && (
          <div
            className="absolute border-4 border-gray-700 bg-gray-800 text-white flex items-center justify-center font-bold text-xl"
            style={{
              right: '15%',
              bottom: '20%',
              width: '300px',
              height: '150px',
              transition: 'all 0.3s ease-out',
              opacity: Math.max(0, 1 - (scale - 1) * 0.5),
            }}
          >
            STAGE
          </div>
        )}

        {/* Sections container with pan and zoom */}
        <div
          className="absolute w-full h-full"
          style={{
            transform: `translate(${Math.min(pan.x, 0)}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: 'left center',
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          }}
        >
          {/* Render all sections */}
          {event.sections.map((section, index) => renderSectionBox(section, index))}

          {/* Mezzanine Labels - only at low zoom */}
          {scale < ZOOM_TRANSITION && (
            <>
              <div
                className="absolute text-xs text-gray-600 font-semibold"
                style={{
                  top: '15%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  opacity: Math.max(0, 1 - (scale - 1) * 0.5),
                  transition: 'opacity 0.3s ease-out',
                }}
              >
                MEZZANINE UPPER
              </div>
              <div
                className="absolute text-xs text-gray-600 font-semibold"
                style={{
                  bottom: '15%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  opacity: Math.max(0, 1 - (scale - 1) * 0.5),
                  transition: 'opacity 0.3s ease-out',
                }}
              >
                MEZZANINE LOWER
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
