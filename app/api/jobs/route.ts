import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/jobs - Returns jobs from the database.
 * Optional ?q= search term: filters by title, resort, location, or description (case-insensitive).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();

    const where = q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { resort: { contains: q, mode: "insensitive" as const } },
            { location: { contains: q, mode: "insensitive" as const } },
            { description: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : undefined;

    const jobs = await prisma.job.findMany({
      where,
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
      company: j.company as "Vail" | "Alterra" | "Boyne" | "Powdr" | "Other" | undefined,
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
