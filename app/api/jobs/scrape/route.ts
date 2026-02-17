/**
 * API Route to fetch scraped jobs from Vail, Alterra, Boyne, and Powdr
 * GET /api/jobs/scrape - Vail Ski School only
 * GET /api/jobs/scrape?category=all - All Vail categories
 * GET /api/jobs/scrape?category=alterra - Alterra only
 * GET /api/jobs/scrape?category=boyne - Boyne only
 * GET /api/jobs/scrape?category=powdr - Powdr only
 * GET /api/jobs/scrape?category=everything - Vail + Alterra + Boyne + Powdr (all jobs!)
 *
 * Jobs are scraped at most once per day. Responses are cached in-memory (24 hours)
 * and sent with Cache-Control so browser/CDN can cache for 24 hours too.
 */

import { NextResponse } from 'next/server';
import { 
  scrapeAllVailCategories, 
  scrapeVailResorts,
  scrapeAlterraJobs,
  scrapeBoyneJobs,
  scrapePowdrJobs,
  scrapeAllResorts,
  VAIL_CATEGORIES,
  convertToJobFormat
} from '@/lib/scraper';

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours — scrape at most once per day

type CachedPayload = {
  success: true;
  count: number;
  source: string;
  jobs: ReturnType<typeof convertToJobFormat>;
  categories?: string[];
};

let cache: { data: CachedPayload; expiresAt: number } | null = null;

function getCached(category: string | null): CachedPayload | null {
  if (category !== 'everything' || !cache) return null;
  if (Date.now() >= cache.expiresAt) {
    cache = null;
    return null;
  }
  return cache.data;
}

function setCached(data: CachedPayload) {
  cache = { data, expiresAt: Date.now() + CACHE_TTL_MS };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    // Return cached response for "everything" to make loads fast
    const cached = getCached(category);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
        },
      });
    }

    let scrapedJobs;
    let source = 'Vail Resorts';

    if (category === 'everything') {
      scrapedJobs = await scrapeAllResorts();
      source = 'Vail Resorts + Alterra + Boyne Resorts + Powdr';
    } else if (category === 'alterra') {
      scrapedJobs = await scrapeAlterraJobs();
      source = 'Alterra Mountain Company';
    } else if (category === 'boyne') {
      scrapedJobs = await scrapeBoyneJobs();
      source = 'Boyne Resorts';
    } else if (category === 'powdr') {
      scrapedJobs = await scrapePowdrJobs();
      source = 'Powdr';
    } else if (category === 'all') {
      scrapedJobs = await scrapeAllVailCategories();
      source = 'Vail Resorts (All Departments)';
    } else {
      scrapedJobs = await scrapeVailResorts();
      source = 'Vail Resorts (Ski School)';
    }

    const jobs = convertToJobFormat(scrapedJobs);
    const payload: CachedPayload = {
      success: true,
      count: jobs.length,
      source,
      categories: category === 'all' ? Object.keys(VAIL_CATEGORIES) : undefined,
      jobs,
    };

    if (category === 'everything') {
      const hasMultipleSources = new Set(jobs.map((j: { company?: string }) => j.company)).size > 1;
      if (hasMultipleSources || jobs.length === 0) {
        setCached(payload);
      }
    }

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
