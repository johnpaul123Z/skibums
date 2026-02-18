import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/jobs - Returns all jobs from the database (fast).
 * Used by the homepage and /jobs page. Data is refreshed daily by cron.
 */
export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });

    const mapped = jobs.map((j) => ({
      id: j.id,
      title: j.title,
      resort: j.resort,
      location: j.location,
      salary: j.salary,
      type: j.type,
      difficulty: j.difficulty as 1 | 2 | 3,
      image: j.image,
      featured: j.featured,
      description: j.description ?? undefined,
      requirements: j.requirements,
      benefits: j.benefits,
      url: j.url ?? undefined,
      company: j.company as "Vail" | "Alterra" | "Boyne" | "Powdr" | undefined,
      housing: j.housing ?? undefined,
    }));

    return NextResponse.json({
      success: true,
      count: mapped.length,
      source: "database",
      jobs: mapped,
    });
  } catch (error) {
    console.error("Error fetching jobs from DB:", error);
    return NextResponse.json({
      success: true,
      count: 0,
      source: "database",
      jobs: [],
    });
  }
}
