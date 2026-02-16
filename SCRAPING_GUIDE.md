# 🕷️ Web Scraping Guide

## Scraping Vail Resorts Jobs

We've added a web scraper to fetch real job listings from Vail Resorts!

---

## 🚀 Quick Start

### Option 1: Use the API Route

```bash
# Start your dev server
npm run dev

# In another terminal or browser, fetch jobs:
curl http://localhost:3000/api/jobs/scrape
```

### Option 2: Run the Scraper Directly

```bash
# Run the scraper script
npx tsx lib/scraper.ts
```

---

## 📁 Files Created

1. **`lib/scraper.ts`** - Main scraping logic
2. **`app/api/jobs/scrape/route.ts`** - API endpoint

---

## 🎯 How It Works

### 1. Scrape Jobs

```typescript
import { scrapeVailResorts } from '@/lib/scraper';

const jobs = await scrapeVailResorts();
// Returns: ScrapedJob[] with title, resort, location, etc.
```

### 2. Convert to Your Format

```typescript
import { convertToJobFormat } from '@/lib/scraper';

const formattedJobs = convertToJobFormat(scrapedJobs);
// Returns: Job[] in your app's format
```

### 3. Use in Your App

```typescript
import { fetchVailJobsData } from '@/lib/scraper';

const jobs = await fetchVailJobsData();
// Ready to display in your UI!
```

---

## 🔄 Using Scraped Jobs in Your App

### Replace Sample Data

```typescript
// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { fetchVailJobsData } from "@/lib/scraper";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      const scrapedJobs = await fetchVailJobsData();
      setJobs(scrapedJobs);
      setLoading(false);
    };
    loadJobs();
  }, []);

  if (loading) return <div>Loading jobs...</div>;

  return (
    // Your existing UI with {jobs}
  );
}
```

### Or Fetch from API

```typescript
// In any component
const response = await fetch('/api/jobs/scrape');
const data = await response.json();
const jobs = data.jobs;
```

---

## 🎨 What Gets Scraped

From the Vail Resorts page, we extract:

- ✅ **Job Title** - "Certified Ski Instructor", etc.
- ✅ **Resort** - "Beaver Creek", "Northstar", etc.
- ✅ **Location** - "Beaver Creek, CO"
- ✅ **Shift Type** - "Winter Seasonal 2025/2026"
- ✅ **Job URL** - Direct link to application

Then we enhance it with:

- 💎 **Difficulty Rating** - Based on title (certified = higher)
- 💵 **Salary Range** - Based on certification level
- 🖼️ **Resort Image** - High-quality stock photos
- 📝 **Description** - Auto-generated
- ✅ **Requirements** - Based on job type
- 🎁 **Benefits** - Vail Resorts perks

---

## 🎯 Example Output

```json
{
  "success": true,
  "count": 14,
  "jobs": [
    {
      "id": "vail-1",
      "title": "Certified Ski Instructor",
      "resort": "Beaver Creek Ski Resort",
      "location": "Beaver Creek, CO, US",
      "salary": "$25 - $35/hour",
      "type": "Winter Seasonal 2025/2026",
      "difficulty": 2,
      "image": "https://images.unsplash.com/...",
      "featured": true,
      "description": "Join the team at Beaver Creek...",
      "requirements": [
        "PSIA/AASI Certification required",
        "Blue+ level skiing ability",
        "..."
      ],
      "benefits": [
        "Free Epic Pass",
        "40% retail discount",
        "..."
      ]
    }
  ]
}
```

---

## 🔧 Customization

### Change Salary Ranges

```typescript
// lib/scraper.ts
let salary = '$22 - $30/hour'; // Your custom range
if (title.includes('certified')) {
  salary = '$28 - $38/hour';
}
```

### Add More Resorts

```typescript
const resortImages: { [key: string]: string } = {
  'Beaver Creek': 'your-image-url',
  'Your Resort': 'another-image',
  // Add more...
};
```

### Adjust Difficulty

```typescript
let difficulty: 1 | 2 | 3 = 1;

if (title.includes('lead') || title.includes('senior')) {
  difficulty = 2;
}
if (title.includes('manager') || title.includes('director')) {
  difficulty = 3;
}
```

---

## 🔄 Automatic Updates

### Refresh Jobs Periodically

```typescript
// app/api/jobs/scrape/route.ts
export const revalidate = 3600; // Refresh every hour

export async function GET() {
  const jobs = await fetchVailJobsData();
  return NextResponse.json({ jobs });
}
```

### Or Use React Query

```bash
npm install @tanstack/react-query
```

```typescript
import { useQuery } from '@tanstack/react-query';

function JobsList() {
  const { data, isLoading } = useQuery({
    queryKey: ['vail-jobs'],
    queryFn: () => fetch('/api/jobs/scrape').then(r => r.json()),
    refetchInterval: 3600000, // 1 hour
  });

  return <>{/* Your UI */}</>;
}
```

---

## 🎭 Advanced: Scrape Multiple Sites

### Add More Scrapers

```typescript
// lib/scraper.ts

export async function scrapeAlterra(): Promise<ScrapedJob[]> {
  // Scrape Alterra resorts (Ikon Pass)
}

export async function scrapePowdr(): Promise<ScrapedJob[]> {
  // Scrape Powdr Corp resorts
}

export async function scrapeAllResorts(): Promise<Job[]> {
  const [vail, alterra, powdr] = await Promise.all([
    scrapeVailResorts(),
    scrapeAlterra(),
    scrapePowdr(),
  ]);

  const all = [...vail, ...alterra, ...powdr];
  return convertToJobFormat(all);
}
```

---

## ⚠️ Important Notes

### Rate Limiting

Be respectful! Add delays between requests:

```typescript
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Between requests
await delay(1000); // Wait 1 second
```

### Caching

Don't scrape every request. Cache results:

```typescript
let cachedJobs: Job[] | null = null;
let lastFetch: number = 0;

export async function fetchVailJobsData(): Promise<Job[]> {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  if (cachedJobs && (now - lastFetch) < oneHour) {
    return cachedJobs; // Return cached data
  }

  const jobs = await scrapeVailResorts();
  cachedJobs = convertToJobFormat(jobs);
  lastFetch = now;
  return cachedJobs;
}
```

### Error Handling

Websites change! Have fallbacks:

```typescript
try {
  const jobs = await fetchVailJobsData();
  return jobs;
} catch (error) {
  console.error('Scraping failed, using fallback data');
  return sampleJobs; // Your existing sample data
}
```

---

## 🧪 Testing

```bash
# Test the scraper
npx tsx lib/scraper.ts

# Test the API route
npm run dev
curl http://localhost:3000/api/jobs/scrape | jq
```

---

## 📊 Next Steps

1. **Test it**: Run `npx tsx lib/scraper.ts`
2. **Check API**: Visit `http://localhost:3000/api/jobs/scrape`
3. **Integrate**: Replace sample jobs in `app/page.tsx`
4. **Add caching**: Implement caching for better performance
5. **Add more sites**: Scrape Alterra, Powdr, independent resorts

---

## 🎯 Pro Tips

1. **Use a headless browser** for JS-heavy sites (Puppeteer/Playwright)
2. **Respect robots.txt** - Check site policies
3. **Add delays** between requests (1-2 seconds)
4. **Cache aggressively** - Don't scrape on every page load
5. **Have fallbacks** - Use sample data if scraping fails
6. **Monitor changes** - Websites update their HTML

---

## 🔐 Legal Note

Web scraping public job listings is generally acceptable, but:

- Don't overwhelm servers (rate limit)
- Respect robots.txt
- Cache data (don't scrape repeatedly)
- Consider using official APIs when available
- Check each site's Terms of Service

---

**Now you have REAL jobs from Vail Resorts! 🎿**

Run `npx tsx lib/scraper.ts` to see it in action!
