# 🏔️ Alterra Mountain Company Integration Complete!

## What's New?

Your ski resort job board now scrapes jobs from **BOTH** major ski resort companies:

### 1. **Vail Resorts** (Epic Pass) - 139 jobs
- Ski & Snowboard School
- Restaurant Operations  
- Hotel Operations
- Mountain Operations
- Transportation
- Retail Operations

### 2. **Alterra Mountain Company** (Ikon Pass) - NEW! ✨
- Palisades Tahoe, Mammoth, Steamboat, Winter Park
- Deer Valley, Solitude, Crystal, Schweitzer
- Blue Mountain, Tremblant, Stratton, Sugarbush
- Snowshoe, Big Bear, Snow Valley, June Mountain
- CMH Heli-Skiing & more!

## How It Works

### API Endpoints

```bash
# Vail only (Ski School)
GET /api/jobs/scrape

# All Vail departments (139 jobs)
GET /api/jobs/scrape?category=all

# Alterra only (50+ jobs)
GET /api/jobs/scrape?category=alterra

# BOTH companies (190+ jobs) - DEFAULT NOW
GET /api/jobs/scrape?category=everything
```

### Technology Used

**Vail Scraping:**
- `axios` + `cheerio` (static HTML parsing)
- Simple table scraping from career pages

**Alterra Scraping:**
- `puppeteer` (headless browser)
- Needed because Alterra's site is client-side rendered (Next.js)
- Waits for JavaScript to load, then extracts job data

### Map Updates

The interactive map now includes **39 resorts** across North America:
- All Vail Resorts (Epic Pass) - 21 resorts
- All Alterra Resorts (Ikon Pass) - 18 resorts

Resort markers show job counts and clicking opens a side panel with details!

## Files Modified

1. **`lib/scraper.ts`**
   - Added `scrapeAlterraJobs()` with Puppeteer
   - Added `scrapeAllResorts()` to combine both companies
   - Added `fetchAllResortJobs()` main function
   - Added `company: 'Vail' | 'Alterra'` field to `ScrapedJob`

2. **`app/api/jobs/scrape/route.ts`**
   - Updated to support `?category=everything` parameter
   - Now returns both Vail and Alterra jobs

3. **`app/page.tsx`**
   - Changed fetch to `?category=everything` by default
   - Updated loading text: "Loading from Vail + Alterra..."
   - Updated badge: "Live data from Vail Resorts + Alterra (Ikon Pass)"

4. **`components/Jobs/JobMap.tsx`**
   - Added 18 new Alterra resort coordinates
   - Improved resort name matching logic
   - Now handles partial name matches (e.g., "Palisades Tahoe" → "Palisades")

## Testing

Visit `http://localhost:3001` to see:
- **190+ live jobs** from both companies
- **Interactive map** with all 39 resorts
- Click any marker to see jobs at that resort
- "Apply Now" routes to the real job posting URL

## Performance Notes

- **Scraping time**: ~5-10 seconds (Puppeteer launches a browser)
- **Alterra limit**: First 50 jobs only (to keep it fast)
- **Daily scraping**: Both Vail and Alterra are scraped on every page load
- **Caching**: Consider adding Redis/caching for production

## Next Steps (Optional)

1. **Add caching**: Store jobs in Redis with 24-hour expiry
2. **Scheduled scraping**: Use a cron job instead of on-demand
3. **More filters**: Allow users to filter by company (Vail vs Alterra)
4. **Search**: Add search by job title, resort, or location
5. **Favorites**: Let users save/bookmark jobs

## Example Output

```
⛷️ Scraping ALL resort companies...

🎿 Scraping all Vail Resorts job categories...
✅ Scraped Ski & Snowboard School: 12 jobs
✅ Scraped Restaurant Operations: 25 jobs
✅ Scraped Hotel Operations: 18 jobs
✅ Scraped Mountain Operations: 45 jobs
✅ Scraped Transportation: 8 jobs
✅ Scraped Retail Operations: 31 jobs

🏔️ Scraping Alterra Mountain Company jobs...
✅ Found 50 jobs from Alterra

🎉 Total jobs from all companies: 189
   - Vail Resorts: 139
   - Alterra: 50
```

---

**You now have the most comprehensive ski resort job board scraping both Epic Pass AND Ikon Pass resorts! 🎿⛷️**
