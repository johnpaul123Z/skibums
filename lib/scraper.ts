import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { Job } from './types';

/**
 * Vail Resorts job category URLs
 */
export const VAIL_CATEGORIES = {
  'Ski & Snowboard School': 'https://jobs.vailresortscareers.com/go/Ski-&-Snowboard-School/7906500/',
  'Restaurant Operations': 'https://jobs.vailresortscareers.com/go/Restaurant-Operations/7906600/',
  'Hotel Operations': 'https://jobs.vailresortscareers.com/go/Hotel-Operations/7906700/',
  'Mountain Operations': 'https://jobs.vailresortscareers.com/go/Mountain-Operations/7906300/',
  'Transportation': 'https://jobs.vailresortscareers.com/go/Transportation/7906400/',
  'Retail Operations': 'https://jobs.vailresortscareers.com/go/Retail-Operations/7906800/',
} as const;

export interface ScrapedJob {
  title: string;
  resort: string;
  location: string;
  shiftType: string;
  url: string;
  category: string;
  company: 'Vail' | 'Alterra' | 'Boyne' | 'Powdr' | 'Other';
  description?: string; // Job description summary
}

/**
 * Scrape job description from individual Vail job page
 */
async function scrapeVailJobDescription(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
      timeout: 5000,
    });

    const $ = cheerio.load(response.data);
    
    // Try multiple selectors for job description
    let description = '';
    
    // Look for common job description containers
    const descriptionSelectors = [
      '.job-description',
      '#job-description',
      '[class*="description"]',
      '[class*="job-details"]',
      '.jobdescription',
      'div[itemprop="description"]',
    ];

    for (const selector of descriptionSelectors) {
      const text = $(selector).first().text().trim();
      if (text && text.length > 50) {
        description = text;
        break;
      }
    }

    // If no description found, try to get any paragraph text
    if (!description) {
      const paragraphs = $('p').map((i, el) => $(el).text().trim()).get();
      description = paragraphs.filter(p => p.length > 50).slice(0, 3).join(' ');
    }

    // Truncate to a reasonable length (first 200 characters)
    if (description.length > 200) {
      description = description.substring(0, 200).trim() + '...';
    }

    return description || 'Job description available on application page.';
  } catch (error) {
    console.error(`Error fetching description from ${url}:`, error);
    return 'Click to view full job details.';
  }
}

/**
 * Scrape a single Vail Resorts job category page
 */
export async function scrapeVailCategory(url: string, category: string): Promise<ScrapedJob[]> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });

    const $ = cheerio.load(response.data);
    const jobs: ScrapedJob[] = [];

    // Find the job table rows
    $('table tbody tr').each((index, element) => {
      const $row = $(element);
      
      // Extract job data from table columns
      const titleCell = $row.find('td').eq(0);
      const resortCell = $row.find('td').eq(1);
      const shiftTypeCell = $row.find('td').eq(2);
      const locationCell = $row.find('td').eq(3);

      const title = titleCell.find('a').first().text().trim();
      const jobUrl = titleCell.find('a').first().attr('href') || '';
      const resort = resortCell.text().trim();
      const shiftType = shiftTypeCell.text().trim();
      const location = locationCell.text().trim();

      if (title && resort) {
        jobs.push({
          title,
          resort,
          location,
          shiftType,
          url: jobUrl.startsWith('http') ? jobUrl : `https://jobs.vailresortscareers.com${jobUrl}`,
          category,
          company: 'Vail',
        });
      }
    });

    return jobs;
  } catch (error) {
    console.error(`Error scraping ${category}:`, error);
    return [];
  }
}

/**
 * Scrape all Vail Resorts job categories
 */
export async function scrapeAllVailCategories(): Promise<ScrapedJob[]> {
  const allJobs: ScrapedJob[] = [];
  
  console.log('🎿 Scraping all Vail Resorts job categories...\n');

  for (const [category, url] of Object.entries(VAIL_CATEGORIES)) {
    console.log(`📊 Scraping ${category}...`);
    const jobs = await scrapeVailCategory(url, category);
    console.log(`✅ Found ${jobs.length} jobs in ${category}`);
    allJobs.push(...jobs);
    
    // Be nice to the server - wait 1 second between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n🎉 Total jobs scraped: ${allJobs.length}`);
  return allJobs;
}

/**
 * Legacy function - scrape ski school only
 */
export async function scrapeVailResorts(): Promise<ScrapedJob[]> {
  return scrapeVailCategory(
    VAIL_CATEGORIES['Ski & Snowboard School'],
    'Ski & Snowboard School'
  );
}

/**
 * Convert scraped jobs to our Job format
 */
export function convertToJobFormat(scrapedJobs: ScrapedJob[]): Job[] {
  return scrapedJobs.map((job, index) => {
    // Determine difficulty based on job title
    let difficulty: 1 | 2 | 3 = 1;
    const title = job.title.toLowerCase();
    const category = job.category.toLowerCase();
    
    if (title.includes('certified') || title.includes('lead') || title.includes('coach') || title.includes('senior')) {
      difficulty = 2;
    }
    if (title.includes('director') || title.includes('manager') || title.includes('supervisor') || title.includes('executive')) {
      difficulty = 3;
    }

    // Realistic salary estimates based on ski industry standards
    let salary = 'DOE'; // Depends on Experience
    
    // Management & Directors
    if (difficulty === 3 || title.includes('director') || title.includes('manager')) {
      salary = '$50,000 - $80,000/year';
    }
    // Ski/Snowboard Instructors (most common role)
    else if (title.includes('instructor') || category.includes('ski') || category.includes('snowboard school')) {
      if (title.includes('certified') || title.includes('level 2') || title.includes('level 3')) {
        salary = '$20 - $35/hour'; // Certified instructors earn more
      } else if (title.includes('children') || title.includes('kids')) {
        salary = '$18 - $25/hour'; // Children's instructors
      } else {
        salary = '$16 - $24/hour'; // Entry-level instructors
      }
    }
    // Ski Patrol (higher paying, requires certification)
    else if (title.includes('patrol')) {
      salary = '$18 - $28/hour';
    }
    // Lift Operations
    else if (title.includes('lift') || title.includes('lift operator')) {
      salary = '$15 - $19/hour'; // Entry-level mountain ops
    }
    // Food Service & Restaurants
    else if (category.includes('restaurant') || title.includes('cook') || title.includes('chef') || 
             title.includes('server') || title.includes('bartender') || title.includes('food')) {
      if (title.includes('chef') || title.includes('sous') || title.includes('executive')) {
        salary = '$45,000 - $65,000/year';
      } else if (title.includes('cook') || title.includes('line')) {
        salary = '$16 - $22/hour';
      } else if (title.includes('server') || title.includes('bartender')) {
        salary = '$13 - $16/hour + tips';
      } else {
        salary = '$15 - $19/hour';
      }
    }
    // Retail Operations
    else if (category.includes('retail') || title.includes('retail') || title.includes('shop')) {
      if (title.includes('manager') || title.includes('lead')) {
        salary = '$18 - $25/hour';
      } else {
        salary = '$14 - $18/hour';
      }
    }
    // Hotel & Hospitality
    else if (category.includes('hotel') || title.includes('front desk') || title.includes('housekeeping') || 
             title.includes('guest service') || title.includes('concierge')) {
      if (title.includes('manager')) {
        salary = '$45,000 - $60,000/year';
      } else if (title.includes('front desk') || title.includes('concierge')) {
        salary = '$16 - $22/hour';
      } else {
        salary = '$15 - $19/hour';
      }
    }
    // Transportation (Bus drivers, shuttles)
    else if (category.includes('transportation') || title.includes('driver') || title.includes('shuttle') || title.includes('bus')) {
      salary = '$17 - $24/hour'; // CDL drivers earn more
    }
    // Mountain Operations (Grooming, snowmaking, maintenance)
    else if (category.includes('mountain') || title.includes('groomer') || title.includes('snowmaking') || 
             title.includes('maintenance') || title.includes('mechanic')) {
      if (title.includes('mechanic') || title.includes('groomer')) {
        salary = '$20 - $32/hour'; // Skilled positions
      } else {
        salary = '$16 - $24/hour';
      }
    }
    // Default (misc positions)
    else {
      salary = '$15 - $22/hour';
    }

    // Get resort images
    const resortImages: { [key: string]: string } = {
      'Beaver Creek': 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800&q=80',
      'Vail': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80',
      'Breckenridge': 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80',
      'Heavenly': 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800&q=80',
      'Northstar': 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
      'Kirkwood': 'https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800&q=80',
      'Park City': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'default': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80',
    };

    const resortName = job.resort.split(' ')[0];
    const image = resortImages[resortName] || resortImages['default'];

    // Improved housing detection
    const housingKeywords = ['housing', 'lodging', 'accommodation', 'employee housing', 'dorm'];
    const hasHousing = 
      // Check title and category for housing keywords
      housingKeywords.some(keyword => 
        title.includes(keyword) || 
        category.toLowerCase().includes(keyword)
      ) ||
      // Seasonal positions at major resorts often include housing
      (job.shiftType.toLowerCase().includes('seasonal') && 
       (job.company === 'Vail' || job.company === 'Alterra' || job.company === 'Powdr') &&
       (title.includes('instructor') || title.includes('patrol') || title.includes('lift'))) ||
      // International positions usually include housing
      (title.includes('international') || title.includes('j-1') || title.includes('visa'));

    // More accurate company-specific benefits
    const companyName = job.company === 'Vail' ? 'Vail Resorts' : 
                        job.company === 'Alterra' ? 'Alterra Mountain Company' : 
                        job.company === 'Boyne' ? 'Boyne Resorts' : 
                        job.company === 'Powdr' ? 'Powdr' : 
                        job.company === 'Other' ? job.resort : 'the resort';

    return {
      id: `${job.company?.toLowerCase() || 'job'}-${index + 1}`,
      title: job.title,
      resort: job.resort,
      location: job.location,
      salary,
      type: job.shiftType,
      difficulty,
      image,
      url: job.url,
      company: job.company,
      housing: hasHousing,
      featured: index < 3,
      description: job.description || `Join the team at ${job.resort}! This is an excellent opportunity to work at one of ${companyName}'s world-class ski destinations.`,
      requirements: [
        title.includes('certified') ? 'PSIA/AASI Certification required' : 'Experience preferred',
        category.includes('ski') ? 'Intermediate+ skiing/riding ability' : 'Physical fitness required',
        'Excellent customer service skills',
        'Flexible schedule availability',
      ],
      benefits: [
        job.company === 'Vail' ? 'Free Epic Pass (ski 41+ resorts worldwide)' : 
        job.company === 'Alterra' ? 'Free Ikon Pass (ski 50+ resorts worldwide)' : 
        job.company === 'Powdr' ? 'Season pass at Powdr resorts (Copper, Killington, Snowbird, etc.)' : 
        job.company === 'Other' ? 'Resort benefits' : 
        'Season pass benefits',
        '20-40% retail discounts',
        category.includes('ski') ? 'Free training & certification reimbursement' : 'On-the-job training',
        'Health & wellness benefits',
        ...(hasHousing ? ['Employee housing available or assistance'] : []),
      ],
    };
  });
}

/**
 * Scrape Alterra Mountain Company jobs (Ikon Pass resorts)
 * Uses Puppeteer since it's a client-side rendered site (ChangeState platform)
 */
export async function scrapeAlterraJobs(): Promise<ScrapedJob[]> {
  console.log('🏔️ Scraping Alterra Mountain Company jobs...', ALTERRA_JOBS_URL);

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    await page.goto(ALTERRA_JOBS_URL, {
      waitUntil: 'networkidle0',
      timeout: 45000,
    });

    // Wait for job links or list container (site is JS-rendered)
    await page.waitForSelector('a[href*="/job/"], [class*="job"] a, [class*="listing"] a, [class*="result"] a', { timeout: 20000 })
      .catch(() => console.log('Alterra: job selector not found, will try full page extract'));
    await new Promise((r) => setTimeout(r, 4000));

    // Scroll to trigger lazy-loaded job list
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await new Promise((r) => setTimeout(r, 2000));

    const jobs = await page.evaluate((origin: string) => {
      const scrapedJobs: { title: string; url: string }[] = [];
      const seen = new Set<string>();

      document.querySelectorAll('a[href*="/job/"]').forEach((a) => {
        const href = (a as HTMLAnchorElement).href || a.getAttribute('href') || '';
        const url = href.startsWith('http') ? href : `${origin}${href.startsWith('/') ? href : '/' + href}`;
        if (!url.includes('/job/') || seen.has(url)) return;
        const row = a.closest('li, tr, [role="row"], [class*="job"], [class*="result"], [class*="listing"]');
        const title = (row?.querySelector('[class*="title"], a') as HTMLElement)?.textContent?.trim()
          || (a as HTMLElement).textContent?.trim() || '';
        if (!title || title.length < 2) return;
        seen.add(url);
        scrapedJobs.push({ title: title.trim(), url });
      });

      return scrapedJobs;
    }, 'https://jobs.alterramtnco.com');

    await browser.close();

    // Parse location and resort from title/URL
    const formattedJobs: ScrapedJob[] = jobs.map((job: any) => {
      // Extract resort from URL (e.g., /palisades/job/... → Palisades)
      const urlMatch = job.url.match(/\/([^\/]+)\/job\//);
      const resort = urlMatch ? urlMatch[1].replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : 'Alterra Resort';
      
      return {
        title: job.title,
        resort,
        location: 'Various Locations', // Alterra has 19 resorts
        shiftType: 'Seasonal/Year-round',
        url: job.url,
        category: 'All Departments',
        company: 'Alterra',
      };
    });

    console.log(`✅ Found ${formattedJobs.length} jobs from Alterra`);
    return formattedJobs.slice(0, 80);
  } catch (error) {
    console.error('Error scraping Alterra:', error);
    return [];
  }
}

const ALTERRA_JOBS_URL = 'https://jobs.alterramtnco.com/jobs?qu=&geo=&lo=&dp=';

const BOYNE_JOBS_URL = 'https://careers.boyneresorts.com/all/jobs';

const POWDR_JOBS_URL = 'https://powdr.wd12.myworkdayjobs.com/POWDR_Careers?locations=861bc65ed43610015f9b8f72eceb0000&locations=861bc65ed43610015f9b32f525580000';

const MAMMOTH_JOBS_URL = 'https://alterra.wd1.myworkdayjobs.com/MammothMountain';
const DEER_VALLEY_JOBS_URL = 'https://alterra.wd1.myworkdayjobs.com/DeerValleyResort';
const BIG_BEAR_EMPLOYMENT_URL = 'https://www.bigbearmountainresort.com/employment';
const ADP_JHM_URL = 'https://myjobs.adp.com/jhmremploymentcenter/cx/job-listing';
const SUN_VALLEY_JOBS_URL = 'https://recruiting2.ultipro.com/GRA1027GAMH/JobBoard/fea69ac9-edad-4702-8369-9285d60cc4f0/?q=&o=postedDateDesc';
const PAYCOM_JOBS_URL = 'https://www.paycomonline.net/v4/ats/web.php/portal/90FB33A7DE87561260286F9271F860DB/career-page';

/**
 * Scrape Mammoth Mountain jobs (Alterra Workday)
 */
async function scrapeMammothJobs(): Promise<ScrapedJob[]> {
  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
    await page.goto(MAMMOTH_JOBS_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector('a[href*="/job/"]', { timeout: 15000 }).catch(() => null);
    await new Promise((r) => setTimeout(r, 3000));
    const jobs = await page.evaluate((origin: string) => {
      const out: { title: string; location: string; url: string }[] = [];
      const seen = new Set<string>();
      document.querySelectorAll('a[href*="/job/"]').forEach((a) => {
        const href = (a as HTMLAnchorElement).href || a.getAttribute('href') || '';
        if (!href.includes('/job/') || seen.has(href)) return;
        seen.add(href);
        const title = (a as HTMLElement).textContent?.trim() || '';
        const row = a.closest('li, tr, [role="listitem"]');
        const location = (row?.querySelector('[class*="location"]') as HTMLElement)?.textContent?.trim() || '';
        if (title && title.length > 2) out.push({ title, location, url: href.startsWith('http') ? href : `${origin}${href.startsWith('/') ? href : '/' + href}` });
      });
      return out;
    }, 'https://alterra.wd1.myworkdayjobs.com');
    await browser.close();
    const formatted: ScrapedJob[] = jobs.map((j: { title: string; location: string; url: string }) => ({
      title: j.title,
      resort: 'Mammoth Mountain',
      location: j.location || 'Mammoth Lakes, CA',
      shiftType: 'Seasonal/Year-round',
      url: j.url,
      category: 'All Departments',
      company: 'Alterra',
    }));
    console.log(`✅ Found ${formatted.length} jobs from Mammoth Mountain`);
    return formatted.slice(0, 150);
  } catch (e) {
    console.error('Mammoth scrape failed:', e);
    return [];
  }
}

/**
 * Scrape Deer Valley Resort jobs (Alterra Workday)
 */
async function scrapeDeerValleyJobs(): Promise<ScrapedJob[]> {
  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
    await page.goto(DEER_VALLEY_JOBS_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector('a[href*="/job/"]', { timeout: 15000 }).catch(() => null);
    await new Promise((r) => setTimeout(r, 3000));
    const jobs = await page.evaluate((origin: string) => {
      const out: { title: string; location: string; url: string }[] = [];
      const seen = new Set<string>();
      document.querySelectorAll('a[href*="/job/"]').forEach((a) => {
        const href = (a as HTMLAnchorElement).href || a.getAttribute('href') || '';
        if (!href.includes('/job/') || seen.has(href)) return;
        seen.add(href);
        const title = (a as HTMLElement).textContent?.trim() || '';
        const row = a.closest('li, tr, [role="listitem"]');
        const location = (row?.querySelector('[class*="location"]') as HTMLElement)?.textContent?.trim() || '';
        if (title && title.length > 2) out.push({ title, location, url: href.startsWith('http') ? href : `${origin}${href.startsWith('/') ? href : '/' + href}` });
      });
      return out;
    }, 'https://alterra.wd1.myworkdayjobs.com');
    await browser.close();
    const formatted: ScrapedJob[] = jobs.map((j: { title: string; location: string; url: string }) => ({
      title: j.title,
      resort: 'Deer Valley Resort',
      location: j.location || 'Park City, UT',
      shiftType: 'Seasonal/Year-round',
      url: j.url,
      category: 'All Departments',
      company: 'Alterra',
    }));
    console.log(`✅ Found ${formatted.length} jobs from Deer Valley Resort`);
    return formatted.slice(0, 150);
  } catch (e) {
    console.error('Deer Valley scrape failed:', e);
    return [];
  }
}

/**
 * Scrape Big Bear Mountain Resort employment page (Alterra).
 * This page is mostly informational, so we capture application/career links and
 * always include at least one canonical apply entry.
 */
async function scrapeBigBearJobs(): Promise<ScrapedJob[]> {
  try {
    const { data } = await axios.get(BIG_BEAR_EMPLOYMENT_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
      timeout: 20000,
    });
    const $ = cheerio.load(data);
    const jobs: ScrapedJob[] = [];
    const seen = new Set<string>();

    $('a[href]').each((_, el) => {
      const href = $(el).attr('href')?.trim();
      const text = $(el).text().trim();
      if (!href) return;
      const url = href.startsWith('http') ? href : `https://www.bigbearmountainresort.com${href.startsWith('/') ? href : '/' + href}`;
      const lower = `${url} ${text}`.toLowerCase();
      if (seen.has(url)) return;
      if (
        lower.includes('apply') ||
        lower.includes('employment') ||
        lower.includes('career') ||
        lower.includes('job')
      ) {
        seen.add(url);
        jobs.push({
          title: text && text.length > 2 ? text : 'Apply to Work at Big Bear Mountain Resort',
          resort: 'Big Bear Mountain Resort',
          location: 'Big Bear Lake, CA',
          shiftType: 'Seasonal/Year-round',
          url,
          category: 'All Departments',
          company: 'Alterra',
        });
      }
    });

    // Ensure at least one actionable entry even when page only has informational copy
    if (!jobs.length) {
      jobs.push({
        title: 'Apply to Work at Big Bear Mountain Resort',
        resort: 'Big Bear Mountain Resort',
        location: 'Big Bear Lake, CA',
        shiftType: 'Seasonal/Year-round',
        url: BIG_BEAR_EMPLOYMENT_URL,
        category: 'All Departments',
        company: 'Alterra',
      });
    }

    console.log(`✅ Found ${jobs.length} Big Bear employment entries`);
    return jobs.slice(0, 40);
  } catch (e) {
    console.error('Big Bear scrape failed:', e);
    return [];
  }
}

/**
 * Scrape ADP JHM (Jackson Hole Mountain Resort) job listing
 */
async function scrapeADPJHMJobs(): Promise<ScrapedJob[]> {
  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
    await page.goto(ADP_JHM_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 4000));
    const jobs = await page.evaluate(() => {
      const out: { title: string; url: string }[] = [];
      const seen = new Set<string>();
      document.querySelectorAll('a[href*="/job/"], a[href*="job-listing"]').forEach((a) => {
        const href = (a as HTMLAnchorElement).href || '';
        if (!href || seen.has(href)) return;
        const title = (a as HTMLElement).textContent?.trim() || '';
        if (title && title.length > 3 && title.length < 150) { seen.add(href); out.push({ title, url: href }); }
      });
      return out;
    });
    await browser.close();
    const formatted: ScrapedJob[] = jobs.map((j: { title: string; url: string }) => ({
      title: j.title,
      resort: 'Jackson Hole Mountain Resort',
      location: 'Teton Village, WY',
      shiftType: 'Seasonal/Year-round',
      url: j.url,
      category: 'All Departments',
      company: 'Other',
    }));
    console.log(`✅ Found ${formatted.length} jobs from Jackson Hole (ADP)`);
    return formatted.slice(0, 150);
  } catch (e) {
    console.error('ADP JHM scrape failed:', e);
    return [];
  }
}

/**
 * Scrape Sun Valley Resort jobs (UltiPro)
 */
async function scrapeSunValleyJobs(): Promise<ScrapedJob[]> {
  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
    await page.goto(SUN_VALLEY_JOBS_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 4000));
    const jobs = await page.evaluate(() => {
      const out: { title: string; url: string }[] = [];
      const seen = new Set<string>();
      document.querySelectorAll('a[href*="JobBoard"], a[href*="job"]').forEach((a) => {
        const href = (a as HTMLAnchorElement).href || '';
        if (!href || seen.has(href) || !href.includes('JobBoard')) return;
        const title = (a as HTMLElement).textContent?.trim() || '';
        if (title && title.length > 3 && title.length < 150) { seen.add(href); out.push({ title, url: href }); }
      });
      return out;
    });
    await browser.close();
    const formatted: ScrapedJob[] = jobs.map((j: { title: string; url: string }) => ({
      title: j.title,
      resort: 'Sun Valley Resort',
      location: 'Sun Valley, ID',
      shiftType: 'Seasonal/Year-round',
      url: j.url,
      category: 'All Departments',
      company: 'Other',
    }));
    console.log(`✅ Found ${formatted.length} jobs from Sun Valley`);
    return formatted.slice(0, 150);
  } catch (e) {
    console.error('Sun Valley scrape failed:', e);
    return [];
  }
}

/**
 * Scrape Paycom career page (resort TBD from page)
 */
async function scrapePaycomJobs(): Promise<ScrapedJob[]> {
  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
    await page.goto(PAYCOM_JOBS_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 4000));
    const jobs = await page.evaluate(() => {
      const out: { title: string; url: string }[] = [];
      const seen = new Set<string>();
      document.querySelectorAll('a[href*="career"], a[href*="job"]').forEach((a) => {
        const href = (a as HTMLAnchorElement).href || '';
        if (!href || seen.has(href)) return;
        const title = (a as HTMLElement).textContent?.trim() || '';
        if (title && title.length > 3 && title.length < 150) { seen.add(href); out.push({ title, url: href }); }
      });
      return out;
    });
    await browser.close();
    const formatted: ScrapedJob[] = jobs.map((j: { title: string; url: string }) => ({
      title: j.title,
      resort: 'Resort',
      location: 'Various',
      shiftType: 'Seasonal/Year-round',
      url: j.url,
      category: 'All Departments',
      company: 'Other',
    }));
    console.log(`✅ Found ${formatted.length} jobs from Paycom portal`);
    return formatted.slice(0, 100);
  } catch (e) {
    console.error('Paycom scrape failed:', e);
    return [];
  }
}

/**
 * Scrape Boyne Resorts jobs from https://careers.boyneresorts.com/all/jobs
 * Uses Puppeteer since it's a JavaScript-rendered site (Angular)
 */
export async function scrapeBoyneJobs(): Promise<ScrapedJob[]> {
  console.log('⛷️ Scraping Boyne Resorts jobs...', BOYNE_JOBS_URL);
  
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
    
    await page.goto(BOYNE_JOBS_URL, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    await page.waitForSelector('a[href*="/job"], .job-item, .job-listing, [class*="job"], .search-result-item, table tbody tr', { 
      timeout: 20000 
    }).catch(() => console.log('Job selector not found, trying to extract anyway'));

    await new Promise(resolve => setTimeout(resolve, 3000));

    const jobs = await page.evaluate((baseUrl: string) => {
      const scrapedJobs: any[] = [];
      const seen = new Set<string>();

      const addJob = (href: string, title: string, location: string) => {
        const url = href.startsWith('http') ? href : `${baseUrl.replace(/\/all\/jobs\/?$/, '')}${href.startsWith('/') ? href : '/' + href}`;
        if (!url.includes('/job') || seen.has(url)) return;
        seen.add(url);
        if (title && title.length > 2) {
          scrapedJobs.push({ title: title.trim(), location: location.trim(), url });
        }
      };

      document.querySelectorAll('a[href*="/job"]').forEach((a) => {
        const href = (a as HTMLAnchorElement).href || a.getAttribute('href') || '';
        const title = a.textContent?.trim() || (a.querySelector('.job-title, .jobtitle, h2, h3, [class*="title"]') as HTMLElement)?.textContent?.trim() || '';
        const row = a.closest('tr, .job-item, .search-result-item, [class*="job"]');
        const location = row ? (row.querySelector('.job-location, .location, [class*="location"]') as HTMLElement)?.textContent?.trim() || '' : '';
        addJob(href, title, location);
      });

      document.querySelectorAll('tr a[href*="/job"], .job-item a, .search-result-item a').forEach((a) => {
        const href = (a as HTMLAnchorElement).href || a.getAttribute('href') || '';
        const row = a.closest('tr, .job-item, .search-result-item');
        const title = (row?.querySelector('.job-title, .jobtitle, h2, h3, [class*="title"], a') as HTMLElement)?.textContent?.trim() || (a as HTMLElement).textContent?.trim() || '';
        const location = (row?.querySelector('.job-location, .location, [class*="location"]') as HTMLElement)?.textContent?.trim() || '';
        addJob(href, title, location);
      });

      return scrapedJobs;
    }, BOYNE_JOBS_URL);

    await browser.close();

    // Boyne Resorts list
    const boyneResorts = [
      'Big Sky', 'Boyne Mountain', 'Brighton', 'Cypress Mountain',
      'Loon Mountain', 'Sugarloaf', 'Summit at Snoqualmie', 'Sunday River'
    ];

    // Parse and format jobs
    const formattedJobs: ScrapedJob[] = jobs.map((job: any) => {
      // Try to extract resort from location or title
      let resort = 'Boyne Resort';
      for (const r of boyneResorts) {
        if (job.location?.toLowerCase().includes(r.toLowerCase()) || 
            job.title?.toLowerCase().includes(r.toLowerCase())) {
          resort = r;
          break;
        }
      }
      
      return {
        title: job.title,
        resort,
        location: job.location || 'Various Locations',
        shiftType: 'Seasonal/Year-round',
        url: job.url,
        category: 'All Departments',
        company: 'Boyne',
      };
    });

    console.log(`✅ Found ${formattedJobs.length} jobs from Boyne Resorts`);
    return formattedJobs.slice(0, 150);
  } catch (error) {
    console.error('Error scraping Boyne:', error);
    return [];
  }
}

/** Run a promise with a timeout; on timeout return fallback (e.g. []). */
function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

/**
 * Alterra fallback: fetch HTML with axios and parse job links (no Puppeteer).
 */
async function scrapeAlterraJobsAxios(): Promise<ScrapedJob[]> {
  try {
    const { data } = await axios.get(ALTERRA_JOBS_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
      timeout: 15000,
    });
    const $ = cheerio.load(data);
    const jobs: ScrapedJob[] = [];
    $('a[href*="/job/"]').each((_, el) => {
      const href = $(el).attr('href')?.trim();
      const title = $(el).text().trim();
      if (href && title && title.length > 2) {
        const url = href.startsWith('http') ? href : `https://jobs.alterramtnco.com${href}`;
        const urlMatch = url.match(/\/([^/]+)\/job\//);
        const resort = urlMatch ? urlMatch[1].replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : 'Alterra Resort';
        jobs.push({
          title,
          resort,
          location: 'Various Locations',
          shiftType: 'Seasonal/Year-round',
          url,
          category: 'All Departments',
          company: 'Alterra',
        });
      }
    });
    const seen = new Set<string>();
    const unique = jobs.filter((j) => {
      const key = j.url;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    console.log(`✅ Alterra (axios fallback): ${unique.length} jobs`);
    return unique.slice(0, 80);
  } catch (e) {
    console.error('Alterra axios fallback failed:', e);
    return [];
  }
}

/**
 * Boyne fallback: fetch HTML with axios and parse job links (no Puppeteer).
 */
async function scrapeBoyneJobsAxios(): Promise<ScrapedJob[]> {
  try {
    const { data } = await axios.get(BOYNE_JOBS_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
      timeout: 15000,
    });
    const $ = cheerio.load(data);
    const jobs: ScrapedJob[] = [];
    const seen = new Set<string>();
    $('a[href*="/job"]').each((_, el) => {
      const href = $(el).attr('href')?.trim();
      const title = $(el).text().trim() || $(el).find('.job-title, .jobtitle, [class*="title"]').text().trim();
      if (href && title && title.length > 2) {
        const url = href.startsWith('http') ? href : `https://careers.boyneresorts.com${href.startsWith('/') ? href : '/' + href}`;
        if (seen.has(url)) return;
        seen.add(url);
        jobs.push({
          title,
          resort: 'Boyne Resort',
          location: 'Various Locations',
          shiftType: 'Seasonal/Year-round',
          url,
          category: 'All Departments',
          company: 'Boyne',
        });
      }
    });
    console.log(`✅ Boyne (axios fallback): ${jobs.length} jobs`);
    return jobs.slice(0, 150);
  } catch (e) {
    console.error('Boyne axios fallback failed:', e);
    return [];
  }
}

/**
 * Scrape Powdr jobs (Workday) - Copper, Killington, Snowbird, etc.
 * Uses Puppeteer; Workday career pages are JS-rendered.
 */
export async function scrapePowdrJobs(): Promise<ScrapedJob[]> {
  console.log('🏂 Scraping Powdr jobs (Workday)...', POWDR_JOBS_URL);
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
    await page.goto(POWDR_JOBS_URL, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });
    await page.waitForSelector('a[href*="/job/"], [data-automation-id="jobPosting"], li[class*="job"], .wd-List', { timeout: 20000 })
      .catch(() => console.log('Powdr: job list selector not found, extracting anyway'));
    await new Promise((r) => setTimeout(r, 3000));

    const baseUrl = 'https://powdr.wd12.myworkdayjobs.com';
    const jobs = await page.evaluate((origin: string) => {
      const out: { title: string; location: string; url: string }[] = [];
      const seen = new Set<string>();
      document.querySelectorAll('a[href*="/job/"]').forEach((a) => {
        const href = (a as HTMLAnchorElement).href || a.getAttribute('href') || '';
        if (!href.includes('/job/') || seen.has(href)) return;
        seen.add(href);
        const title = (a.textContent?.trim() || a.closest('li')?.querySelector('[data-automation-id="jobPosting"]')?.textContent?.trim() || a.closest('tr')?.querySelector('td')?.textContent?.trim() || '').trim();
        const row = a.closest('li, tr, [role="listitem"]');
        const location = (row?.querySelector('[data-automation-id="locations"], .location, [class*="location"]') as HTMLElement)?.textContent?.trim() || '';
        if (title && title.length > 2) {
          out.push({ title, location, url: href.startsWith('http') ? href : `${origin}${href.startsWith('/') ? href : '/' + href}` });
        }
      });
      return out;
    }, baseUrl);
    await browser.close();

    const powdrResorts = ['Copper', 'Killington', 'Snowbird', 'Boreal', 'Soda Springs', 'Mt. Bachelor', 'Lee Canyon', 'Woodward'];
    const formatted: ScrapedJob[] = jobs.map((j: { title: string; location: string; url: string }) => {
      let resort = 'Powdr Resort';
      for (const r of powdrResorts) {
        if ((j.location || j.title).toLowerCase().includes(r.toLowerCase().replace(' ', '')) || j.title.toLowerCase().includes(r.toLowerCase())) {
          resort = r;
          break;
        }
      }
      return {
        title: j.title,
        resort,
        location: j.location || 'Various Locations',
        shiftType: 'Seasonal/Year-round',
        url: j.url,
        category: 'All Departments',
        company: 'Powdr',
      };
    });
    console.log(`✅ Found ${formatted.length} jobs from Powdr`);
    return formatted.slice(0, 200);
  } catch (error) {
    console.error('Error scraping Powdr:', error);
    return [];
  }
}

/**
 * Powdr fallback: fetch Workday HTML with axios and parse job links.
 */
async function scrapePowdrJobsAxios(): Promise<ScrapedJob[]> {
  try {
    const { data } = await axios.get(POWDR_JOBS_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
      timeout: 15000,
    });
    const $ = cheerio.load(data);
    const jobs: ScrapedJob[] = [];
    const seen = new Set<string>();
    $('a[href*="/job/"]').each((_, el) => {
      const href = $(el).attr('href')?.trim();
      const title = $(el).text().trim() || $(el).closest('li').find('[data-automation-id="jobPosting"]').text().trim();
      if (href && title && title.length > 2) {
        const url = href.startsWith('http') ? href : `https://powdr.wd12.myworkdayjobs.com${href.startsWith('/') ? href : '/' + href}`;
        if (seen.has(url)) return;
        seen.add(url);
        jobs.push({
          title,
          resort: 'Powdr Resort',
          location: 'Various Locations',
          shiftType: 'Seasonal/Year-round',
          url,
          category: 'All Departments',
          company: 'Powdr',
        });
      }
    });
    console.log(`✅ Powdr (axios fallback): ${jobs.length} jobs`);
    return jobs.slice(0, 200);
  } catch (e) {
    console.error('Powdr axios fallback failed:', e);
    return [];
  }
}

/**
 * Scrape all jobs from Vail, Alterra, Boyne, Powdr, Mammoth, Jackson Hole (ADP), Sun Valley (UltiPro), and Paycom.
 * All new sources are included in the 2 AM refresh and DB.
 */
export async function scrapeAllResorts(): Promise<ScrapedJob[]> {
  console.log('⛷️ Scraping ALL resort companies...\n');

  const VailPromise = scrapeAllVailCategories();
  const AlterraPromise = withTimeout(scrapeAlterraJobs(), 1000 * 90, [] as ScrapedJob[]);
  const BoynePromise = withTimeout(scrapeBoyneJobs(), 1000 * 90, [] as ScrapedJob[]);
  const PowdrPromise = withTimeout(scrapePowdrJobs(), 1000 * 90, [] as ScrapedJob[]);
  const MammothPromise = withTimeout(scrapeMammothJobs(), 1000 * 60, [] as ScrapedJob[]);
  const DeerValleyPromise = withTimeout(scrapeDeerValleyJobs(), 1000 * 60, [] as ScrapedJob[]);
  const BigBearPromise = withTimeout(scrapeBigBearJobs(), 1000 * 45, [] as ScrapedJob[]);
  const JHMPromise = withTimeout(scrapeADPJHMJobs(), 1000 * 60, [] as ScrapedJob[]);
  const SunValleyPromise = withTimeout(scrapeSunValleyJobs(), 1000 * 60, [] as ScrapedJob[]);
  const PaycomPromise = withTimeout(scrapePaycomJobs(), 1000 * 60, [] as ScrapedJob[]);

  let [vailJobs, alterraJobs, boyneJobs, powdrJobs, mammothJobs, deerValleyJobs, bigBearJobs, jhmJobs, sunValleyJobs, paycomJobs] = await Promise.all([
    VailPromise, AlterraPromise, BoynePromise, PowdrPromise, MammothPromise, DeerValleyPromise, BigBearPromise, JHMPromise, SunValleyPromise, PaycomPromise,
  ]);

  if (alterraJobs.length === 0) {
    console.log('🔄 Alterra Puppeteer returned 0, trying axios fallback...');
    alterraJobs = await scrapeAlterraJobsAxios();
  }
  if (boyneJobs.length === 0) {
    console.log('🔄 Boyne Puppeteer returned 0, trying axios fallback...');
    boyneJobs = await scrapeBoyneJobsAxios();
  }
  if (powdrJobs.length === 0) {
    console.log('🔄 Powdr Puppeteer returned 0, trying axios fallback...');
    powdrJobs = await scrapePowdrJobsAxios();
  }

  const allJobs = [...vailJobs, ...alterraJobs, ...boyneJobs, ...powdrJobs, ...mammothJobs, ...deerValleyJobs, ...bigBearJobs, ...jhmJobs, ...sunValleyJobs, ...paycomJobs];
  console.log(`\n🎉 Total jobs from all companies: ${allJobs.length}`);
  console.log(`   - Vail Resorts: ${vailJobs.length}`);
  console.log(`   - Alterra: ${alterraJobs.length}`);
  console.log(`   - Boyne: ${boyneJobs.length}`);
  console.log(`   - Powdr: ${powdrJobs.length}`);
  console.log(`   - Mammoth Mountain: ${mammothJobs.length}`);
  console.log(`   - Deer Valley Resort: ${deerValleyJobs.length}`);
  console.log(`   - Big Bear Mountain Resort: ${bigBearJobs.length}`);
  console.log(`   - Jackson Hole (ADP): ${jhmJobs.length}`);
  console.log(`   - Sun Valley: ${sunValleyJobs.length}`);
  console.log(`   - Paycom: ${paycomJobs.length}`);

  return allJobs;
}

/**
 * Main function to fetch and convert jobs from all categories
 */
export async function fetchAllVailJobsData(): Promise<Job[]> {
  console.log('🎿 Scraping all Vail Resorts job categories...');
  const scrapedJobs = await scrapeAllVailCategories();
  console.log(`✅ Found ${scrapedJobs.length} total jobs`);
  
  const convertedJobs = convertToJobFormat(scrapedJobs);
  return convertedJobs;
}

/**
 * Fetch jobs from ALL resort companies (Vail + Alterra)
 */
export async function fetchAllResortJobs(): Promise<Job[]> {
  const scrapedJobs = await scrapeAllResorts();
  const convertedJobs = convertToJobFormat(scrapedJobs);
  return convertedJobs;
}

/**
 * Legacy function - fetch ski school jobs only
 */
export async function fetchVailJobsData(): Promise<Job[]> {
  console.log('🎿 Scraping Vail Resorts job listings...');
  const scrapedJobs = await scrapeVailResorts();
  console.log(`✅ Found ${scrapedJobs.length} jobs`);
  
  const convertedJobs = convertToJobFormat(scrapedJobs);
  return convertedJobs;
}

// Example usage
if (require.main === module) {
  fetchAllVailJobsData().then((jobs) => {
    console.log('\n📊 Scraped Jobs by Category:');
    
    // Group by category
    const jobsByCategory: { [key: string]: Job[] } = {};
    jobs.forEach((job) => {
      const cat = job.description?.includes('Ski & Snowboard') ? 'Ski School' : 'Other';
      if (!jobsByCategory[cat]) jobsByCategory[cat] = [];
      jobsByCategory[cat].push(job);
    });
    
    Object.entries(jobsByCategory).forEach(([category, categoryJobs]) => {
      console.log(`\n${category}: ${categoryJobs.length} jobs`);
      categoryJobs.slice(0, 3).forEach((job) => {
        console.log(`  - ${job.title} at ${job.resort}`);
      });
    });
  });
}
