// Helper function to generate seats for a section
export function generateSeats(
  sectionId: string,
  sectionName: string,
  numRows: number,
  seatsPerRow: number,
  basePrice: number,
  availabilityRatio: number = 0.8
) {
  const rows: Array<{
    row: string;
    seats: Array<{ seat: string; available: boolean; price: number }>;
  }> = [];

  for (let i = 0; i < numRows; i++) {
    const rowLabel = i < 26 ? String.fromCharCode(65 + i) : `${i + 1}`;
    const seats: Array<{ seat: string; available: boolean; price: number }> = [];

    for (let j = 1; j <= seatsPerRow; j++) {
      const isAvailable = Math.random() < availabilityRatio;
      seats.push({
        seat: j.toString(),
        available: isAvailable,
        price: basePrice,
      });
    }

    rows.push({ row: rowLabel, seats });
  }

  return rows;
}

// Stadium section positions - Horseshoe layout matching the image
// x, y are percentages for positioning (0-100)
export const stadiumSectionPositions: Record<string, { x: number; y: number }> = {
  // Stage - Far right, tall vertical rectangle
  STAGE: { x: 92, y: 50 },

  // Inner Ring - Floor sections (lettered) facing stage
  // Right side (closest to stage, vertical stack):
  'C': { x: 82, y: 48 },  // Top-center-right
  'F': { x: 80, y: 52 },  // Center-right  
  'J': { x: 78, y: 42 },  // Upper-right
  'A': { x: 80, y: 50 },  // Between C and F
  
  // Center area:
  'E': { x: 72, y: 52 },  // Center (gray)
  'H': { x: 70, y: 48 },  // Top-center (gray)
  
  // Bottom-center (near stage):
  'B': { x: 78, y: 68 },  // Bottom-center
  
  // Bottom-right curve:
  'D': { x: 80, y: 72 },
  'G': { x: 77, y: 75 },
  
  // Inner Ring - 100-level sections
  // Top-center:
  '101': { x: 58, y: 30 },
  '102': { x: 53, y: 28 },
  
  // Right side (near stage, upper):
  '103': { x: 85, y: 36 },  // Gray
  '104': { x: 86, y: 32 },
  '105': { x: 87, y: 38 },
  
  // Left side:
  '121': { x: 43, y: 38 },
  '122': { x: 40, y: 36 },
  
  // Center-left (gray sections):
  '118': { x: 52, y: 64 },
  '119': { x: 50, y: 61 },
  '120': { x: 48, y: 57 },
  
  // Right side (near stage, lower vertical stack):
  '108': { x: 88, y: 55 },
  '109': { x: 88, y: 59 },
  '110': { x: 88, y: 63 },
  '111': { x: 87, y: 66 },
  '112': { x: 86, y: 69 },
  '113': { x: 85, y: 71 },
  '114': { x: 84, y: 73 },
  
  // Small section near stage center
  '211': { x: 89, y: 50 },
  
  // Outer Ring - 200-level Mezzanine UPPER (top curve of horseshoe)
  '227': { x: 23, y: 18 },  // Far left
  '228': { x: 28, y: 17 },
  '229': { x: 33, y: 16 },
  '230': { x: 38, y: 15 },
  '201': { x: 43, y: 14 },
  '202': { x: 48, y: 14 },  // Gray - MEZZANINE UPPER label here
  '203': { x: 53, y: 15 },
  '204': { x: 58, y: 16 },
  '205': { x: 63, y: 18 },
  '206': { x: 68, y: 20 },
  '207': { x: 72, y: 22 },
  '208': { x: 76, y: 25 },
  
  // Right side upper:
  '209': { x: 84, y: 28 },
  '210': { x: 87, y: 32 },  // Gray
  
  // Outer Ring - 200-level Mezzanine LOWER (bottom curve of horseshoe)
  '219': { x: 28, y: 80 },
  '218': { x: 33, y: 81 },
  '217': { x: 38, y: 82 },
  '216': { x: 43, y: 83 },
  '215': { x: 46, y: 84 },  // Gray
  '214': { x: 48, y: 84 },  // Gray - MEZZANINE LOWER label here
  '213': { x: 50, y: 84 },  // Gray
  '212': { x: 53, y: 83 },
  
  // Bottom-center (gray):
  '115': { x: 58, y: 77 },
  '116': { x: 60, y: 75 },
  '117': { x: 62, y: 73 },
  
  // Left side (vertical stack):
  '220': { x: 26, y: 74 },
  '221': { x: 23, y: 69 },
  '222': { x: 21, y: 64 },
  '223': { x: 20, y: 59 },
  '224': { x: 20, y: 54 },
  '225': { x: 21, y: 49 },
  '226': { x: 23, y: 44 },
};

// Sections that should be gray based on the image
export const graySections = new Set([
  'E', 'H', '103', '115', '116', '117', '118', '119', '120', '202', '210', '213', '214', '215'
]);

// Get section color based on availability
export function getSectionColor(availabilityRatio: number): string {
  if (availabilityRatio > 0.5) {
    return 'blue'; // Available
  } else if (availabilityRatio > 0) {
    return 'orange'; // Low availability
  } else {
    return 'gray'; // Sold out
  }
}
