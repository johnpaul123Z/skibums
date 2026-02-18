import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scrapeAllResorts, convertToJobFormat } from "@/lib/scraper";

function checkAuth(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  return authHeader === `Bearer ${secret}`;
}

/**
 * GET/POST /api/jobs/refresh - Clear all jobs, scrape, then refill.
 * Called daily by Vercel Cron at 2 AM CT (08:00 UTC). Set CRON_SECRET in Vercel env.
 */
export async function GET(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return runRefresh();
}

export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return runRefresh();
}

async function runRefresh() {
  try {
    console.log("🔄 Jobs refresh: scraping all resorts...");
    const scraped = await scrapeAllResorts();
    const jobs = convertToJobFormat(scraped);

    console.log(`🔄 Jobs refresh: clearing table, inserting ${jobs.length}...`);
    await prisma.job.deleteMany({}); // clear all rows, then refill

    if (jobs.length > 0) {
      await prisma.job.createMany({
        data: jobs.map((j) => ({
          id: j.id,
          title: j.title,
          resort: j.resort,
          location: j.location,
          salary: j.salary,
          type: j.type,
          difficulty: j.difficulty,
          image: j.image,
          featured: j.featured ?? false,
          description: j.description ?? null,
          requirements: j.requirements ?? [],
          benefits: j.benefits ?? [],
          url: j.url ?? null,
          company: j.company ?? null,
          housing: j.housing ?? null,
        })),
      });
    }

    console.log(`✅ Jobs refresh: done. ${jobs.length} jobs in DB.`);
    return NextResponse.json({
      success: true,
      count: jobs.length,
      message: `Refreshed with ${jobs.length} jobs`,
    });
  } catch (error) {
    console.error("Jobs refresh error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
