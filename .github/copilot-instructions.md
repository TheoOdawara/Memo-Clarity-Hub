# GitHub Copilot Instructions

## Project Overview
MemoClarity MVP is a memory monitoring and cognitive health platform designed for middle-aged and elderly users. The goal is to reduce refund rates by 40% through increased engagement and perceived value.

**🇺🇸 IMPORTANT: ALL CONTENT MUST BE IN ENGLISH** 
This product will be sold in the United States market. All user-facing text, comments, variable names, and documentation must be in English only. No Portuguese, Spanish, or other languages should be used in the user interface or code.

## Visual Identity Guidelines

### Color Palette
The color palette has been carefully selected based on color psychology to evoke the right emotions: trust, hope, vitality, and renewal.

**Primary Color | Trust and Stability**
- Deep Teal Blue: `#0B4F6C`
- Usage: Main brand color. Ideal for titles, primary buttons, highlight areas, and logo body. Conveys seriousness, calm, intelligence, and the scientific foundation of treatment.

**Secondary Color | Hope and Optimism**
- Vibrant Gold: `#FCA311`
- Usage: Point of light and hope. Perfect for important icons, call-to-action (CTAs), and highlighting "clarity" elements in logo and website. Symbolizes sunrise and the energy of rediscovery.

**Accent Color | Warmth and Vitality**
- Soft Coral: `#FF6F61`
- Usage: To bring a touch of human warmth and care. Use moderately in interaction elements, testimonials, or areas that need a more personal and vibrant feeling.

**Stimulating Color | Renewal and Well-being**
- Soft Aqua Green: `#A7D9D3`
- Usage: Represents freshness, growth, and health. Great for section backgrounds, information cards, or elements that need to convey calm and renewal.

**Neutrals | Clarity and Readability**
- Soft White: `#F8F9FA`
- Usage: Main background color. More comfortable for eyes than pure white, ideal for older audiences and long reading sessions.
- Dark Gray (Text): `#212529`
- Usage: Body text color. Offers high contrast and excellent readability without the harshness of absolute black.

### Typography
Font combination chosen to be modern, highly readable, and with a human touch, ensuring accessibility and a pleasant reading experience.

**Heading Font: Poppins**
- Why: Clean, geometric font with rounded corners that makes it friendly and welcoming. Conveys professionalism without being cold. Great for menus, section titles, and any highlight text.
- Suggested weight: SemiBold or Bold for main titles, Regular for subtitles.

**Body Text Font: Nunito Sans**
- Why: One of the most readable fonts for screen. Its rounded endings give a soft and friendly sensation, making long paragraph reading a comfortable and effortless experience.
- Suggested weight: Regular for all body text.

### Implementation in Code
- Use Tailwind CSS custom colors: `text-teal-800`, `bg-amber-400`, `text-coral-500`, `bg-aqua-200`
- Import Google Fonts: Poppins (400, 600, 700) and Nunito Sans (400, 600)
- Ensure WCAG accessibility standards with color contrasts
- Maintain consistent spacing and typography scales

### Iconography & Card Layering Pattern
To ensure a consistent, premium visual language across dashboard cards, follow this layered icon pattern for feature cards (applies to the 6 main cards on the dashboard):

- Structure (static, no animated progress by default):
	- Outer frame (prominent): visible ring or border that uses a card-specific color (higher contrast). This outer frame should be the most noticeable part of the icon framing.
	- Outer glow tint: subtle background tint or glow using a semi-transparent version of the outer frame color.
	- Inner frame (neutral): thin secondary ring in a neutral tone (white/60) to create separation.
	- Soft inner fill: a small translucent fill behind the icon to add depth (e.g. white/10 or soft aqua/10).
	- Primary icon: monochrome vector icon (single color) centered inside the frames. Prefer stroke icons (lucide-react) with controlled strokeWidth.
	- Corner badge (optional): small rounded badge placed in the top-right to indicate an action/state (e.g., arrow for progress, star for highlight). Keep it minimal (14–18px icon) and high contrast.

- Sizes & spacing (recommended):
	- Frame container: 72–80px square (use 76px in Tailwind classes for consistency).
	- Primary icon size: 32–40px.
	- Corner badge size: 14–18px (placed at -top-1 -right-1 with small padding).

- Color mapping (suggested):
	- Go to Test Page: outer frame = teal/aqua (use `cyan/teal` tones). Corner badge: ArrowUpRight (progress cue).
	- Go to Raffle Page: outer frame = gold/amber (use `amber-300/400` hues). Corner badge: small star or gift highlight.
	- Highest Score: outer frame = teal (accent), inner icon = trophy (monochrome).
	- Tests Taken: outer frame = soft neutral (white/20 with yellow border), inner icon = checklist/paper.
	- Track: outer frame = yellow/orange (chart accent), inner icon = bar-chart/line.
	- Support: outer frame = teal-green, inner icon = life-buoy or chat bubble.

- Implementation notes:
	- Use `lucide-react` icons for consistency and accessibility. Prefer stroke icons and control strokeWidth.
	- Keep icons monochrome (single hue) to avoid visual noise; use the framed layers for color and emphasis.
	- Avoid adding animated progress arcs unless representing live progress. Use static arcs/rings only as decorative framing.
	- Ensure sufficient contrast between icon and background (WCAG AA minimum).


## Development Guidelines

### Language Requirements
- **ALL USER-FACING TEXT**: Must be in English (buttons, labels, messages, placeholders)
- **CODE COMMENTS**: Write in English only
- **VARIABLE NAMES**: Use English words and standard naming conventions
- **ERROR MESSAGES**: All error messages and validation text in English
- **DOCUMENTATION**: All docs, README files, and comments in English
- **CONSOLE LOGS**: Any debug messages should be in English (though should be removed before production)

### Code Style
- Use TypeScript for all new code
- Follow React best practices and hooks patterns
- Use Tailwind CSS for styling
- Implement component composition over inheritance
- Write self-documenting code with clear variable names
- **NO ANY TYPES**: Never use `any` type - use specific types, `unknown`, or proper interfaces
- **TYPE SAFETY**: All variables, functions, and props must be properly typed
- **STRICT TYPESCRIPT**: Enable strict mode and fix all type errors immediately
- **MOBILE FIRST**: Always design for mobile screens first, then adapt for desktop using breakpoints
- **CLEAN CODE**: Remove unused files, components, and imports regularly
- **ACCESSIBILITY**: Design for elderly users and those with cognitive challenges (larger buttons, simple navigation, clear text)

### Architecture Principles
- Component-based architecture with clear separation of concerns
- Custom hooks for business logic
- Context API for global state management
- Service layer for API integrations
- Utility functions for reusable logic
- **SIMPLIFIED UX**: No sidebar navigation - use card-based navigation for elderly users
- **LARGE TOUCH TARGETS**: Buttons and interactive elements must be large and easy to tap
- **CLEAR VISUAL HIERARCHY**: High contrast, large fonts, obvious call-to-action buttons

### Project Structure
```
src/
├── components/
│   ├── ui/           # Base components (shadcn/ui)
│   ├── layout/       # Layout components (SimpleLayout for accessibility)
│   └── features/     # Feature-specific components
├── pages/            # Page components
├── hooks/            # Custom hooks
├── services/         # API integrations (Supabase)
├── context/          # Context providers (AuthContext)
├── utils/            # Utility functions
├── types/            # TypeScript definitions
└── styles/           # Global styles

**DEPRECATED COMPONENTS TO REMOVE:**
- Complex sidebar layouts
- Small navigation elements
- Debug utilities after development
- Unused layout components
```

### Technology Stack
- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend:** Supabase (Auth, Database, Storage)
- **Routing:** React Router v6
- **State Management:** Context API + useState/useReducer
- **Testing:** Jest + React Testing Library

### Development Process
1. Follow the Sprint-based roadmap in docs/ROADMAP.md
2. Check docs/NEXT_STEPS.md for immediate tasks
3. Update documentation as features are implemented
4. Write tests for critical functionality
5. Ensure responsive design for all components
6. **MOBILE FIRST**: Test on mobile devices primarily, desktop is secondary
7. **CLEAN AS YOU GO**: Remove unused files, imports, and debug code immediately
8. **ACCESSIBILITY FIRST**: Consider elderly users in every design decision

### Terminal Commands
- Always use PowerShell syntax for terminal commands
- Use PowerShell-specific syntax: `;` for command chaining, `&&` alternatives
- Prefer PowerShell native commands when available
- Example: `cd path; npm install` instead of `cd path && npm install`

### Code Cleanup Guidelines
- **REMOVE IMMEDIATELY**: Debug files, test utilities, unused components after development
- **REGULAR CLEANUP**: Check for unused imports, variables, functions weekly
- **FILE ORGANIZATION**: Remove deprecated layout components when new ones are implemented
- **IMPORT CLEANUP**: Remove unused imports with each commit
- **CONSOLE LOGS**: Remove all console.log statements before production
- **COMMENT CLEANUP**: Remove TODO comments when tasks are completed
- **TYPE SAFETY**: Replace any `any` types with proper TypeScript types immediately
- **LINT COMPLIANCE**: Code must pass ESLint with zero errors and warnings

### User Experience Guidelines
- **TARGET AUDIENCE**: Middle-aged and elderly users, some with early-stage Alzheimer's
- **SIMPLICITY**: Minimize cognitive load - fewer options, clearer paths
- **LARGE UI ELEMENTS**: All buttons minimum 44px tap target, prefer 60px+
- **HIGH CONTRAST**: Use clear color differences for accessibility
- **CONSISTENT NAVIGATION**: Same navigation pattern across all pages
- **MINIMAL TEXT**: Use icons with labels, avoid lengthy explanations
- **ERROR PREVENTION**: Clear validation, helpful error messages
- **DEMO MODE**: Always provide demo/test functionality for easy onboarding
### Key Features to Implement
1. **Authentication System** - Supabase Auth integration with demo mode
2. **Daily Check-in** - Mood, sleep, energy tracking (simplified interface)
3. **Cognitive Games** - Memory tests and brain training (large buttons, clear instructions)
4. **Progress Dashboard** - Analytics and insights (visual, easy to understand)
5. **Gamification** - Badges, streaks, achievements (motivational, not overwhelming)
6. **Community Features** - Simulated social interactions (optional, simple)

### Code Quality Standards
- TypeScript strict mode enabled
- ESLint and Prettier configured
- Component props properly typed
- Error boundaries implemented
- Loading states for async operations
- Accessible UI components (WCAG guidelines)
- **NO ANY TYPES**: Forbidden to use `any` - use proper TypeScript types
- **TYPE DEFINITIONS**: Create specific interfaces and types for all data structures
- **NO UNUSED CODE**: Remove unused imports, components, files immediately
- **CLEAN BUILDS**: Zero warnings in production builds
- **MOBILE PERFORMANCE**: Optimize for mobile devices primarily

### Performance Considerations
- Lazy load routes and heavy components
- Optimize images and assets
- Implement proper caching strategies
- Use React.memo for expensive components
- Monitor bundle size and Core Web Vitals

### Security Guidelines
- Implement Row Level Security (RLS) in Supabase
- Validate all user inputs
- Use HTTPS for all communications
- Implement proper session management
- Follow OWASP security practices

### Testing Strategy
- Unit tests for utility functions and hooks
- Component tests for UI interactions
- Integration tests for user flows
- E2E tests for critical paths
- Performance testing for optimization

## Current Sprint Focus
Focus on Sprint 1: Foundation and Authentication
- Setup Vite + React + TypeScript project ✅
- Configure Tailwind CSS and development tools ✅
- Implement Supabase integration ✅
- Create authentication system with demo mode ✅
- Build simplified layout and navigation (no sidebar) ✅
- Ensure mobile-first responsive design ✅

## Important Decisions Made
- **NO SIDEBAR**: Card-based navigation only for simplicity
- **DEMO LOGIN**: Always provide demo mode for testing and onboarding
- **MOBILE FIRST**: Primary focus on mobile experience
- **ELDERLY-FRIENDLY**: Large buttons, simple navigation, high contrast
- **CLEAN CODE**: Remove debug utilities and unused code regularly
- **ENGLISH ONLY**: All content for US market
- **NO ANY TYPES**: Strict TypeScript typing without any
- **CONVENTIONAL COMMITS**: Clear, meaningful commit messages for better project history
- **VISUAL IDENTITY**: Follow MemoClarity color palette and typography guidelines consistently

## Communication Style
- Provide clear explanations for architectural decisions
- Ask for confirmation before major changes
- Suggest improvements and optimizations
- Focus on MVP scope and avoid feature creep
- Prioritize user experience and accessibility
