---
name: EMD - Environmental Weather Dashboard
description: Real-time environmental monitoring dashboard for hyper-local sensor data.
colors:
  primary: "#4e73df"
  brand-accent: "#284aa1"
  temperature-alert: "#d39e00"
  chart-success: "#1cc88a"
  chart-info: "#36b9cc"
  neutral-bg: "#f8f9fc"
  neutral-surface: "#ffffff"
  neutral-border: "#eaecf4"
  neutral-border-dark: "#cccccc"
  neutral-text: "#333333"
  neutral-text-muted: "#888888"
typography:
  body:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: "14px"
  xs: "12px"
  sm: "13px"
  md: "14px"
  lg: "16px"
  xl: "18px"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "20px"
  pill: "50px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  floating-header:
    backgroundColor: "{colors.brand-accent}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  station-dropdown:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.lg}"
    padding: "6px 35px 6px 16px"
---

# Design System: EMD - Environmental Weather Dashboard

## Overview

**Creative North Star: "The Command Center"**

Crisp, functional, and purely data-oriented. This application serves as a central command center for monitoring local sensor weather data without excessive ornaments or visual clutter. The design prioritizes viewport efficiency, featuring a visual hierarchy engineered so real-time figures can be identified at an instant glance.

**Key Characteristics:**
- **Fresh & Modern:** High contrast between light backgrounds and crisp blue accents provides a clean aesthetic.
- **Crisp and Softly Rounded:** Utilizes modern capsule (pill) silhouettes for navigation controls without sacrificing functional utility.
- **Utilitarian:** All shadows or borders serve strictly to delineate data zones rather than acting as mere decoration.

## Colors

The palette is dominated by clean white and light gray backgrounds complemented by vivid blue accents to ensure data metrics take center stage.

### Primary
- **Dashboard Blue** (#4e73df): Primary accent for interactive text, hover states, and secondary highlight elements.
- **Header Deep Blue** (#284aa1): Main background for the *Floating Header*, establishing strong focus at the top-center of the viewport.

### Secondary
- **Temperature Mustard** (#d39e00): Exclusively applied to temperature metrics to instantly distinguish temperature readings from other variables.

### Neutral
- **Background Wash** (#f8f9fc): Dominant background for the content body to soften visual fatigue on bright screens.
- **Card Surface** (#ffffff): Clean background for tables, dropdowns, and key weather cards.
- **Divider Gray** (#eaecf4): Subtle divider line separating statistics without disrupting legibility.
- **Primary Text** (#333333): Primary copy for dropdown controls and dense data displays.
- **Muted Text** (#888888): Applied to passive navigation elements and secondary metadata like dates.

## Typography

**Body Font:** system-ui, -apple-system, sans-serif

**Character:** Standard system stack, rapid to render, and effortlessly readable in number-dense dashboard environments.

### Hierarchy
- **Title** (18px, bold): EMD brand identity.
- **Body** (14px): Standard text information, footer navigation, and dropdown labels.
- **Label** (13px, bold, 600): Applied to time display and station badges to emphasize compact data entities.

## Layout

The application employs a centered container (`max-width: 1400px`) for comfortable reading. On desktop screens (>= 1200px), metric cards align in thirds (`33.333%`), whereas on mobile devices (< 768px), navigation collapses into an off-canvas sidebar drawer and the container utilizes nearly full screen width with top padding compensation for the Floating Header.

## Elevation & Depth

Subtle shadow layers separate global navigation and controls from data content surfaces.

### Shadow Vocabulary
- **Floating Controls** (`box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2)`): Distinct floating elevation reserved for the *Floating Header*, giving a hovering presence.
- **Table Sticky Header** (`box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.1)`): Minimal shadow delineating table headers when scrolling down data rows.
- **Mobile Sidebar** (`box-shadow: 4px 0 10px rgba(0,0,0,0.5)`): Strong depth shadow for the mobile off-canvas drawer.

## Shapes

Shapes feature a balance of fully rounded pills for control elements and soft-cornered rectangles for data cards.

- **Pill (50px / 20px):** Applied to the *Floating Header* and station dropdown for an approachable modern look.
- **Soft Border (4px):** Logo wrapper background for neat alignment.

## Components

### Floating Header
- **Shape:** Pill radius (50px).
- **Background:** Header Deep Blue (#284aa1) with subtle border (#333333).
- **Shadow:** Prominent floating shadow.
- **Behavior:** Fixed floating 20px below top of viewport.

### Station Dropdown
- **Shape:** Medium pill radius (20px).
- **Background:** Clean white (#ffffff) with border (#cccccc).
- **Behavior:** Features a pure CSS border caret and removes native browser arrow (`appearance: none`).

### Metric Cards
- **Border:** Metric divider (*Divider Gray*) on the right for desktop or on the bottom for mobile.

## Do's and Don'ts

### Do:
- **Do** preserve the 50px border-radius on the Floating Header across desktop and mobile for design consistency ("Crisp and Softly Rounded").
- **Do** render sensor metrics instantly without lengthy decorative animations that delay real-time access.

### Don't:
- **Don't** remove the contrast border on the Floating Header, preventing it from blending into scrolling content.
- **Don't** introduce competing primary colors. Reserve deep blue for navigation framing, standard blue for actions, and mustard for temperature indicators.
