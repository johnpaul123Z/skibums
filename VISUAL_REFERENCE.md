# 🎨 Visual Component Reference

A visual guide to every component in the SkiJobs application.

---

## 🏔️ Hero Section

### SnowHero Component
**Location**: `components/Hero/SnowHero.tsx`

**Visual Description**:
```
┌─────────────────────────────────────────────────────┐
│  [Weather Widget]                          ❄️ ❄️ ❄️  │
│                                                ❄️     │
│              ❄️                                       │
│                                                       │
│                    ❄️                                 │
│               [Snowflake Icon]                        │
│                                              ❄️       │
│            Find Your PEAK                             │
│       Dream jobs at ski resorts              ❄️       │
│                                                       │
│   ┌───────────────────────────────────────────┐      │
│   │ 🗺️  Search resorts, roles...   [Search] │      │
│   └───────────────────────────────────────────┘      │
│                                                       │
│   [Instructor] [Lift Op] [Hospitality] [Patrol]      │
│                                                       │
│                                                       │
│  1,234 Jobs    89 Resorts    5,678 Hired             │
└─────────────────────────────────────────────────────┘
```

**Key Features**:
- 80 animated snowflakes (white dots, varying sizes)
- Gradient title: "Find Your" (white) + "Peak" (cyan→purple gradient)
- Glassmorphism search bar with gradient border
- 4 quick filter buttons with glass effect
- Stats at bottom with gradient numbers

**Colors**:
- Background: Dark gradient (slate-900 → slate-800 → slate-900)
- Snowflakes: White with 30% opacity
- Title: White + cyan-to-purple gradient
- Search bar: Glassmorphism with cyan-to-blue border

---

### WeatherWidget Component
**Location**: `components/Hero/WeatherWidget.tsx`

**Visual Description**:
```
┌──────────────────────────┐
│ Alpine Peak Resort    ☁️❄️ │
│ 28°F                      │
│                           │
│ ❄️ 42" base  [Snowing]  │
└──────────────────────────┘
```

**Key Features**:
- Glassmorphism rounded card
- Temperature in large font
- Weather icon (changes based on condition)
- Snow depth with snowflake icon
- Condition badge (animated for "Powder Day")

**States**:
- Clear: ☀️ Sun icon
- Snowing: ☁️❄️ Cloud snow icon
- Cloudy: ☁️ Cloud icon
- Powder Day: ❄️ Snowflake (rotating animation)

---

## 💼 Jobs Section

### JobCard3D Component
**Location**: `components/Jobs/JobCard3D.tsx`

**Visual Description**:
```
┌────────────────────────────────┐
│  [FEATURED]            [♡]     │
│                                │
│    [Resort Photo]              │
│    with parallax effect        │
│                                │
├────────────────────────────────┤
│ Ski Instructor          ◆◆     │
│ Aspen Snowmass                 │
│                                │
│ 🗺️  Aspen, Colorado           │
│ 💵  $45k - $65k                │
│ ⏰  Full-time Seasonal         │
│                                │
│ [Seasonal] [Housing Available] │
│                                │
│ [💼 Quick Apply]  [Details]   │
└────────────────────────────────┘
```

**Key Features**:
- 3D tilt effect following mouse
- Parallax background image
- Featured badge (gradient orange)
- Favorite button (heart icon)
- Diamond difficulty rating (◆, ◆◆, or ◆◆◆)
- Glassmorphism content area
- Slide-out details on hover
- Gradient "Quick Apply" button

**Interactions**:
1. **Mouse Move**: Card tilts in 3D
2. **Hover**: Scales up, reveals extra tags
3. **Favorite Click**: Heart fills, snowflake burst animation
4. **Background**: Moves with parallax effect

**Colors**:
- Featured badge: Amber-to-orange gradient
- Difficulty symbols:
  - ◆ = Green (entry level)
  - ◆◆ = Blue (intermediate)
  - ◆◆◆ = Black (expert)
- Card background: Dark glassmorphism
- Button: Cyan-to-blue gradient

---

### TrailFilter Component
**Location**: `components/Jobs/TrailFilter.tsx`

**Visual Description**:
```
┌────────────────────────────────────────────────────────┐
│ 🔍  [All Levels ◆◆◆] [Entry ◆] [Intermediate ◆◆] [Expert ◆◆◆] │
└────────────────────────────────────────────────────────┘
```

**Key Features**:
- Glassmorphism container
- 4 filter buttons
- Active state: Gradient background
- Inactive state: Semi-transparent background
- Color-coded diamond symbols

**States**:
- **All Levels**: Gray diamonds
- **Entry Level**: Green diamond
- **Intermediate**: Blue diamonds
- **Expert**: Black diamonds

---

## 🎨 UI Components

### GlassCard Component
**Location**: `components/UI/GlassCard.tsx`

**Visual Description**:
```
┌─────────────────────────┐
│ Translucent background  │
│ with blur effect        │
│                         │
│ Content goes here       │
└─────────────────────────┘
```

**Key Features**:
- Semi-transparent background
- Backdrop blur (10px)
- Subtle border
- Hover: Scales up slightly
- Shadow: Large, soft

**CSS**:
```css
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.2);
```

---

### MountainButton Component
**Location**: `components/UI/MountainButton.tsx`

**Visual Variants**:

**Primary** (Cyan-to-blue gradient):
```
┌──────────────┐
│  Button Text │  ← Cyan to blue gradient
└──────────────┘
```

**Secondary** (Purple-to-pink gradient):
```
┌──────────────┐
│  Button Text │  ← Purple to pink gradient
└──────────────┘
```

**Outline** (Cyan border):
```
┌──────────────┐
│  Button Text │  ← Cyan border, transparent bg
└──────────────┘
```

**Interactions**:
- Hover: Scales to 1.05, adds glow shadow
- Click: Scales to 0.95 (press effect)

---

### SnowflakeBurst Component
**Location**: `components/UI/SnowflakeBurst.tsx`

**Visual Description**:
```
       •
   •       •
 •     ⭐     •
   •       •
       •
```

**Key Features**:
- 12 particles in a circle
- Each particle shoots outward
- Fades while expanding
- Duration: 600ms
- Color: Cyan (matches brand)

**Use Case**: Triggered when favoriting a job

---

## 🧭 Layout Components

### Navigation Component
**Location**: `components/Layout/Navigation.tsx`

**Visual Description**:
```
┌──────────────────────────────────────────────────────┐
│ [🏔️ SkiJobs]  Find Jobs  Resorts  About  [Post Job] │
└──────────────────────────────────────────────────────┘
```

**Key Features**:
- Sticky position (follows scroll)
- Glassmorphism with blur
- Logo: Mountain icon + gradient text
- Desktop: Horizontal menu
- Mobile: Hamburger menu
- Border at bottom

**Mobile View**:
```
┌──────────────────────┐
│ [🏔️ SkiJobs]    [☰] │
├──────────────────────┤
│ Find Jobs            │
│ Resorts              │
│ About                │
│ Contact              │
│ [Post a Job]         │
└──────────────────────┘
```

---

### Footer Component
**Location**: `components/Layout/Footer.tsx`

**Visual Description**:
```
┌────────────────────────────────────────────────────────┐
│                                                        │
│ [🏔️ SkiJobs]         For Job Seekers    For Employers │
│ Connecting people     Browse Jobs        Post a Job    │
│ with mountain jobs    Career Advice      Pricing       │
│                                                        │
│ [𝕏] [📷] [💼] [✉️]   Company            Legal         │
│                       About Us           Privacy       │
│                       Blog               Terms         │
│                                                        │
├────────────────────────────────────────────────────────┤
│ © 2026 SkiJobs              Made with ❄️ for skiers   │
└────────────────────────────────────────────────────────┘
```

**Key Features**:
- Dark background (slate-900)
- 6-column grid (brand takes 2 columns)
- Social icons with hover effects
- 4 link categories
- Copyright bar at bottom

---

## 📊 Page Sections

### Stats Section
**Visual Description**:
```
┌────────────────────────────────────────────────────┐
│  [🏔️]        [👥]        [🏆]        [📈]         │
│  89+         12K+        5.6K+       95%           │
│  Partner     Active      Success     Satisfaction  │
│  Resorts     Seekers     Placements  Rate          │
└────────────────────────────────────────────────────┘
```

**Key Features**:
- 4 glassmorphism cards
- Gradient icon backgrounds
- Large numbers (gradient text)
- Labels below
- Staggered entry animation

**Icon Gradients**:
1. Mountain: Cyan to blue
2. Users: Blue to purple
3. Award: Purple to pink
4. Trending: Pink to orange

---

### How It Works Section
**Visual Description**:
```
┌───────────────────────────────────────────────┐
│                                               │
│        Your Path to the Mountains             │
│        Three simple steps to your dream job   │
│                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │    01    │  │    02    │  │    03    │   │
│  │ Create   │  │ Browse & │  │   Get    │   │
│  │ Profile  │  │  Apply   │  │  Hired   │   │
│  │          │  │          │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘   │
└───────────────────────────────────────────────┘
```

**Key Features**:
- 3 glassmorphism cards
- Giant step numbers (01, 02, 03)
- Title and description
- Sequential reveal animation

---

## 🎨 Color Reference

### Applied Colors in Components

| Component | Primary Color | Accent |
|-----------|---------------|--------|
| Hero title | White | Cyan-blue gradient |
| Search bar | Glassmorphism | Cyan-blue border |
| Job cards | Dark glass | Cyan-blue button |
| Featured badge | Amber-orange | - |
| Difficulty ◆ | Green | - |
| Difficulty ◆◆ | Blue | - |
| Difficulty ◆◆◆ | Black/slate | - |
| Favorite heart | Red when active | Cyan burst |
| Navigation | Dark glass | Cyan logo |
| Buttons primary | Cyan-blue gradient | Glow on hover |
| Buttons secondary | Purple-pink gradient | - |
| Footer | Slate-900 | Cyan links |

---

## ⚡ Animation Reference

### Snow Particles (SnowHero)
- **Count**: 80 particles
- **Movement**: Top to bottom, slight horizontal drift
- **Duration**: 5-13 seconds (random)
- **Opacity**: 0 → 1 → 1 → 0
- **Size**: 2-6px (random)
- **Delay**: Random 0-5s

### 3D Card Tilt (JobCard3D)
- **X Rotation**: -7.5° to +7.5°
- **Y Rotation**: -7.5° to +7.5°
- **Spring Physics**: Follows mouse with smooth spring
- **Background Parallax**: 20px movement
- **Z-Transform**: 50px depth

### Snowflake Burst (Favorite)
- **Particles**: 12 in circle
- **Distance**: 50px outward
- **Duration**: 600ms
- **Scale**: 0 → 1.5 → 2
- **Opacity**: 1 → 0.8 → 0

### Entry Animations
- **Cards**: Opacity 0→1, Y 30px→0
- **Stagger Delay**: 100ms between items
- **Duration**: 400-600ms
- **Easing**: ease-out

### Hover Animations
- **Cards**: Scale 1.02, Y -4px
- **Buttons**: Scale 1.05, add shadow
- **Icons**: Scale 1.1
- **Duration**: 200-300ms

---

## 📏 Spacing Reference

### Component Padding
- Cards: `p-6` (24px)
- Buttons: `px-6 py-3` (24px, 12px)
- Sections: `py-24` (96px vertical)
- Container: `px-6` (24px horizontal)

### Component Gaps
- Grid gaps: `gap-8` (32px)
- Flex gaps: `gap-4` (16px)
- Button groups: `gap-3` (12px)

### Rounded Corners
- Cards: `rounded-2xl` (16px)
- Buttons: `rounded-xl` (12px)
- Small elements: `rounded-lg` (8px)
- Pills: `rounded-full`

---

## 🎯 Component Hierarchy

```
App
├── Navigation (sticky)
├── SnowHero
│   ├── Snow particles (80x)
│   ├── WeatherWidget
│   ├── Search bar
│   └── Quick filters
├── Jobs Section
│   ├── TrailFilter
│   └── JobCard3D (grid)
│       ├── Background image
│       ├── Featured badge
│       ├── Favorite button
│       │   └── SnowflakeBurst
│       └── MountainButton
├── Stats Section
│   └── GlassCard (4x)
├── How It Works
│   └── GlassCard (3x)
└── Footer
```

---

## 🎨 Visual Hierarchy

### Size Scale
1. **Hero Title**: 6xl-8xl (60-96px) - Largest
2. **Section Headings**: 4xl-5xl (36-48px)
3. **Card Titles**: 2xl (24px)
4. **Job Titles**: xl (20px)
5. **Body Text**: base-lg (16-18px)
6. **Labels**: sm-xs (12-14px) - Smallest

### Color Importance
1. **Gradient text** = Most important (Peak, stats)
2. **White text** = Primary content
3. **Gray-300** = Secondary info
4. **Gray-400** = Tertiary/labels

### Visual Weight
1. Bold + Large = Hero title
2. Bold + Medium = Section headings
3. Bold + Small = Card titles
4. Regular + Medium = Body
5. Regular + Small = Labels

---

This visual reference should help you understand exactly how each component looks and behaves! 🎨
