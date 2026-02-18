import type { Metadata } from "next";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skijobs.net";

export const metadata: Metadata = {
  title: "Ski Resort Jobs",
  description:
    "Browse ski resort jobs at Vail, Alterra, Boyne & Powdr. Seasonal and year-round positions: ski instructor, lift ops, patrol, hospitality, and more.",
  openGraph: {
    title: "Ski Resort Jobs | SkiJobs",
    description: "Browse ski resort jobs at 47+ mountains. Vail, Alterra, Boyne & Powdr.",
    url: `${baseUrl}/jobs`,
  },
  alternates: { canonical: `${baseUrl}/jobs` },
};

// Revalidate this page every 24 hours so job list stays fresh for crawlers
export const revalidate = 86400;

async function getJobs() {
  try {
    let res = await fetch(`${baseUrl}/api/jobs`, { next: { revalidate: 3600 } });
    let data = await res.json();
    if (data?.success && Array.isArray(data.jobs) && data.jobs.length > 0) return data.jobs;
    res = await fetch(`${baseUrl}/api/jobs/scrape?category=everything`, { next: { revalidate: 3600 } });
    data = await res.json();
    if (data?.success && Array.isArray(data.jobs)) return data.jobs;
  } catch {
    // ignore
  }
  return [];
}

export default async function JobsPage() {
  const jobs = await getJobs();

  const jobPostingsLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: jobs.length,
    itemListElement: jobs.slice(0, 50).map(
      (job: { id: string; title: string; description?: string; url?: string; resort: string; location: string; company?: string }, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "JobPosting",
          title: job.title,
          description: job.description || `Ski resort job at ${job.resort}. ${job.location}`,
          url: job.url || `${baseUrl}/#jobs`,
          hiringOrganization: {
            "@type": "Organization",
            name: job.company === "Vail" ? "Vail Resorts" : job.company === "Alterra" ? "Alterra Mountain Company" : job.company === "Boyne" ? "Boyne Resorts" : job.company === "Powdr" ? "Powdr" : "Ski Resort",
          },
          jobLocation: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              addressLocality: job.resort,
              addressRegion: job.location,
            },
          },
        },
      })
    ),
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingsLd) }}
      />
      <header className="border-b border-slate-800 bg-slate-900/50 px-4 py-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold">Ski Resort Jobs</h1>
          <p className="mt-2 text-slate-400">
            Seasonal and year-round positions at Vail, Alterra, Boyne & Powdr resorts. Ski instructor, lift operator, patrol, hospitality, and more.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-cyan-400 hover:text-cyan-300"
          >
            ← Back to SkiJobs home
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        {jobs.length === 0 ? (
          <p className="text-slate-400">No jobs loaded. Check back soon or visit the homepage.</p>
        ) : (
          <ul className="space-y-3">
            {jobs.map((job: { id: string; title: string; resort: string; location: string; url?: string }) => (
              <li key={job.id} className="rounded-lg border border-slate-800 bg-slate-900/30 px-4 py-3">
                <a
                  href={job.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-white hover:text-cyan-400"
                >
                  {job.title}
                </a>
                <p className="mt-1 text-sm text-slate-400">
                  {job.resort} · {job.location}
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
