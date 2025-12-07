# Symmetri Growth Labs - Design Guidelines

## Design Approach
Reference-Based: Modern SaaS/Tech aesthetic drawing from Linear, Stripe, and Vercel with a bold, maverick edge. Dark, futuristic "holodeck" theme with chaos-to-symmetry visual motif.

## Core Visual System

### Typography
- **Primary**: Gabriel Sans (Bold/Normal) - Headlines and key messaging
- **Secondary**: Neue Montreal (Bold) - Subheadings
- **Accent**: Nourd, Gordita, Raleway - Supporting text and variety
- Hierarchy: Bold headlines (48-72px desktop), subheads (24-32px), body (16-18px)

### Color Palette
- **Background**: Carbon black (#000000)
- **Primary Accents**: Vivid orange (#ff7a1a), Cyan/teal (#38e8ff), Warm yellow (#ffc84d)
- **Brand Reds**: #E91E1A, #F4002A, #E87105, #F89F05, #FFBA00
- **Neutrals**: #504F4C (charcoal), #999797, #CDC7C7, #FFFFFF
- Use warm accent colors against dark backgrounds for high contrast and impact

### Layout System
- **Spacing**: Tailwind units of 4, 8, 12, 16, 20, 24, 32 (p-4, py-8, gap-12, etc.)
- **Containers**: max-w-7xl for full sections, max-w-6xl for content-focused areas
- **Grid**: Subtle 3D grid background with parallax drift effect
- **Responsive**: Desktop-first with tablet (md:) and mobile breakpoints

## Visual Motifs & Effects

### Chaos → Symmetry Theme
- Left-side elements: Noisy particles, scattered signals, chaotic motion
- Right-side elements: Ordered nodes, clean UI cards, structured diagrams
- Creates visual narrative of transformation

### Ambient Elements
- 3D holodeck grid floor fading into darkness
- Floating "signal orbs" that pulse and drift subtly
- Scanning light cones emanating from key diagrams
- Thin connecting lines with animated data packets

### Animation Principles
- Scroll-triggered (IntersectionObserver)
- Fade-up/slide-in with staggered delays (100-200ms between elements)
- Gentle parallax on background grid (slow drift)
- Hover states: soft glow, scale(1.05), subtle shadow expansion
- Respect prefers-reduced-motion
- Performance-first: no heavy frameworks

## Component Library

### Buttons
- **Primary CTA**: Solid orange background, white text, 16px padding, rounded corners
- **Secondary CTA**: Dark outline (2px), white/orange text
- **Hover**: Soft glow effect, slight scale-up
- On images: Blurred background (backdrop-blur-md), no special hover interactions

### Cards
- Dark charcoal (#504F4C) with subtle borders
- 16-24px padding, rounded corners (8-12px)
- Hover: Soft glow, slight elevation increase
- Include small icons, titles, and 2-3 line descriptions

### Terminal/Tech UI
- Monospace font for code/terminal sections
- Green/cyan text on dark background
- Animated typing effects for live data display
- Border glow effects on active states

### Diagrams
- Circular center node with orbiting module cards
- Connecting lines with animated "data packets" (small dots traveling along paths)
- On hover: Individual modules glow and reveal micro-labels
- Reusable across multiple sections

## Section-Specific Guidelines

### Hero (Section 1)
- Two-column layout: Left (copy + CTAs), Right (animated OS diagram)
- Badge above headline in small muted text
- Two-line headline mixing white and orange
- Two primary buttons side-by-side
- Background: 3D grid with scanning light cone

### Stats & Data Displays
- Large numbers (64-96px) in white/orange
- Small captions below in muted gray
- 2×2 grid layouts for stat cards
- Animated counters on scroll into view

### Timeline (Section 4)
- Vertical or diagonal flow with 7 steps
- Alternating left/right cards
- Glowing signal traveling along spine
- Sequential card animations on scroll
- Each step: icon + title + one-sentence description

### Strike Chain (Section 5)
- Three horizontally aligned cards
- Glowing sequence animation (1→2→3)
- Connecting line with moving dots
- Terminal-style log window showing processing states

### Interactive Elements
- Calculator with form inputs and dynamic results
- Terminal interface with "Scan Script" functionality
- Hover-revealed micro-labels on diagrams

## Images
- **Hero**: No large hero image - use animated OS diagram instead
- **Supporting**: Optional product screenshots within cards showing UI examples
- **Icons**: Use for module cards (data core, agents, calling, strategy icons)

## Responsive Behavior
- Desktop: Full multi-column layouts, side-by-side hero
- Tablet (md:): 2-column max, stacked hero components
- Mobile: Single column, condensed spacing, simplified animations

## Critical Mandates
- Every section must feel complete and purposeful
- No sparse layouts - enrich with supporting elements
- Scroll-triggered animations create rhythm and engagement
- Dark aesthetic with high-contrast accent colors
- Chaos-to-symmetry visual narrative throughout
- Terminal/tech UI elements reinforce "OS" positioning