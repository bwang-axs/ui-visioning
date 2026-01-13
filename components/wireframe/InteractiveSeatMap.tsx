'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Event } from '@/lib/types';
import { stadiumSectionPositions, graySections } from '@/lib/data/stadiumLayout';

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
  const seatchartInstanceRef = useRef<any>(null);
  const seatchartContainerRef = useRef<HTMLDivElement>(null);

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

  // Handle section click - smoothly zoom into section and render with Seatchart
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

    // Render section with Seatchart when zoomed in
    renderSectionWithSeatchart(section);

    if (onSectionChange) {
      onSectionChange(sectionId);
    }
  };

  // Render a section using Seatchart for automatic seat generation
  const renderSectionWithSeatchart = useCallback(async (section: typeof event.sections[0]) => {
    if (!seatchartContainerRef.current) return;

    // Destroy previous instance
    if (seatchartInstanceRef.current) {
      try {
        seatchartInstanceRef.current.destroy();
      } catch (e) {
        // Ignore errors
      }
    }

    // Dynamically import Seatchart
    const SeatchartModule = await import('seatchart');
    const Seatchart = (SeatchartModule as any).default || SeatchartModule;

    // Clear container
    seatchartContainerRef.current.innerHTML = '';

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

    // Create Seatchart instance
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
      const seatChart = new Seatchart(seatchartContainerRef.current, options);
      seatchartInstanceRef.current = seatChart;
    } catch (e) {
      console.error('Error creating Seatchart instance:', e);
    }
  }, [selectedSeatIds, onSeatClick]);

  // Update Seatchart when zooming into a section
  useEffect(() => {
    if (focusedSectionId && scale >= ZOOM_TRANSITION && seatchartContainerRef.current) {
      const section = event.sections.find((s) => s.id === focusedSectionId);
      if (section) {
        renderSectionWithSeatchart(section);
      }
    }
  }, [focusedSectionId, scale, event, renderSectionWithSeatchart]);

  const handleZoomIn = () => {
    if (scale < 8) {
      setScale((prev) => Math.min(prev + 0.5, 8));
    }
  };

  const handleZoomOut = () => {
    if (scale > 1) {
      const newScale = Math.max(scale - 0.5, 1);
      setScale(newScale);
      
      // If zooming out completely, reset focus and destroy Seatchart
      if (newScale <= ZOOM_SECTIONS) {
        setFocusedSectionId(null);
        setPan({ x: 0, y: 0 });
        if (seatchartInstanceRef.current) {
          try {
            seatchartInstanceRef.current.destroy();
          } catch (e) {
            // Ignore
          }
          seatchartInstanceRef.current = null;
        }
        if (seatchartContainerRef.current) {
          seatchartContainerRef.current.innerHTML = '';
        }
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
    const isGraySection = graySections.has(section.name);
    
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

    // Determine section color - gray sections should always be light gray
    let sectionColorClass = '';
    if (isGraySection) {
      sectionColorClass = 'border-gray-400 bg-gray-300 text-gray-700 hover:bg-gray-400';
    } else if (availability.ratio > 0.5) {
      sectionColorClass = 'border-blue-500 bg-blue-500 text-white hover:bg-blue-600';
    } else if (availability.ratio > 0) {
      sectionColorClass = 'border-orange-500 bg-orange-500 text-white hover:bg-orange-600';
    } else {
      sectionColorClass = 'border-gray-400 bg-gray-400 text-gray-600 cursor-not-allowed';
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
          // Render as clickable box - smaller for better stadium view
          <button
            onClick={() => handleSectionClick(section.id)}
            className={`border-2 px-2 py-1 rounded transition-all hover:scale-110 ${sectionColorClass}`}
            style={{
              minWidth: '50px',
              fontSize: '10px',
              padding: '4px 8px',
            }}
          >
            <div className="text-center">
              <p className="font-semibold text-[10px] leading-tight">{section.name}</p>
            </div>
          </button>
        ) : showSeats && isFocused ? (
          // Render as seats using Seatchart when zoomed in
          <div className="relative bg-white border-2 border-gray-300 rounded p-4" style={{ minWidth: '600px', minHeight: '500px' }}>
            <div className="mb-4 text-center">
              <button
                onClick={handleZoomOut}
                className="px-4 py-2 border-2 border-gray-300 bg-white hover:border-gray-500 mb-2"
              >
                ← Back to Sections
              </button>
              <p className="text-lg font-bold">{section.name}</p>
              <p className="text-sm text-gray-600">${section.price}</p>
            </div>
            <div
              ref={seatchartContainerRef}
              className="seatchart-container w-full"
              style={{
                minHeight: '400px',
              }}
            />
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
        {/* Stage - positioned on far right as dark rectangle */}
        {scale < ZOOM_TRANSITION && (
          <div
            className="absolute border-4 border-gray-900 bg-gray-900 text-white flex items-center justify-center font-bold text-2xl z-0"
            style={{
              left: '92%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '200px',
              height: '400px',
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

          {/* Mezzanine Labels - positioned accurately */}
          {scale < ZOOM_TRANSITION && (
            <>
              <div
                className="absolute text-[9px] text-gray-600 font-semibold z-10"
                style={{
                  top: '14%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  opacity: Math.max(0, 1 - (scale - 1) * 0.5),
                  transition: 'opacity 0.3s ease-out',
                }}
              >
                MEZZANINE UPPER
              </div>
              <div
                className="absolute text-[9px] text-gray-600 font-semibold z-10"
                style={{
                  top: '85%',
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
