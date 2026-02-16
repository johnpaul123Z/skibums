/**
 * API Route to fetch scraped jobs from Vail, Alterra, and Boyne
 * GET /api/jobs/scrape - Vail Ski School only
 * GET /api/jobs/scrape?category=all - All Vail categories
 * GET /api/jobs/scrape?category=alterra - Alterra only
 * GET /api/jobs/scrape?category=boyne - Boyne only
 * GET /api/jobs/scrape?category=everything - Vail + Alterra + Boyne (all jobs!)
 */

import { NextResponse } from 'next/server';
import { 
  scrapeAllVailCategories, 
  scrapeVailResorts,
  scrapeAlterraJobs,
  scrapeBoyneJobs,
  scrapeAllResorts,
  VAIL_CATEGORIES,
  convertToJobFormat
} from '@/lib/scraper';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let scrapedJobs;
    let source = 'Vail Resorts';

    if (category === 'everything') {
      // Scrape ALL: Vail, Alterra, and Boyne
      scrapedJobs = await scrapeAllResorts();
      source = 'Vail Resorts + Alterra + Boyne Resorts';
    } else if (category === 'alterra') {
      // Scrape Alterra only
      scrapedJobs = await scrapeAlterraJobs();
      source = 'Alterra Mountain Company';
    } else if (category === 'boyne') {
      // Scrape Boyne only
      scrapedJobs = await scrapeBoyneJobs();
      source = 'Boyne Resorts';
    } else if (category === 'all') {
      // Scrape all Vail categories
      scrapedJobs = await scrapeAllVailCategories();
      source = 'Vail Resorts (All Departments)';
    } else {
      // Default: scrape Vail ski school only
      scrapedJobs = await scrapeVailResorts();
      source = 'Vail Resorts (Ski School)';
    }

    const jobs = convertToJobFormat(scrapedJobs);
    
    return NextResponse.json({
      success: true,
      count: jobs.length,
      source,
      categories: category === 'all' ? Object.keys(VAIL_CATEGORIES) : undefined,
      jobs,
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
