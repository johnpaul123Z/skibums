# 🚀 Quick Start Guide - SkiJobs

Welcome to SkiJobs! This guide will help you get up and running in minutes.

## 📋 Prerequisites

- Node.js 20+ installed
- npm or yarn package manager
- A code editor (VS Code recommended)

## 🎯 Quick Setup (30 seconds)

```bash
# You already have the project set up! Just run:
npm run dev

# Or with a specific port:
PORT=3001 npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) (or your specified port) in your browser.

## 🎨 What You'll See

### Hero Section
- Animated snowflakes falling across the screen
- Live weather widget showing resort conditions
- Beautiful gradient search bar
- Quick filter buttons for job categories

### Featured Jobs
- 3D cards that tilt as you move your mouse
- Click the heart icon to favorite (with snowflake burst animation!)
- Hover over cards to see additional details slide out
- "Quick Apply" button with gradient styling

### Stats & How It Works
- Animated stat cards with icons
- 3-step guide with glassmorphism cards

## 🎮 Interactive Features to Try

### 1. Mouse Over Job Cards
Move your mouse over any job card - it will tilt in 3D following your cursor!

### 2. Favorite Animation
Click the heart icon on any job card to see the snowflake burst animation.

### 3. Trail Filters
Click the diamond rating filters to see the interactive selection.

### 4. Search Bar
The search bar has a gradient border and glassmorphism effect. Try hovering and clicking it.

### 5. Navigation
The navigation bar is sticky - scroll down to see it follow you.

## 📝 Making Your First Edit

### Change the Hero Title

Open `app/page.tsx` and find:

```tsx
<h1 className="text-6xl md:text-8xl font-bold text-white tracking-tight">
  Find Your{" "}
  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
    Peak
  </span>
</h1>
```

Change "Peak" to your own text!

### Add a New Job

In `app/page.tsx`, find the `featuredJobs` array and add:

```typescript
{
  id: "999",
  title: "Your Job Title",
  resort: "Your Resort",
  location: "City, State",
  salary: "$40k - $60k",
  type: "Full-time",
  difficulty: 2,
  image: "https://images.unsplash.com/photo-YOURIMAGE",
  featured: true,
}
```

### Change Colors

Edit `app/globals.css`:

```css
:root {
  --glacier-cyan: #YOUR_COLOR;
}
```

Then update Tailwind colors:

```css
@theme inline {
  --color-glacier-cyan: #YOUR_COLOR;
}
```

## 🎨 Customization Ideas

### Beginner Level
- Change text content
- Update job listings
- Modify colors in globals.css
- Add more quick filter buttons
- Update stats numbers

### Intermediate Level
- Add new job categories
- Create a job detail page
- Implement real search functionality
- Add pagination
- Create filters for location/salary

### Advanced Level
- Connect to a real backend API
- Add user authentication
- Implement job applications
- Add a map view with resort locations
- Create an admin dashboard

## 📚 Key Files to Know

```
app/page.tsx              → Main page, edit content here
app/globals.css           → Colors and styles
components/Hero/          → Hero section components
components/Jobs/          → Job card and filters
components/UI/            → Reusable UI components
lib/data.ts              → Sample data and mock APIs
lib/types.ts             → TypeScript definitions
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Try a different port
PORT=3001 npm run dev
```

### Styles Not Updating

```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### TypeScript Errors

```bash
# Regenerate types
npm run build
```

## 🎯 Next Steps

1. **Explore the Code**: Open each component and see how it works
2. **Read the Design System**: Check out `DESIGN_SYSTEM.md` for design guidelines
3. **Try the Examples**: Use sample data from `lib/data.ts`
4. **Build Features**: Start with adding a job detail page
5. **Deploy**: When ready, deploy to Vercel or Netlify

## 🎓 Learning Resources

### Framer Motion
- [Official Docs](https://www.framer.com/motion/)
- Check `components/Jobs/JobCard3D.tsx` for 3D tilt example
- See `components/Hero/SnowHero.tsx` for particle animations

### Tailwind CSS
- [Official Docs](https://tailwindcss.com)
- See how we use utility classes throughout
- Check `globals.css` for custom utilities

### Next.js
- [Official Docs](https://nextjs.org/docs)
- This uses the App Router
- All components are client-side ("use client")

## 💡 Tips

1. **Start Small**: Don't try to change everything at once
2. **Use the Browser**: Chrome DevTools are your friend
3. **Hot Reload**: Changes appear instantly - no need to refresh
4. **Console**: Open browser console to see any errors
5. **Experiment**: The code won't break! Try things out.

## 🎨 Design Principles

This project follows these principles:

1. **Smooth Animations**: Everything should feel fluid
2. **Glassmorphism**: Transparent, blurred backgrounds
3. **3D Interactions**: Cards respond to mouse movement
4. **Mountain Theme**: Colors and imagery evoke ski resorts
5. **Performance**: Animations use GPU-accelerated properties

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms

This is a standard Next.js app and works on:
- Netlify
- Cloudflare Pages
- AWS Amplify
- Railway
- Render

## 🤝 Get Help

- Check `README.md` for comprehensive documentation
- Read `DESIGN_SYSTEM.md` for design guidelines
- Look at `lib/data.ts` for example data structures
- Review component files for implementation examples

## 🎉 Have Fun!

This project is designed to be:
- ✨ Beautiful to look at
- 🎮 Fun to interact with
- 📚 Educational to explore
- 🛠️ Easy to customize

**Now go build something amazing!** 🏔️

---

Questions? Check the full README.md or explore the code!
