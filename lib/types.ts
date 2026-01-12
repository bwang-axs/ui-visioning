// TypeScript interfaces for the wireframe prototype

export interface Venue {
  name: string;
  address: string;
}

export interface Seat {
  seat: string;
  available: boolean;
  price: number;
}

export interface SeatRow {
  row: string;
  seats: Seat[];
}

export interface SeatSection {
  id: string;
  name: string;
  price: number;
  rows: SeatRow[];
}

export interface Event {
  id: string;
  title: string;
  artistId: string;
  date: string;
  venue: Venue;
  description: string;
  image?: string;
  sections: SeatSection[];
  category?: string;
}

export interface Artist {
  id: string;
  name: string;
  bio: string;
  image?: string;
  eventIds: string[];
}

export interface Ticket {
  id: string;
  eventId: string;
  section: string;
  row: string;
  seat: string;
  price: number;
  available: boolean;
  seatmapX?: number;
  seatmapY?: number;
}

export interface Purchase {
  id: string;
  userId: string;
  eventId: string;
  ticketIds: string[];
  purchaseDate: string;
  price: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  purchases: Purchase[];
}
