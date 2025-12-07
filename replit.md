# Symmetri Growth Labs - Autonomous Revenue Engine

## Overview

Symmetri Growth Labs is a single-page marketing website for an autonomous Revenue OS platform that unifies ABM (Account-Based Marketing) and outbound sales operations. The application features a Deep Void Black (#050505) background with Ember-Gate chromatic design system, basalt panel surfaces, and a gamified Revenue Simulator. The page converts visitors through interactive simulations and employs a chaos→symmetry visual narrative arc where early sections feel fragmented/chaotic and later sections feel unified/orderly.

**Core Purpose**: Marketing site to demonstrate and sell a multi-agent AI revenue automation platform that combines GTM strategy, autonomous outreach, STEALTH™ phone coaching, and living data systems.

**Tech Stack**: React + TypeScript frontend with Express backend, utilizing shadcn/ui components, Tailwind CSS, and Drizzle ORM for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type safety
- Vite as the build tool and dev server
- Client-side routing via Wouter (lightweight React Router alternative)
- Single-page application (SPA) architecture

**Component System**
- shadcn/ui component library (Radix UI primitives + Tailwind styling)
- "New York" style variant with dark theme only
- Component library configured via `components.json` with path aliases (@/components, @/lib, etc.)
- Custom landing page components in `client/src/components/landing/`

**Styling Approach - Ember-Gate Chromatic System**
- Tailwind CSS with custom design tokens for Symmetri brand
- Deep Void Black background (#050505) with Ember-Gate gradient accents:
  - Primary Ember: #FF8C00 (warm amber)
  - Secondary Ember: #E65C00 (deep ember)
  - Gradient range: #FFA500 → #FF6B00 → #E64A00

**Key CSS Utilities (in index.css)**
- `.symmetri-badge` - Solid orange gradient badge (#FF8C00 → #E65C00), white text, white dot indicator
- `.text-ember-gradient` - Orange gradient text for psychologically-charged headline words
- `.basalt-panel` - Clean dark surface (#0a0a0a) with subtle border (rgba(255,255,255,0.08))
- `.ember-edge-glow` - Subtle orange glow effect at card edges

**Psychological Gradient Text Strategy**
Words chosen for subconscious urgency/power in section headings:
- "Agentic Playbooks" - AI Paradox section (new paradigm)
- "GTM Collapse" - GTM section (fear/urgency)
- "Command Nexus" - Revenue OS section (power/control)
- "Strike Chain" - Strike Chain section (action/precision)
- "Revenue Swarm" - Multi-Agent Pipeline section (collective power)
- "STEALTH™" - Voice AI section (intrigue/exclusivity)

**Visual System**
- Basalt panels replaced glassmorphism across all sections
- No backdrop-blur effects (clean, high-contrast design)
- CSS custom properties for theme variables (HSL color system)
- Responsive design with mobile-first breakpoints
- Scroll-triggered animations and slot-machine number effects
- SVG-based signal visualizations with gradient lines and pulsing cores
- Holodeck grid backgrounds with subtle lines

**Chaos→Symmetry Visual Progression**
The landing page employs a narrative arc from visual chaos to visual symmetry:
- **AI Paradox Section (Chaos Stage 1)**: Fragmented grid patterns at 17°, 107° angles with irregular sizes (47px, 53px, 71px), red-tinted scattered particles
- **GTM Collapse Section (Peak Chaos)**: More aggressive patterns at 165°, 195° angles with decaying red gradient overlay
- **Revenue OS Section (Symmetry Achievement)**: Unified holodeck grid with Symmetri Continuum 4D visualization as centerpiece
- **CTA Section (Full Symmetry)**: Perfectly aligned 60px grid with concentric circles radiating from center
- All background patterns maintain opacity ≤3% to not distract from content

**Symmetri Continuum 4D Visualization**
Located in `client/src/components/landing/SymmetriContinuum.tsx`:
- Volumetric 3D torus rendered via SVG with multiple depth layers
- 48 particles flowing along torus orbits with varied speeds and sizes
- Depth-parallax effects responding to mouse movement
- Telemetry pulse beats with expanding rings and core pulsing
- Respects `prefers-reduced-motion` for accessibility
- Uses visibility-based animation to prevent CPU churn when off-screen

**State Management & Data Fetching**
- TanStack Query (React Query) for server state management
- Custom query client configuration in `client/src/lib/queryClient.ts`
- Form handling with React Hook Form and Zod validation via @hookform/resolvers
- No global state management library (component-local state only)

**Animation & Interactions**
- Scroll-triggered animations using IntersectionObserver API
- Custom hooks: `useScrollAnimation` and `useCountUp` for performance
- Respects `prefers-reduced-motion` user preference
- Parallax effects and ambient visual elements (signal orbs, grid backgrounds)
- No heavy animation frameworks (performance-first approach)

### Backend Architecture

**Server Framework**
- Express.js with TypeScript
- HTTP server creation via Node's native `http` module
- Middleware: JSON body parsing, URL-encoded form data, CORS-ready

**API Structure**
- RESTful endpoints defined in `server/routes.ts`
- Demo request submission (`/api/demo-request`)
- Revenue Simulator endpoint (`/api/simulate-revenue`) - calculates projected revenue based on TAM (ICP company count), deal value, and team size
- Blueprint download endpoint (`/api/blueprint-download`) - captures email leads for simulation results
- ROI calculator endpoint (`/api/roi-calculate`)
- Voice AI endpoints:
  - `/api/voice-chat` - Chat with GPT-5 voice coach, includes TTS audio generation
  - `/api/transcribe` - Audio transcription (demo mode placeholder)
  - System prompt with Symmetri methodology knowledge for sales coaching
  - Graceful demo fallback with scripted responses when OPENAI_API_KEY not set
- Request/response logging middleware for debugging

**Data Layer**
- In-memory storage implementation (`MemStorage` class in `server/storage.ts`)
- Interface-based storage pattern (`IStorage`) for future database swapping
- Demo requests stored with UUID identifiers and timestamps
- Currently no database connection (prepared for Drizzle + PostgreSQL via Neon)

**Static File Serving**
- Production: Serves built Vite bundle from `dist/public`
- Development: Vite dev server with HMR via `server/vite.ts`
- Fallback to `index.html` for client-side routing

**Build Process**
- Custom build script (`script/build.ts`) using esbuild for server bundling
- Server dependencies allowlist for bundling (reduces cold start syscalls)
- Separate Vite build for client assets
- Output: Single `dist/index.cjs` for server, `dist/public/` for client

### Data Storage Solutions

**Current Implementation**
- In-memory Map-based storage (non-persistent)
- Stores demo requests with full audit trail (id, createdAt)
- Suitable for development and MVP phase

**Prepared Architecture**
- Drizzle ORM configured via `drizzle.config.ts`
- PostgreSQL dialect with Neon serverless driver (`@neondatabase/serverless`)
- Schema defined in `shared/schema.ts` with Zod validation schemas
- Migration system ready (`npm run db:push`)
- Shared types between client and server via `@shared` path alias

**Schema Design**
- `demoRequestSchema`: Name, email, company, optional team size and message
- `scriptScanSchema`: Script input validation for STEALTH™ analyzer
- `roiCalculatorSchema`: Team size, salary, hours per week inputs
- Type-safe DTOs using Zod inference

### Authentication & Authorization

**Current State**: No authentication implemented (marketing site, public access)

**Prepared for Future**
- Session management dependencies installed (express-session, connect-pg-simple)
- Passport.js for authentication strategies
- User schema stub exists in `shared/schema.ts`

### External Dependencies

**Third-Party Services**
- **Neon Database**: Serverless PostgreSQL (prepared, not yet connected)
- **Google Fonts**: Inter, Space Grotesk, JetBrains Mono for typography
- **Replit-specific**: Development tools (@replit/vite-plugin-cartographer, runtime error modal)

**Key NPM Packages**
- **UI Components**: @radix-ui/* primitives (accordion, dialog, dropdown, etc.)
- **Forms**: react-hook-form, @hookform/resolvers, zod, zod-validation-error
- **Data Fetching**: @tanstack/react-query
- **ORM**: drizzle-orm, drizzle-zod
- **Utilities**: clsx, class-variance-authority, date-fns, nanoid, uuid

**Development Tools**
- TypeScript compiler with strict mode
- ESModules throughout (package.json "type": "module")
- Path aliases configured in tsconfig.json and vite.config.ts
- PostCSS with Tailwind and Autoprefixer

### Design System Integration

**Brand Guidelines** (`design_guidelines.md`)
- Chaos → Symmetry visual motif
- Holodeck grid background with parallax
- Signal orbs and ambient scanning effects
- Modern SaaS aesthetic inspired by Linear, Stripe, Vercel
- Typography hierarchy: Gabriel Sans, Neue Montreal, supporting fonts

**Implementation**
- Custom CSS variables in `client/src/index.css`
- Tailwind configuration extends with brand colors
- Component variants follow consistent elevation/shadow patterns
- Scroll animations choreographed with staggered delays

### Performance Optimizations

- Tree-shakeable component imports
- Server bundle allowlist to reduce file system calls
- Lazy loading via dynamic imports (dev banner, cartographer)
- CSS custom properties for runtime theme switching capability
- Minimal JavaScript animation (CSS transforms + IntersectionObserver)