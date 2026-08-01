# FitBee Design Theme — Premium Minimal

## Philosophy
Elegant, calm, spacious, premium. Inspired by Apple HIG and Material 3 but uniquely FitBee.
Prioritize whitespace, consistency, rounded corners, subtle shadows, restrained colors, and polished micro-animations.

## Color Palette

| Token                | Hex       | Usage                          |
|----------------------|-----------|--------------------------------|
| Background           | #FAFAF8   | Page background (warm off-white) |
| Card Background      | #FFFFFF   | Cards, modals, dialogs         |
| Primary Accent       | #5C8D89   | Buttons, links, focus rings    |
| Primary Accent Hover | #4A7A76   | Button hover states            |
| Secondary Accent     | #89B0AE   | Secondary elements, tags       |
| Primary Text         | #1F2937   | Headings, body text            |
| Secondary Text       | #6B7280   | Labels, captions, placeholders |
| Tertiary Text        | #9CA3AF   | Hints, disabled text           |
| Error                | #C96A6A   | Validation errors              |
| Success              | #5E9F76   | Success messages, checkmarks   |
| Divider              | #E8E8E6   | Borders, separators            |
| Input Border         | #E5E7EB   | Field borders (default)        |
| Focus Glow           | rgba(92,141,137,0.15) | Focus ring outer glow |
| Card Shadow          | 0 8px 32px rgba(0,0,0,0.05) | Card elevation    |
| Button Shadow        | 0 6px 20px rgba(0,0,0,0.06) | Button elevation  |

## Typography
- Font: 'Inter', system-ui, -apple-system, sans-serif
- Headings: 600-700 weight
- Body: 400-500 weight
- Line height: 1.5-1.6

## Spacing & Sizing
- Card max-width: 440px
- Card border-radius: 24px
- Button height: 54px
- Button border-radius: 18px
- Input height: 54px
- Input border-radius: 16px
- Generous padding throughout (24-40px)

## General Design Rules
- Large rounded corners on all interactive elements.
- Soft shadows with low opacity (0.03–0.08).
- Large spacing — never feel cramped.
- Responsive on Desktop and Mobile.
- Beautiful typography using Inter font family.
- Large touch targets (minimum 44px).
- Consistent spacing rhythm throughout the application.
- Smooth 180-220ms animations using `cubic-bezier(0.4, 0, 0.2, 1)`.
- Buttons scale slightly when pressed (`scale(0.97)`).
- Buttons slightly elevate on hover (`translateY(-2px)` + shadow increase).
- Ripple animation on primary action buttons.
- Text fields softly glow when focused (4px focus ring with `rgba(92,141,137,0.15)`).
- Cards animate smoothly when selected (border color + subtle scale + shadow transition).
- Navigation between screens fades and slides smoothly.

## Onboarding-Specific Design
- One question per screen — conversational, never overwhelming.
- Warm off-white (#FAFAF8) background throughout the flow.
- Centered card (max 440px) with 24px border-radius.
- Progress bar (thin, rounded, accent-colored) at the top of each screen.
- Smooth slide + fade transitions between screens (350ms, ease-out).
- Wheel picker: scroll-snap center alignment, 5 visible items, highlighted center row with accent color, fade-out top/bottom with gradient masks.
- Selection cards: 1.5px border, 20px radius, transition to accent border + subtle accent background on selection.
- Equipment chips: rounded pill shapes, multi-select with check icon on selection.
- Follow-up questions animate in below equipment list (slide-down + fade-in).
- Toast notification on entry: slides up, fades in, auto-dismisses after 2.5s.
- Skip button: top-right, ghost style, subtle.

## Animations
- Duration: 180-220ms (micro), 350ms (transitions), 500ms (card entrance)
- Easing: cubic-bezier(0.4, 0, 0.2, 1) for standard, cubic-bezier(0.16, 1, 0.3, 1) for entrances
- Button hover: translateY(-2px) + shadow increase
- Button press: scale(0.97) + shadow decrease
- Field focus: border color + outer glow
- Page transitions: fade + slide
- Snackbar: slide-up + fade
- Card selection: border color + background tint (200ms)
- Wheel picker: momentum scroll with CSS scroll-snap

## Accessibility
- Strong color contrast (WCAG AA minimum)
- Visible focus states on all interactive elements
- Keyboard navigation support
- Responsive: mobile, tablet, desktop
- All form inputs have associated labels
- Touch targets minimum 44x44px
