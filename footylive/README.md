# FOOTYLive — Football Streaming Platform & World Cup 2026 Experience

A unified, single-page football platform combining DAZN's broadcast design system (`#0d0e12` dark background, `#00ff88` pitch neon green accents) with the **"World Cup 2026" Daylight Stadium** section (`#F7F9FB` light background, `#0055FF` electric blue primary, `#FF3D00` energetic orange accents). Built with **Next.js 16**, **Tailwind CSS v4**, **TypeScript**, **Lucide Icons**, and **Framer Motion**.

---

## ⚡ Quick Start

From the project root:
```bash
# Run from workspace root
npm run dev

# Or directly from the footylive directory
cd footylive
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🌟 What's Included on the Page

### 1. 🎭 Page-Load Curtain Splash (`PageLoadCurtain.tsx`)
- **Full-Screen Fixed Overlay**: High z-index (`z-[99999]`) covering the viewport in daylight off-white (`#F7F9FB`).
- **Centered Brand Typography**: `FOOTYLive` sized `~15vw` in bold condensed display font in brand blue (`#0055FF`).
- **2.5s "Pulse" Entrance Animation**:
  - `0%` ➔ opacity 0, scale 0.85, letter-spacing -4px
  - `60%` ➔ opacity 1, scale 1.02, letter-spacing +2px
  - `100%` ➔ opacity 1, scale 1, letter-spacing 0
  - easing: `ease`, fill: `forwards`
- **Fade Out & Pointer-Events Release**:
  - After `~900ms`, the overlay smoothly fades out (opacity ➔ 0) over `700ms` with ease-out.
  - Automatically transitions to `pointer-events-none` so it no longer blocks any interactions.
- **Accessibility & Motion Preferences**: Fully respects `prefers-reduced-motion` with instant display and zero motion.
- **Interactive Replay Button**: Floating pill button on the bottom right allowing you to re-trigger the splash curtain anytime!

### 2. ✨ Interactive Particle Burst Engine (`ParticleBurst.tsx`)
- Every click on the page fires a celebratory particle explosion (blue `#0055FF`, orange `#FF3D00`, white, gold `#FFD700`) with realistic gravity and rotation curves.

### 3. 🏟️ World Cup 2026 Daylight Experience (`WorldCupSection.tsx`)
- Built directly into the page with the "Daylight Stadium" design system:
  - Off-white background (`#F7F9FB`), electric blue primary (`#0055FF`), orange accent (`#FF3D00`), and dark ink text (`#0A1128`).
  - Faint pitch background texture with SVG center circle and halfway lines.
  - Live ticking countdown to the Opening Match at Estadio Azteca (June 11, 2026).
  - 16 Host Venues with 3D Tilt interactive cards (`TiltCard.tsx`) filterable by host nation (USA, Mexico, Canada) with capacity specs.
  - 12 Official Groups (Groups A to L) with 48 nations, seeded pots, and key star players.

### 4. 📺 DAZN Dark-Themed Live Broadcast Hub
- **Top Live-Score Ticker**: Real-time score ticker across top leagues with flashing match minutes, score changes, and click-to-stream functionality.
- **Hero Video Player Container**:
  - Simulated high-intensity pitch radar animation and stadium floodlights.
  - Live scorebug overlay with elapsed minutes and extra time indicator.
  - DVR live seekbar with clickable event markers (⚽ goals, 🟨 bookings).
  - Multi-Angle Camera Switcher: Tactical Cam 1, Bellingham ISO, 4K Goal-line, Manager Cam.
  - Commentary Audio Track Switcher (Peter Drury, Fernando Palomo, Canal+, Dolby 5.1 Ambience).
  - Resolution selector: 4K HDR 60fps, 1080p60, 720p, Data Saver.
  - **Match Center Drawer**: Real-time possession and xG analytics, visual tactical pitch lineups (4-3-1-2 vs 4-1-4-1), timeline event log, and live fan chat with floating emoji reactions.
- **Filterable Carousels**:
  - 'Live Matches' with active viewer counts and 4K tags.
  - 'Upcoming' with countdowns and "Remind Me" alert notifications.
  - 'Tournament Bracket' with knockout progression (R16 ➔ QF ➔ SF ➔ Final).
  - 'Highlights & VOD' with 15-min extended replays, goals, and viral moments.
- **Worldwide Football Tournaments Directory**:
  - Comprehensive catalog of leagues and cups across UEFA, CONMEBOL, FIFA, CONCACAF, AFC, and CAF.
  - Dedicated League Table & Standings modal with form badges and Golden Boot leaderboards.
