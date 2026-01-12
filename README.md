# Event Ticketing Website Wireframe Prototype

A fully interactive wireframe prototype for an event ticketing platform built with Next.js, TypeScript, and Tailwind CSS. This prototype demonstrates the user flow for discovering events, selecting tickets, and managing purchases.

## Features

- **Home Page**: Discover events with real-time search functionality
- **Artist Detail Pages**: View artist information and upcoming events
- **Event Detail Pages**: See event information, top tickets, and add-ons
- **Interactive Ticket Selection**: Clickable seatmap with ticket list integration
- **Confirmation Page**: Purchase receipt with upgrade options
- **User Account**: Manage tickets, resale, transfers, and settings
- **Account Event Details**: View purchased tickets and add upgrades

## Tech Stack

- **Next.js 16+** (App Router) - React framework optimized for Vercel
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling with wireframe aesthetic
- **Mock Data** - Client-side data for prototyping

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the prototype.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
ui-visioning/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── artist/[id]/       # Artist detail pages
│   ├── event/[id]/        # Event detail & ticket selection
│   ├── confirmation/      # Purchase confirmation
│   └── account/           # User account pages
├── components/
│   ├── wireframe/         # Reusable wireframe components
│   └── layout/            # Layout components
├── lib/
│   ├── data/              # Mock data files
│   └── types.ts           # TypeScript interfaces
└── public/                # Static assets
```

## Pages

1. **Home** (`/`) - Event discovery and search
2. **Artist Detail** (`/artist/[id]`) - Artist information and events
3. **Event Detail** (`/event/[id]`) - Event information and top tickets
4. **Ticket Selection** (`/event/[id]/select`) - Interactive seatmap
5. **Confirmation** (`/confirmation`) - Purchase confirmation
6. **Account** (`/account`) - User tickets and settings
7. **Account Event** (`/account/event/[id]`) - Event details with upgrades

## Deployment to Vercel

This project is optimized for Vercel deployment with automatic preview deployments.

### Option 1: Deploy via Vercel Dashboard

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com) and sign in
3. Click "New Project" and import your repository
4. Vercel will auto-detect Next.js and configure build settings
5. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# For production
vercel --prod
```

### Preview Deployments

- Every push to any branch creates an automatic preview deployment
- Preview URLs are shareable with stakeholders
- Vercel bot comments on pull requests with preview links

### Production Build

The project uses Next.js static generation where possible:
- Artist and Event detail pages use `generateStaticParams` for pre-rendering
- Mock data is bundled at build time for optimal performance

## Wireframe Styling

The prototype uses a minimal wireframe aesthetic:
- Clean borders and boxes for visual hierarchy
- Limited color palette (grays with single accent)
- Clear spacing and layout structure
- Interactive elements with hover states

This design is intentionally minimal to allow for easy transition to high-fidelity designs in Figma.

## Future Enhancements

- Replace mock data with API integration
- Add authentication and user management
- Implement payment processing
- Add real-time seat availability updates
- Enhance with high-fidelity designs from Figma

## License

Private project for stakeholder demonstration.