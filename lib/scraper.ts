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
  company: 'Vail' | 'Alterra' | 'Boyne';
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

    // Improved salary logic based on job type and category
    let salary = 'Competitive';
    
    // Management positions
    if (difficulty === 3) {
      salary = '$45,000 - $75,000/year';
    }
    // Ski/Snowboard Instructors
    else if (title.includes('instructor') || category.includes('ski') || category.includes('snowboard')) {
      if (title.includes('certified') || difficulty === 2) {
        salary = '$25 - $35/hour';
      } else {
        salary = '$18 - $28/hour';
      }
    }
    // Lift Operations
    else if (title.includes('lift') || title.includes('operator')) {
      salary = '$16 - $22/hour';
    }
    // Food & Beverage / Restaurant
    else if (category.includes('restaurant') || category.includes('food') || category.includes('beverage') || 
             title.includes('cook') || title.includes('chef') || title.includes('server') || title.includes('bartender')) {
      if (title.includes('chef') || title.includes('manager')) {
        salary = '$18 - $28/hour';
      } else {
        salary = '$15 - $20/hour + tips';
      }
    }
    // Retail
    else if (category.includes('retail') || title.includes('retail')) {
      salary = '$15 - $22/hour';
    }
    // Hotel/Hospitality
    else if (category.includes('hotel') || category.includes('hospitality') || title.includes('front desk') || title.includes('housekeeping')) {
      salary = '$16 - $24/hour';
    }
    // Transportation
    else if (category.includes('transportation') || title.includes('driver') || title.includes('shuttle')) {
      salary = '$18 - $25/hour';
    }
    // Mountain Operations (Grooming, Maintenance, Patrol)
    else if (category.includes('mountain') || title.includes('groomer') || title.includes('patrol') || title.includes('maintenance')) {
      if (title.includes('patrol')) {
        salary = '$20 - $30/hour';
      } else {
        salary = '$18 - $28/hour';
      }
    }
    // Default for other positions
    else {
      salary = '$16 - $24/hour';
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
       (job.company === 'Vail' || job.company === 'Alterra') &&
       (title.includes('instructor') || title.includes('patrol') || title.includes('lift'))) ||
      // International positions usually include housing
      (title.includes('international') || title.includes('j-1') || title.includes('visa'));

    // More accurate company-specific benefits
    const companyName = job.company === 'Vail' ? 'Vail Resorts' : 
                        job.company === 'Alterra' ? 'Alterra Mountain Company' : 
                        job.company === 'Boyne' ? 'Boyne Resorts' : 'the resort';

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
      description: `Join the team at ${job.resort}! This is an excellent opportunity to work at one of ${companyName}'s world-class ski destinations.`,
      requirements: [
        title.includes('certified') ? 'PSIA/AASI Certification required' : 'Experience preferred',
        category.includes('ski') ? 'Intermediate+ skiing/riding ability' : 'Physical fitness required',
        'Excellent customer service skills',
        'Flexible schedule availability',
      ],
      benefits: [
        job.company === 'Vail' ? 'Free Epic Pass (ski 41+ resorts worldwide)' : 
        job.company === 'Alterra' ? 'Free Ikon Pass (ski 50+ resorts worldwide)' : 
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
 * Uses Puppeteer since it's a client-side rendered site
 */
export async function scrapeAlterraJobs(): Promise<ScrapedJob[]> {
  console.log('🏔️ Scraping Alterra Mountain Company jobs...');
  
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
    
    // Go to Alterra jobs page
    await page.goto('https://jobs.alterramtnco.com/jobs?qu=&geo=&lo=&dp=', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Wait for jobs to load
    await page.waitForSelector('.jobListItem, .job-item, [data-job-id], .search-result', { 
      timeout: 15000 
    }).catch(() => console.log('Job selector not found, trying to extract from page anyway'));

    // Extract job data
    const jobs = await page.evaluate(() => {
      const jobElements = document.querySelectorAll('.jobListItem, .job-item, [data-job-id], .search-result, a[href*="/job/"]');
      const scrapedJobs: any[] = [];

      jobElements.forEach((el) => {
        const link = el as HTMLAnchorElement;
        const href = link.href || link.getAttribute('href');
        const title = link.textContent?.trim() || '';
        
        if (href && href.includes('/job/') && title) {
          scrapedJobs.push({
            title,
            url: href.startsWith('http') ? href : `https://jobs.alterramtnco.com${href}`,
          });
        }
      });

      return scrapedJobs;
    });

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
    return formattedJobs.slice(0, 50); // Limit to first 50 for performance
  } catch (error) {
    console.error('Error scraping Alterra:', error);
    return [];
  }
}

/**
 * Scrape Boyne Resorts jobs
 * Uses Puppeteer since it's a JavaScript-rendered site (Angular)
 */
export async function scrapeBoyneJobs(): Promise<ScrapedJob[]> {
  console.log('⛷️ Scraping Boyne Resorts jobs...');
  
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
    
    // Go to Boyne jobs page
    await page.goto('https://careers.boyneresorts.com/all/jobs', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Wait for job listings to load (Angular app)
    await page.waitForSelector('.job-item, .job-listing, [class*="job"], .search-result-item', { 
      timeout: 20000 
    }).catch(() => console.log('Job selector not found, trying to extract anyway'));

    // Give Angular time to render
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Extract job data
    const jobs = await page.evaluate(() => {
      const jobElements = document.querySelectorAll('.job-item, .search-result-item, a[href*="/job/"], [data-job-id]');
      const scrapedJobs: any[] = [];

      jobElements.forEach((el) => {
        const link = el.querySelector('a') || el as HTMLAnchorElement;
        const href = link.href || link.getAttribute('href');
        
        // Try multiple selectors for title
        const titleEl = el.querySelector('.job-title, .jobtitle, h2, h3, [class*="title"]');
        const title = titleEl?.textContent?.trim() || link.textContent?.trim() || '';
        
        // Try to find location
        const locationEl = el.querySelector('.job-location, .location, [class*="location"]');
        const location = locationEl?.textContent?.trim() || '';
        
        if (href && href.includes('/job/') && title && title.length > 3) {
          scrapedJobs.push({
            title,
            location,
            url: href.startsWith('http') ? href : `https://careers.boyneresorts.com${href}`,
          });
        }
      });

      return scrapedJobs;
    });

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
    return formattedJobs.slice(0, 50); // Limit to first 50
  } catch (error) {
    console.error('Error scraping Boyne:', error);
    return [];
  }
}

/**
 * Scrape all jobs from Vail, Alterra, and Boyne
 */
export async function scrapeAllResorts(): Promise<ScrapedJob[]> {
  console.log('⛷️ Scraping ALL resort companies...\n');
  
  const [vailJobs, alterraJobs, boyneJobs] = await Promise.all([
    scrapeAllVailCategories(),
    scrapeAlterraJobs(),
    scrapeBoyneJobs(),
  ]);

  const allJobs = [...vailJobs, ...alterraJobs, ...boyneJobs];
  console.log(`\n🎉 Total jobs from all companies: ${allJobs.length}`);
  console.log(`   - Vail Resorts: ${vailJobs.length}`);
  console.log(`   - Alterra: ${alterraJobs.length}`);
  console.log(`   - Boyne: ${boyneJobs.length}`);
  
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
