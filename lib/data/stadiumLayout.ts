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

// Stadium section positions (x, y coordinates as percentages for centering)
// Layout based on oval/concentric ring structure with stage on right
export const stadiumSectionPositions: Record<string, { x: number; y: number }> = {
  // Stage - Right side, center
  STAGE: { x: 85, y: 50 },

  // Floor sections (A-J) - In front of stage, arranged vertically
  // Directly in front (right side, from bottom to top):
  'A': { x: 75, y: 65 },  // Bottom
  'B': { x: 75, y: 55 },  // Middle-bottom
  'C': { x: 75, y: 45 },  // Middle-top
  // To the left of A, B, C (from bottom to top):
  'D': { x: 68, y: 65 },  // Bottom
  'E': { x: 68, y: 55 },  // Middle (gray)
  'F': { x: 68, y: 45 },  // Top
  // Further left (from bottom to top):
  'G': { x: 60, y: 65 },  // Bottom
  'H': { x: 60, y: 55 },  // Middle (gray)
  'J': { x: 60, y: 45 },  // Top

  // 100-level sections - Inner ring surrounding floor sections
  // Left side (counter-clockwise from J, going down):
  '115': { x: 50, y: 70 },  // Bottom-left
  '116': { x: 47, y: 68 },
  '117': { x: 44, y: 65 },
  '118': { x: 42, y: 60 },
  '119': { x: 40, y: 55 },
  '120': { x: 38, y: 50 },
  // Top side (clockwise from 120):
  '121': { x: 38, y: 40 },
  '122': { x: 40, y: 35 },
  '101': { x: 43, y: 30 },
  '102': { x: 47, y: 28 },
  // Right side (towards stage):
  '103': { x: 70, y: 32 },  // Gray section
  '104': { x: 73, y: 30 },
  '105': { x: 76, y: 32 },
  '106': { x: 79, y: 35 },
  '107': { x: 81, y: 40 },
  '108': { x: 82, y: 45 },
  '109': { x: 82, y: 50 },
  // Bottom side (completing the ring):
  '110': { x: 81, y: 55 },
  '111': { x: 79, y: 60 },
  '112': { x: 76, y: 63 },
  '113': { x: 73, y: 65 },
  '114': { x: 70, y: 67 },

  // 200-level Mezzanine UPPER (top of chart)
  '227': { x: 30, y: 22 },  // Far left
  '228': { x: 33, y: 20 },
  '229': { x: 36, y: 18 },
  '230': { x: 39, y: 17 },
  '201': { x: 42, y: 16 },
  '202': { x: 46, y: 15 },  // Gray
  '203': { x: 50, y: 16 },
  '204': { x: 54, y: 17 },

  // 200-level Mezzanine LOWER (bottom of chart)
  '212': { x: 50, y: 82 },
  '213': { x: 46, y: 83 },  // Gray
  '214': { x: 42, y: 84 },  // Gray
  '215': { x: 39, y: 85 },  // Gray
  '216': { x: 36, y: 84 },
  '217': { x: 33, y: 83 },
  '218': { x: 30, y: 81 },
  '219': { x: 28, y: 78 },

  // 200-level Right Side (top-right to bottom-right)
  '205': { x: 60, y: 18 },
  '206': { x: 65, y: 20 },
  '207': { x: 70, y: 23 },
  '208': { x: 73, y: 26 },
  '209': { x: 76, y: 30 },
  '210': { x: 78, y: 35 },  // Gray
  '211': { x: 79, y: 40 },

  // 200-level Left Side (bottom-left to top-left)
  '220': { x: 25, y: 70 },
  '221': { x: 23, y: 65 },
  '222': { x: 22, y: 60 },
  '223': { x: 22, y: 55 },
  '224': { x: 23, y: 50 },
  '225': { x: 25, y: 45 },
  '226': { x: 28, y: 40 },
};

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

// Sections that should be gray based on the image
export const graySections = new Set([
  'E', 'H', '103', '115', '116', '117', '118', '119', '120', '202', '210', '213', '214', '215'
]);
