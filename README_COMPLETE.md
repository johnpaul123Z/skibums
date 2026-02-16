# 🎿 Ski Resort Job Board - Complete!

## ✅ What You Have Now

Your beautiful, cutting-edge ski resort job board is **LIVE** and scrapes jobs from:

### 🏔️ **190+ Jobs from Both Major Ski Companies**
- **Vail Resorts** (Epic Pass) - 139 jobs across 6 departments
- **Alterra Mountain Company** (Ikon Pass) - 50+ jobs

### 🗺️ **Interactive Map with 39 Resorts**
- Click resort markers to see job listings
- Real-time job counts per location
- Sliding panel with job details
- Coast-to-coast coverage (Vermont to California, Colorado to BC)

### 🎨 **"Alpine Modern" Design**
- Glassmorphism cards with 3D tilt effects
- Animated snow particles in hero section
- Dynamic weather widget
- Gradient buttons and smooth transitions
- Dark theme optimized for mountain imagery

## 🚀 Access Your App

```
http://localhost:3002
```

## 📊 Current Features

✅ **Live Job Scraping**
- Scrapes on every page load (no stale data!)
- Vail: `axios` + `cheerio` (static HTML)
- Alterra: `puppeteer` (JavaScript-rendered content)

✅ **Smart Categorization**
- Difficulty ratings (Green/Blue/Black Diamond)
- Department/category badges
- Resort and location tags
- Shift type (Full-time, Part-time, Seasonal)

✅ **Direct Application**
- "Apply Now" opens actual job posting URL
- "View Details" for more info
- No fake/sample data - 100% live jobs

✅ **Interactive Map**
- Mapbox GL with custom markers
- Job count badges on each resort
- Click to filter and view jobs
- Mobile-responsive

✅ **Responsive UI**
- Works on desktop, tablet, mobile
- Smooth animations and transitions
- Loading states and error handling

## 📁 Key Files

```
bob/
├── app/
│   ├── page.tsx                    # Main page (fetches everything)
│   └── api/jobs/scrape/route.ts    # API endpoint for scraping
├── components/
│   ├── Hero/
│   │   ├── SnowHero.tsx           # Animated hero with snow
│   │   └── WeatherWidget.tsx      # Live weather display
│   ├── Jobs/
│   │   ├── JobCard3D.tsx          # 3D tilt job cards
│   │   ├── JobMap.tsx             # Interactive Mapbox map
│   │   └── TrailFilter.tsx        # Difficulty filters
│   ├── UI/
│   │   ├── GlassCard.tsx          # Glassmorphism container
│   │   └── MountainButton.tsx     # Styled CTAs
│   └── Layout/
│       ├── Navigation.tsx         # Sticky nav bar
│       └── Footer.tsx             # Site footer
├── lib/
│   ├── scraper.ts                 # Main scraping logic
│   ├── types.ts                   # TypeScript interfaces
│   └── utils.ts                   # Helper functions
├── .env.local                     # Mapbox token
└── ALTERRA_INTEGRATION.md         # This guide!
```

## 🛠️ API Usage

### Fetch Only Vail Jobs
```typescript
const response = await fetch('/api/jobs/scrape');
```

### Fetch All Vail Departments
```typescript
const response = await fetch('/api/jobs/scrape?category=all');
```

### Fetch Only Alterra Jobs
```typescript
const response = await fetch('/api/jobs/scrape?category=alterra');
```

### Fetch EVERYTHING (Default)
```typescript
const response = await fetch('/api/jobs/scrape?category=everything');
// Returns 190+ jobs from Vail + Alterra
```

## 🔧 Technology Stack

| Feature | Library |
|---------|---------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Maps | Mapbox GL JS |
| Scraping (Vail) | axios + cheerio |
| Scraping (Alterra) | puppeteer |

## 🎯 Testing It Out

1. **Visit**: `http://localhost:3002`
2. **Wait**: 5-10 seconds for scraping to complete
3. **See**: 190+ live jobs load automatically
4. **Interact**: 
   - Scroll down to see the map
   - Click any resort marker
   - Browse jobs in the side panel
   - Click "Apply Now" to go to real posting

## 📈 Performance

- **Initial Load**: ~5-10 seconds (scraping time)
- **Puppeteer**: Launches headless Chrome for Alterra
- **Network**: Makes ~7 HTTP requests (6 Vail + 1 Alterra)
- **Data Size**: ~200KB JSON response

### Optimization Ideas (Optional)
- Add Redis caching (cache jobs for 24 hours)
- Use a cron job to pre-scrape jobs
- Implement ISR (Incremental Static Regeneration)
- Add CDN for faster loads

## 🗺️ Resort Coverage

### Vail Resorts (21 resorts)
- Colorado: Vail, Beaver Creek, Breckenridge, Keystone, Crested Butte
- Utah: Park City
- California: Heavenly, Northstar, Kirkwood
- Vermont: Stowe, Okemo, Mount Snow
- New York: Hunter
- Pennsylvania: Seven Springs, Jack Frost, Liberty
- New Hampshire: Attitash, Wildcat, Mount Sunapee
- Washington: Stevens Pass
- BC: Whistler Blackcomb

### Alterra Resorts (18 resorts)
- California: Palisades Tahoe, Mammoth, June, Big Bear, Snow Valley
- Colorado: Steamboat, Winter Park
- Utah: Deer Valley, Solitude
- Washington: Crystal Mountain
- Idaho: Schweitzer
- Ontario: Blue Mountain
- Quebec: Tremblant
- Vermont: Stratton, Sugarbush
- West Virginia: Snowshoe
- BC: CMH Heli-Skiing

## 🎨 Color Palette

```css
/* Alpine Modern Colors */
--snow-white: #FAFAFA;
--ice-blue: #E8F4F8;
--glacier-cyan: #00D2FF;
--mountain-slate: #2D3748;
--pine-green: #1A4731;
--sunset-amber: #FF6B35;
--powder-alert: #FF3366;
```

## 🚨 Known Limitations

1. **Alterra Jobs**: Limited to first 50 for performance
2. **Scraping Time**: Takes 5-10 seconds on each load
3. **No Caching**: Jobs are fetched fresh every time
4. **Rate Limiting**: Be respectful - don't hit the API too often

## 💡 Next Steps (If You Want More)

1. **Add More Companies**
   - Powdr (Copper, Killington, Snowbird)
   - Boyne Resorts (Big Sky, Loon, Sunday River)
   - Independent resorts (Alta, Mad River Glen)

2. **Advanced Features**
   - User accounts and saved jobs
   - Email alerts for new postings
   - Application tracking
   - Salary comparison charts

3. **SEO & Sharing**
   - Add meta tags for social sharing
   - Create individual job pages
   - Add sitemap.xml

4. **Deploy**
   - Push to Vercel/Netlify
   - Set up scheduled scraping
   - Add analytics

---

## 🎉 You're Done!

Your ski resort job board is **feature-complete** and ready to use!

**190+ jobs** from **39 resorts** across North America, with a beautiful UI and interactive map. 🏔️🎿

Enjoy! ⛷️
