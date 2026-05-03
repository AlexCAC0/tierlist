# Project Memory: Tierlist Mundial 2026

## Project Overview
Interactive web application for the FIFA World Cup 2026.
Features:
- **Jersey Tier List:** Categorize national team jerseys (Home, Away, Third) into ranks.
- **Tournament Simulator:** Predict group stages and knockout rounds (from R32 to Grand Final).
- **Gallery:** High-quality kit discovery with team-specific views.

## Core Mandates
- **Aesthetic:** Unique "Digital Stadium" & "Broadcast Ticket" style. Use of scanlines, industrial textures (carbon fiber), and cinematic lighting (WC Blue/Red glows).
- **Branding:** Fan-made application. No "Official" labels allowed. Original design by Alex.G; image credits to planetafobal.com.
- **UX:** Fullscreen Presentation Mode for clean screenshots (Capture Mode).
- **Data Consistency:** Team names must be normalized (e.g., "México", "Corea del Sur") to match image assets.

## Technical Stack
- **Framework:** React 19 (TypeScript)
- **Styling:** Tailwind CSS v4
- **Drag & Drop:** @dnd-kit
- **Icons:** lucide-react (using `Maximize2` for consistency)
- **Utilities:** html2canvas (legacy export), Fullscreen API (current capture method)

## Architecture & Conventions
- **State Management:** Local storage for saving tournament predictions (`wc2026_rankings`, `wc2026_thirds`).
- **Layout:**
  - **Knockout Bracket:** Dual-sided layout (Sector Alpha & Sector Omega) with a central "Monolith" for the Grand Final.
  - **Centering:** "Safe center" alignment in fullscreen mode to prevent clipping on small viewports.
- **Assets:**
  - `public/Assets/Escudos/`: Team crests (lowercase normalized filenames).
  - `public/Assets/Camisetas Individuales/`: Individual Home/Away/Third kits.

## Recent Improvements
- **Simulator Overhaul:** Expanded bracket width (min-w-max logic) to prevent right-side clipping.
- **Epic Winner UI:** Restored high-impact celebration with golden stars, confetti particles, and 10rem typography.
- **Fullscreen API:** Implemented native browser fullscreen for TierList and Simulator to solve capture issues.
- **Data Normalization:** Automated group mapping for kits and fixed name inconsistencies across the app.
- **UI Polish:** Removed intrusive animations and scrollbars in capture mode for professional-looking screenshots.
