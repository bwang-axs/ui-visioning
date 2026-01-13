/**
 * Utility functions to automatically generate seatmap data from configuration
 * Useful for generating large seatmaps (e.g., 500 seats) from simple config
 */

export interface SeatmapConfig {
  sections: Array<{
    name: string;
    id: string;
    rows: number;
    seatsPerRow: number;
    basePrice: number;
    availabilityRatio?: number; // 0-1, default 0.8
    xOffset?: number; // Starting X position for this section
  }>;
}

export interface GeneratedSeat {
  id: number;
  title: string;
  x: number;
  y: number;
  salable: boolean;
  note?: string;
  custom_data?: {
    sectionId: string;
    row: string;
    seat: string;
    price: number;
  };
}

export interface GeneratedBlock {
  id: number;
  title: string;
  color: string;
  labels: Array<{ title: string; x: number; y: number }>;
  seats: GeneratedSeat[];
}

/**
 * Automatically generates seatmap blocks from a simple configuration
 * Example: Generate 500 seats across 5 sections with 100 seats each
 */
export function generateSeatmapFromConfig(config: SeatmapConfig): {
  blocks: GeneratedBlock[];
} {
  const blocks: GeneratedBlock[] = [];
  const rowSpacing = 35; // Vertical spacing between rows
  const seatSpacing = 30; // Horizontal spacing between seats
  let globalSeatId = 1;
  let currentXOffset = 0;

  config.sections.forEach((section, sectionIndex) => {
    const xOffset = section.xOffset ?? currentXOffset;
    const seats: GeneratedSeat[] = [];
    const availabilityRatio = section.availabilityRatio ?? 0.8;

    // Generate rows and seats
    for (let rowIndex = 0; rowIndex < section.rows; rowIndex++) {
      const rowLabel = rowIndex < 26 ? String.fromCharCode(65 + rowIndex) : `${rowIndex + 1}`;

      for (let seatIndex = 0; seatIndex < section.seatsPerRow; seatIndex++) {
        const seatNumber = (seatIndex + 1).toString();
        const isAvailable = Math.random() < availabilityRatio;
        const seatId = `${section.id}-${rowLabel}-${seatNumber}`;

        seats.push({
          id: globalSeatId++,
          title: seatNumber,
          x: xOffset + seatIndex * seatSpacing,
          y: rowIndex * rowSpacing,
          salable: isAvailable,
          note: `${section.name} - Row ${rowLabel} - Seat ${seatNumber} - $${section.basePrice}`,
          custom_data: {
            sectionId: section.id,
            row: rowLabel,
            seat: seatNumber,
            price: section.basePrice,
          },
        });
      }
    }

    blocks.push({
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
    });

    // Update X offset for next section (add padding)
    currentXOffset = xOffset + section.seatsPerRow * seatSpacing + 100;
  });

  return { blocks };
}

/**
 * Quick helper to generate a large seatmap (e.g., 500 seats)
 * Example usage:
 * ```
 * const seatmapData = generateLargeSeatmap({
 *   totalSeats: 500,
 *   sections: 5,
 *   basePrice: 75
 * });
 * ```
 */
export function generateLargeSeatmap(options: {
  totalSeats: number;
  sections?: number;
  basePrice?: number;
  availabilityRatio?: number;
}): { blocks: GeneratedBlock[] } {
  const {
    totalSeats,
    sections = 5,
    basePrice = 75,
    availabilityRatio = 0.8,
  } = options;

  const seatsPerSection = Math.ceil(totalSeats / sections);
  const rowsPerSection = Math.ceil(Math.sqrt(seatsPerSection));
  const seatsPerRow = Math.ceil(seatsPerSection / rowsPerSection);

  const config: SeatmapConfig = {
    sections: Array.from({ length: sections }, (_, i) => ({
      name: `Section ${String.fromCharCode(65 + i)}`,
      id: `section-${i + 1}`,
      rows: rowsPerSection,
      seatsPerRow,
      basePrice: basePrice + i * 10, // Vary price by section
      availabilityRatio,
      xOffset: i * (seatsPerRow * 30 + 100),
    })),
  };

  return generateSeatmapFromConfig(config);
}

