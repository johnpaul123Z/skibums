# 🎨 Design System Documentation

## Alpine Modern Design Language

### Philosophy

The Alpine Modern design language combines the crisp, clean aesthetic of mountain environments with cutting-edge web technologies. Every element is designed to evoke the experience of being at a premier ski resort.

---

## Color System

### Primary Colors

```css
--snow-white: #FAFAFA     /* Backgrounds, cards */
--glacier-cyan: #00D2FF   /* Primary actions, links */
--mountain-slate: #2D3748 /* Text, borders */
```

### Accent Colors

```css
--ice-blue: #E8F4F8       /* Subtle highlights */
--pine-green: #1A4731     /* Success states */
--sunset-amber: #FF6B35   /* Warning, featured */
--powder-alert: #FF3366   /* Errors, urgent */
```

### Usage Guidelines

- **Glacier Cyan**: Primary brand color, use for CTAs and interactive elements
- **Mountain Slate**: Primary text color, provides excellent contrast
- **Snow White**: Backgrounds, maintains clean feel
- **Sunset Amber**: Featured badges, premium content
- **Powder Alert**: Favorites, urgent actions

---

## Typography

### Font Families

```css
--font-sans: ui-sans-serif, system-ui, sans-serif
--font-mono: ui-monospace, monospace
```

### Recommended Fonts

1. **Headings**: Inter Bold / Space Grotesk
2. **Body**: Inter Regular / Satoshi
3. **Code/Salaries**: JetBrains Mono

### Type Scale

```css
.text-xs    → 0.75rem (12px)  /* Labels */
.text-sm    → 0.875rem (14px) /* Secondary text */
.text-base  → 1rem (16px)     /* Body */
.text-lg    → 1.125rem (18px) /* Large body */
.text-xl    → 1.25rem (20px)  /* Small headings */
.text-2xl   → 1.5rem (24px)   /* Card headings */
.text-4xl   → 2.25rem (36px)  /* Section headings */
.text-6xl   → 3.75rem (60px)  /* Hero mobile */
.text-8xl   → 6rem (96px)     /* Hero desktop */
```

---

## Spacing System

Based on 4px grid:

```
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px
```

### Common Patterns

- **Card padding**: `p-6` (24px)
- **Section padding**: `py-24` (96px vertical)
- **Element gaps**: `gap-4` to `gap-8`
- **Container max-width**: `max-w-7xl`

---

## Components

### Glassmorphism

Key properties for glass effect:

```css
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.2);
```

### Button Variants

#### Primary
```tsx
bg-gradient-to-r from-cyan-500 to-blue-600
shadow-lg shadow-cyan-500/50 (on hover)
```

#### Secondary
```tsx
bg-gradient-to-r from-purple-500 to-pink-600
```

#### Outline
```tsx
border-2 border-cyan-400
hover:bg-cyan-400/10
```

### Card Shadows

```css
shadow-xl     /* Standard cards */
shadow-2xl    /* Featured cards */
shadow-lg     /* Buttons on hover */
```

---

## Animations

### Timing Functions

- **Smooth**: `ease-in-out` - General purpose
- **Spring**: `type: "spring", stiffness: 300` - Interactive elements
- **Linear**: `linear` - Continuous animations (snow, rotation)

### Duration Standards

- **Fast**: 200-300ms - Button interactions
- **Medium**: 400-600ms - Card animations
- **Slow**: 800-1200ms - Page transitions
- **Continuous**: Infinite - Particles, rotations

### Common Patterns

#### Hover Scale
```tsx
whileHover={{ scale: 1.05 }}
```

#### Tap Response
```tsx
whileTap={{ scale: 0.95 }}
```

#### Entry Animation
```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
```

#### Stagger Children
```tsx
{items.map((item, i) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.1 }}
  />
))}
```

---

## Icons

Using **Lucide React** for consistent, customizable icons.

### Size Standards

- **Small**: `w-4 h-4` (16px) - Inline with text
- **Medium**: `w-5 h-5` (20px) - Buttons
- **Large**: `w-6 h-6` (24px) - Feature icons
- **Hero**: `w-8 h-8` (32px) - Stat cards

### Color Classes

```tsx
text-cyan-400    /* Primary icons */
text-blue-400    /* Secondary */
text-green-400   /* Success */
text-amber-500   /* Warning */
text-red-500     /* Error */
```

---

## Difficulty Ratings

### Trail System

Inspired by ski trail ratings:

- **◆ Green Circle** (1): Entry-level positions
- **◆◆ Blue Square** (2): Intermediate experience
- **◆◆◆ Black Diamond** (3): Expert/Management

### Color Coding

```tsx
text-green-400   /* Green circle */
text-blue-400    /* Blue square */
text-slate-900   /* Black diamond */
```

---

## Responsive Breakpoints

```css
sm:  640px   /* Mobile landscape */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
xl:  1280px  /* Large desktop */
2xl: 1536px  /* Extra large */
```

### Grid Patterns

```tsx
/* Jobs grid */
grid-cols-1 md:grid-cols-2 lg:grid-cols-3

/* Stats */
grid-cols-1 md:grid-cols-2 lg:grid-cols-4

/* Features */
grid-cols-1 md:grid-cols-3
```

---

## Accessibility

### Contrast Ratios

- **Text on dark**: Snow white (#FAFAFA) on Mountain Slate (#2D3748) = 10.8:1 ✓
- **Cyan on dark**: Glacier Cyan (#00D2FF) on Slate-900 = 7.2:1 ✓
- **Links**: Underline on hover, focus ring always visible

### Interactive States

```tsx
/* Focus visible */
focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2

/* Hover */
hover:bg-cyan-400/10

/* Active */
active:scale-95
```

### ARIA Labels

Always include for icon-only buttons:

```tsx
<button aria-label="Favorite this job">
  <Heart />
</button>
```

---

## Performance Guidelines

### Animation Performance

1. Use `transform` and `opacity` (GPU-accelerated)
2. Avoid animating `width`, `height`, `top`, `left`
3. Reduce particle count on mobile (30 vs 80)
4. Use `will-change` sparingly

### Image Optimization

```tsx
import Image from "next/image";

<Image
  src={job.image}
  alt={job.resort}
  width={400}
  height={300}
  quality={80}
  placeholder="blur"
/>
```

---

## Gradients

### Brand Gradients

```css
/* Sky gradient */
linear-gradient(135deg, #667eea 0%, #764ba2 100%)

/* Cyan to blue */
linear-gradient(to right, #00D2FF, #0080FF)

/* Mountain shadow */
linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 100%)
```

### Usage

```tsx
/* Backgrounds */
bg-gradient-to-r from-cyan-500 to-blue-600

/* Text */
bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent

/* Borders */
<div className="p-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl">
  <div className="bg-slate-900 rounded-xl">Content</div>
</div>
```

---

## Best Practices

### DO ✅

- Use glassmorphism for overlays
- Add micro-interactions to all clickable elements
- Maintain 4px spacing grid
- Use semantic HTML
- Include loading states
- Optimize images
- Test on mobile devices

### DON'T ❌

- Overuse animations (can be distracting)
- Use too many different colors
- Forget focus states
- Animate layout properties
- Use generic placeholder images in production
- Ignore accessibility
- Skip responsive testing

---

## Component Checklist

When creating new components:

- [ ] Responsive on all breakpoints
- [ ] Includes hover state
- [ ] Includes focus state
- [ ] Has proper TypeScript types
- [ ] Uses semantic HTML
- [ ] Accessible keyboard navigation
- [ ] Loading states (if async)
- [ ] Error states (if applicable)
- [ ] Follows color system
- [ ] Uses standard spacing
- [ ] Optimized animations

---

## Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [Next.js Docs](https://nextjs.org/docs)
