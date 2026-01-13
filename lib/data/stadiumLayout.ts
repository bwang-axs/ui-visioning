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

// Stadium section positions (x, y coordinates for centering)
export const stadiumSectionPositions: Record<string, { x: number; y: number }> = {
  // Stage
  STAGE: { x: 70, y: 50 }, // Right side, center

  // Floor sections (A-J) - in front of stage
  'A': { x: 65, y: 60 },
  'B': { x: 65, y: 55 },
  'C': { x: 65, y: 50 },
  'D': { x: 58, y: 60 },
  'E': { x: 58, y: 55 },
  'F': { x: 58, y: 50 },
  'G': { x: 50, y: 60 },
  'H': { x: 50, y: 55 },
  'J': { x: 50, y: 50 },

  // 100-level sections (101-122) - inner ring
  '101': { x: 45, y: 35 },
  '102': { x: 50, y: 35 },
  '103': { x: 60, y: 40 },
  '104': { x: 65, y: 40 },
  '105': { x: 70, y: 45 },
  '106': { x: 72, y: 50 },
  '107': { x: 72, y: 55 },
  '108': { x: 72, y: 60 },
  '109': { x: 70, y: 65 },
  '110': { x: 68, y: 68 },
  '111': { x: 65, y: 70 },
  '112': { x: 60, y: 70 },
  '113': { x: 55, y: 70 },
  '114': { x: 50, y: 68 },
  '115': { x: 45, y: 65 },
  '116': { x: 42, y: 60 },
  '117': { x: 40, y: 55 },
  '118': { x: 40, y: 50 },
  '119': { x: 40, y: 45 },
  '120': { x: 42, y: 40 },
  '121': { x: 45, y: 38 },
  '122': { x: 48, y: 36 },

  // 200-level Mezzanine Upper
  '201': { x: 48, y: 25 },
  '202': { x: 52, y: 25 },
  '203': { x: 56, y: 28 },
  '204': { x: 60, y: 30 },
  '227': { x: 40, y: 25 },
  '228': { x: 42, y: 23 },
  '229': { x: 44, y: 22 },
  '230': { x: 46, y: 22 },

  // 200-level Mezzanine Lower
  '212': { x: 45, y: 75 },
  '213': { x: 48, y: 77 },
  '214': { x: 50, y: 78 },
  '215': { x: 52, y: 78 },
  '216': { x: 55, y: 77 },
  '217': { x: 58, y: 75 },
  '218': { x: 60, y: 72 },
  '219': { x: 62, y: 70 },

  // 200-level Side sections
  '205': { x: 68, y: 28 },
  '206': { x: 70, y: 30 },
  '207': { x: 72, y: 32 },
  '208': { x: 73, y: 35 },
  '209': { x: 74, y: 40 },
  '210': { x: 74, y: 45 },
  '211': { x: 74, y: 50 },
  '220': { x: 38, y: 60 },
  '221': { x: 36, y: 55 },
  '222': { x: 35, y: 50 },
  '223': { x: 35, y: 45 },
  '224': { x: 36, y: 40 },
  '225': { x: 38, y: 35 },
  '226': { x: 40, y: 30 },
};

