# 🎯 QUICK REFERENCE - Your Ski Job Board

## ✅ What You Have Now

A **live ski job board** that scrapes real positions from Vail Resorts and links directly to their application pages.

---

## 🚀 Start It

```bash
cd /Users/johngleiter/bob
npm run dev
```

Open: **http://localhost:3000**

---

## 🎯 Current Features

### 1. **Live Job Scraping** 🕷️
- Scrapes: https://jobs.vailresortscareers.com/go/Ski-&-Snowboard-School/7906500/
- Shows: 14+ real positions
- Updates: Every page load

### 2. **Real Application Links** 🔗
- "Apply Now" → Opens actual Vail job posting
- "View Details" → Same real link
- Opens in new tab

### 3. **Beautiful UI** ✨
- 80 animated snowflakes
- 3D card tilt (follows mouse!)
- Glassmorphism styling
- Diamond difficulty ratings (◆ ◆◆ ◆◆◆)

### 4. **Professional States** 💼
- Loading spinner
- Error handling with retry
- Empty state message
- "Live data" badge

---

## 📁 Key Files

```
bob/
├── app/
│   ├── page.tsx              ← Main page (shows jobs)
│   └── api/jobs/scrape/
│       └── route.ts          ← API endpoint
├── components/
│   ├── Hero/
│   │   └── SnowHero.tsx      ← Hero with snow
│   └── Jobs/
│       └── JobCard3D.tsx     ← Job cards (3D tilt!)
└── lib/
    └── scraper.ts            ← Web scraper
```

---

## 🧪 Test It

### Test 1: Scraper
```bash
npx tsx lib/scraper.ts
```
Should see: 14 jobs found

### Test 2: API
```bash
curl http://localhost:3000/api/jobs/scrape
```
Should return: JSON with 14 jobs

### Test 3: UI
Open browser → See real jobs → Click "Apply Now" → Opens Vail site ✅

---

## 🎨 What It Looks Like

```
┌─────────────────────────────────────────┐
│              ❄️  ❄️  ❄️                  │
│         Find Your PEAK                  │
│    Dream jobs at ski resorts            │
│                                         │
│   [🔍 Search resorts, roles...] [Go]   │
│                                         │
├─────────────────────────────────────────┤
│  Live Opportunities                     │
│  14 positions from Vail Resorts         │
│  ⚫ Live data from Vail Resorts Careers │
│                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │ Cert.   │  │ Non-    │  │ Ski     │ │
│  │ Ski     │  │ Cert.   │  │ School  │ │
│  │ Instruc │  │ Instruc │  │ Support │ │
│  │ ◆◆      │  │ ◆       │  │ ◆       │ │
│  │         │  │         │  │         │ │
│  │ [Apply] │  │ [Apply] │  │ [Apply] │ │ ← Opens real job!
│  └─────────┘  └─────────┘  └─────────┘ │
└─────────────────────────────────────────┘
```

---

## 🎯 Interactive Features

Try these:

1. **Move mouse over job cards** → They tilt in 3D!
2. **Click heart icon** → Snowflake burst animation
3. **Click "Apply Now"** → Opens real Vail job posting
4. **Scroll down** → See stats, how it works, footer

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| **LIVE_JOBS_ONLY.md** | What changed (real jobs only) |
| **SCRAPING_COMPLETE.md** | Scraping implementation |
| **SCRAPING_GUIDE.md** | How to use the scraper |
| **BUILD_COMPLETE.md** | Full project summary |
| **QUICKSTART.md** | 30-second setup |
| **README.md** | Complete documentation |

---

## 🔧 Common Tasks

### Change Colors
```
Edit: app/globals.css
Look for: --glacier-cyan: #00D2FF
```

### Add More Scrapers
```
Edit: lib/scraper.ts
Add: scrapeAlterra(), scrapePowdr()
```

### Cache Results
```
Edit: app/api/jobs/scrape/route.ts
Add: export const revalidate = 3600; // 1 hour
```

### Customize Cards
```
Edit: components/Jobs/JobCard3D.tsx
Modify: salary ranges, difficulty logic
```

---

## 🌐 Current Data Source

**Vail Resorts Careers**
- URL: https://jobs.vailresortscareers.com/go/Ski-&-Snowboard-School/7906500/
- Jobs: 14 positions
- Resorts: Beaver Creek, Heavenly, Kirkwood, Northstar, Hunter, Mount Snow, Okemo, Jack Frost, Liberty, Mount Sunapee

---

## 🎯 Stats

- **Components**: 9
- **Live Jobs**: 14
- **Resorts**: 10+
- **Lines of Code**: ~2,000+
- **Documentation**: 8 files, 2,000+ lines
- **Animations**: Snowflakes, 3D tilt, favorites
- **Zero**: Sample data (all real!)

---

## 🎉 You're Ready!

Everything works:
- ✅ Dev server running
- ✅ Scraper working (14 jobs)
- ✅ Beautiful UI with animations
- ✅ Real job links
- ✅ Professional error handling
- ✅ Complete documentation

**Just run `npm run dev` and visit http://localhost:3000** 🎿

---

## 💡 Quick Commands

```bash
# Start dev server
npm run dev

# Test scraper
npx tsx lib/scraper.ts

# Test API
curl http://localhost:3000/api/jobs/scrape | jq

# Build for production
npm run build

# Deploy to Vercel
vercel
```

---

**Now go enjoy your fully functional ski job board!** ⛷️
