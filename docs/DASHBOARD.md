# Dashboard Patterns

This document summarizes the visual and interaction patterns used on the Professional Dashboard.

## SeriousCard
- Purpose: information-focused cards for administrative, tracking, or support actions.
- Structure: left accent stripe, icon container (layered frame), title, optional subtitle, optional details.
- Styling: neutral background (`bg-white/95`), subtle border, small uplift on hover, backdrop blur.
- Behavior: click navigates to detail pages; mobile-first layout (stacked).

## Icon Layering
- Glow tint (soft) -> Outer frame -> Inner frame -> Soft fill -> Monochrome icon.
- Constrain animations inside the icon container using `overflow-hidden`.

## Animations
- `ringPulse` keyframes used for internal icon ring pulses.
- Keep motion subtle and confined.

## Accessibility
- Buttons use `aria-label` where necessary, maintain focus rings and keyboard tap target sizes.

## File References
- `src/pages/ProfessionalDashboard.tsx` — main implementation and examples.
- `src/App.css` — contains `ringPulse` keyframes and helper classes.

## Run & QA
- Start dev server: `npm run dev` and verify cards at multiple breakpoints.
- Check animations are confined and there is no horizontal overflow.

