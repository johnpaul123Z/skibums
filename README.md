# ⛷️ SkiJobs - Alpine Modern Job Board

A visually stunning, cutting-edge React frontend for a ski resort job board built with Next.js, Framer Motion, and Tailwind CSS.

![Alpine Modern Design](https://img.shields.io/badge/Design-Alpine%20Modern-00D2FF?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🎿 Design Concept: "Alpine Modern"

A premium, mountain-inspired minimalist design with dynamic animations, 3D card effects, and glassmorphism styling.

### Color Palette

- **Snow White**: `#FAFAFA` - Clean backgrounds
- **Ice Blue**: `#E8F4F8` - Subtle accents
- **Glacier Cyan**: `#00D2FF` - Primary brand color
- **Mountain Slate**: `#2D3748` - Dark text
- **Pine Green**: `#1A4731` - Nature accents
- **Sunset Amber**: `#FF6B35` - CTAs
- **Powder Alert**: `#FF3366` - Urgent actions

## ✨ Key Features

### 🏔️ Hero Section
- Full-viewport animated snow particle effects (80+ particles)
- Live weather widget with real-time conditions
- Glassmorphism search bar styled like a ski pass
- Gradient animations and smooth transitions
- Quick filter tags for job categories

### 💼 Job Cards with 3D Effects
- Mouse-tracking 3D tilt effect (React Spring physics)
- Parallax background images
- Glassmorphism styling with backdrop blur
- Diamond difficulty ratings (◆ ◆ ◆)
- Favorite button with snowflake burst animation
- "Lift ticket" slide-out on hover
- One-click quick apply

### 🎨 UI Components
- **GlassCard**: Reusable glassmorphism component
- **MountainButton**: Gradient CTAs with hover effects
- **TrailFilter**: Ski trail-inspired difficulty filters
- **WeatherWidget**: Live conditions display
- **Navigation**: Sticky navbar with blur effect
- **Footer**: Comprehensive links with social icons

### 🎬 Animations
- Framer Motion for smooth page transitions
- Staggered entry animations
- 3D card rotations following mouse position
- Snowflake burst on favorite
- Smooth height transitions

## 🛠️ Tech Stack

| Feature | Library |
|---------|---------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| State | React Hooks |
| Utils | clsx, tailwind-merge |

## 📁 Project Structure

```
/Users/johngleiter/bob/
├── app/
│   ├── globals.css          # Alpine Modern color system
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page with all sections
├── components/
│   ├── Hero/
│   │   ├── SnowHero.tsx              # Hero with snow particles
│   │   └── WeatherWidget.tsx         # Live weather display
│   ├── Jobs/
│   │   ├── JobCard3D.tsx             # 3D tilt job cards
│   │   └── TrailFilter.tsx           # Diamond rating filters
│   ├── UI/
│   │   ├── GlassCard.tsx             # Glassmorphism card
│   │   ├── MountainButton.tsx        # Styled buttons
│   │   └── SnowflakeBurst.tsx        # Favorite animation
│   └── Layout/
│       ├── Navigation.tsx            # Sticky nav
│       └── Footer.tsx                # Footer with links
├── hooks/
│   ├── useMousePosition.ts   # 3D tilt tracking
│   └── useWeather.ts         # Weather data (mock)
└── lib/
    └── utils.ts              # Tailwind class merger
```

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### View the App

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Customization

### Adding New Jobs

Edit the `featuredJobs` array in `app/page.tsx`:

```typescript
const newJob = {
  id: "4",
  title: "Snowboard Instructor",
  resort: "Park City",
  location: "Utah",
  salary: "$40k - $60k",
  type: "Seasonal",
  difficulty: 1, // 1=Green, 2=Blue, 3=Black
  image: "https://your-image-url.jpg",
  featured: false,
};
```

### Changing Colors

Update CSS variables in `app/globals.css`:

```css
:root {
  --glacier-cyan: #00D2FF;  /* Your brand color */
  --mountain-slate: #2D3748;
  /* ... more colors */
}
```

### Customizing Animations

Adjust Framer Motion settings in components:

```typescript
// Faster animations
transition={{ duration: 0.3 }}

// Bouncier springs
transition={{ type: "spring", stiffness: 400 }}
```

## 🎯 Component Usage Examples

### Using JobCard3D

```tsx
import { JobCard3D } from "@/components/Jobs/JobCard3D";

<JobCard3D job={{
  id: "1",
  title: "Ski Instructor",
  resort: "Aspen",
  location: "Colorado",
  salary: "$45k - $65k",
  type: "Full-time",
  difficulty: 2,
  image: "/image.jpg",
  featured: true
}} />
```

### Using GlassCard

```tsx
import { GlassCard } from "@/components/UI/GlassCard";

<GlassCard className="p-6">
  <h3>Your Content</h3>
</GlassCard>
```

### Using MountainButton

```tsx
import { MountainButton } from "@/components/UI/MountainButton";

<MountainButton 
  variant="primary" 
  onClick={() => console.log("Clicked!")}
>
  Apply Now
</MountainButton>
```

## 🌟 Features by Section

### Hero Section
- 80 animated snowflakes with random timing
- Live weather widget (temperature, conditions, snow depth)
- Gradient-bordered search bar with glassmorphism
- Quick filter buttons (Ski Instructor, Lift Operator, etc.)
- Stats counter at bottom (Active Jobs, Resorts, Hired)

### Jobs Section
- Trail filter with diamond ratings
- 3D card grid (responsive 1/2/3 columns)
- Staggered entry animations
- Hover effects reveal extra details

### Stats Section
- 4 gradient stat cards
- Icon badges with gradients
- Scale-in animations on scroll

### How It Works Section
- 3-step process cards
- Large step numbers with gradient backgrounds
- Sequential reveal animations

## 🔧 Advanced Customization

### Adding a Real Weather API

Replace the mock in `hooks/useWeather.ts`:

```typescript
// Use OpenWeatherMap, WeatherAPI, or similar
const response = await fetch(
  `https://api.openweathermap.org/data/2.5/weather?q=${resort}&appid=YOUR_KEY`
);
```

### Adding Search Functionality

Implement search in `SnowHero.tsx`:

```typescript
const handleSearch = async () => {
  const results = await fetch(`/api/jobs?q=${searchQuery}`);
  // Handle results
};
```

### Connecting to a Backend

Create API routes in `app/api/`:

```typescript
// app/api/jobs/route.ts
export async function GET(request: Request) {
  // Fetch from your database
  return Response.json({ jobs: [...] });
}
```

## 📱 Responsive Design

The design is fully responsive:
- **Mobile**: Single column layout, simplified animations
- **Tablet**: 2-column grid for jobs
- **Desktop**: 3-column grid, full 3D effects

## 🎭 Browser Support

- Chrome/Edge (recommended for best performance)
- Firefox
- Safari (some backdrop-filter effects may vary)

## 🚀 Performance Tips

1. **Images**: Use Next.js Image component for optimization
2. **Animations**: Reduce particle count on mobile
3. **Code Splitting**: Components are already modular
4. **Caching**: Enable SWR or React Query for data

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Add more ski resorts
- Implement map view
- Add user authentication
- Create job application flow
- Add filters and search
- Seasonal theme switcher

## 🎿 Credits

Built with love for the ski community by [Your Name]

Inspired by the beauty of mountain resorts and modern web design.

---

**Ready to hit the slopes?** Start the dev server and explore! 🏔️
