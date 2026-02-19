"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo, useCallback } from "react";
import SnowHero from "@/components/Hero/SnowHero";
import { Navigation } from "@/components/Layout/Navigation";
import { Footer } from "@/components/Layout/Footer";
import { JobCard3D, Job } from "@/components/Jobs/JobCard3D";
import { JobMap } from "@/components/Jobs/JobMap";
import { AdvancedSearch, FilterState } from "@/components/Jobs/AdvancedSearch";
import { GlassCard } from "@/components/UI/GlassCard";
import { Mountain, Briefcase, Map as MapIcon, Loader2, Map, Sparkles } from "lucide-react";

const SEARCH_DEBOUNCE_MS = 400;

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    state: "",
    resorts: [],
    housing: null,
    minSalary: 0,
    maxSalary: 100000,
  });
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.searchQuery.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [filters.searchQuery]);

  const fetchJobs = useCallback(async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);
      const url = searchTerm ? `/api/jobs?q=${encodeURIComponent(searchTerm)}` : "/api/jobs";
      let response = await fetch(url);
      let data = await response.json();
      if (data.success && Array.isArray(data.jobs) && data.jobs.length === 0 && !searchTerm) {
        response = await fetch("/api/jobs/scrape?category=everything");
        data = await response.json();
      }
      if (data.success && Array.isArray(data.jobs)) {
        setJobs(data.jobs);
        if (data.jobs.length === 0) setError("No jobs found. Try different keywords or clear the search.");
      } else {
        setError("No jobs found at this time. Please check back later.");
      }
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setError("Unable to load jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs(debouncedSearch);
  }, [debouncedSearch, fetchJobs]);

  // Filter jobs based on other criteria (location, housing, salary) — search is done by DB
  const filteredJobs = useMemo(() => {
    const stateAliases: Record<string, string[]> = {
      Colorado: ["colorado", "co"],
      California: ["california", "ca"],
      Utah: ["utah", "ut"],
      Montana: ["montana", "mt"],
      Vermont: ["vermont", "vt"],
      Washington: ["washington", "wa"],
      Idaho: ["idaho", "id"],
      Wyoming: ["wyoming", "wy"],
      Maine: ["maine", "me"],
      NewHampshire: ["new hampshire", "nh"],
      NewYork: ["new york", "ny"],
      Pennsylvania: ["pennsylvania", "pa"],
      WestVirginia: ["west virginia", "wv"],
      Michigan: ["michigan", "mi"],
      Canada: ["canada", "bc", "quebec"],
    };

    return jobs.filter((job) => {
      // State filter
      if (filters.state) {
        const aliases = stateAliases[filters.state] || [filters.state.toLowerCase()];
        const haystack = `${job.location} ${job.resort}`.toLowerCase();
        const stateMatch = aliases.some((alias) => haystack.includes(alias));
        if (!stateMatch) return false;
      }

      // Multi-resort filter
      if (filters.resorts.length > 0) {
        const resortMatch = filters.resorts.some((selected) =>
          job.resort.toLowerCase().includes(selected.toLowerCase()) ||
          selected.toLowerCase().includes(job.resort.toLowerCase())
        );
        if (!resortMatch) return false;
      }

      // Housing filter
      if (filters.housing !== null) {
        if (job.housing !== filters.housing) return false;
      }

      // Salary filter - parse salary string and check minimum
      if (filters.minSalary > 0) {
        const salaryStr = job.salary.toLowerCase();
        // Extract numbers from salary string (e.g., "$20 - $28/hour" or "$35,000 - $55,000")
        const numbers = salaryStr.match(/\d+/g);
        if (numbers) {
          const minJobSalary = parseInt(numbers[0]);
          // If hourly rate and filter is hourly, compare directly
          if (salaryStr.includes('hour') && filters.minSalary < 100) {
            if (minJobSalary < filters.minSalary) return false;
          }
          // If yearly salary
          else if (!salaryStr.includes('hour') && filters.minSalary >= 100) {
            if (minJobSalary < filters.minSalary) return false;
          }
        }
      }

      return true;
    });
  }, [jobs, filters]);

  // Calculate real stats from the jobs data
  const stats = [
    {
      icon: Briefcase,
      value: jobs.length.toLocaleString(),
      label: "Active Jobs",
      gradient: "from-cyan-400 to-blue-500",
    },
    {
      icon: Mountain,
      value: "47",
      label: "Resorts",
      gradient: "from-blue-500 to-purple-500",
    },
    {
      icon: MapIcon,
      value: "4",
      label: "Major Companies",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      <main id="main-content">
      <SnowHero 
        onFilterChange={setFilters}
        totalJobs={jobs.length}
        filteredCount={filteredJobs.length}
      />

      {/* Featured Jobs Section */}
      <section id="jobs" aria-label="Job listings" className="py-12 md:py-24 px-4 md:px-6 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Live{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Opportunities
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              Find ski resort jobs at Vail, Alterra, Boyne & Powdr. Browse seasonal and year-round positions: ski instructor, lift operator, ski patrol, hospitality, and more.
            </p>
            <p className="text-base sm:text-lg text-gray-500 mt-2">
              {jobs.length > 0 
                ? `${jobs.length} positions currently listed.` 
                : "Loading positions..."}
            </p>
            {jobs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <Sparkles className="w-4 h-4" />
                Live from Vail, Alterra, Boyne & Powdr Resorts
              </motion.div>
            )}
          </motion.div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
              <p className="text-gray-400">Loading live jobs from Vail, Alterra, Boyne & Powdr...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="glass rounded-2xl p-8 max-w-md text-center">
                <p className="text-red-400 mb-2">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="glass rounded-2xl p-8 max-w-md text-center">
                <p className="text-gray-400 mb-2">No jobs match your search criteria.</p>
                <p className="text-sm text-gray-500">Try adjusting your filters or search terms.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Interactive Job Map */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <div className="glass rounded-2xl p-4 md:p-6 mb-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg">
                      <Map className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-white">Explore Jobs by Location</h3>
                      <p className="text-sm md:text-base text-gray-400">Click resort markers to see available positions</p>
                    </div>
                  </div>
                  <JobMap jobs={filteredJobs} />
                </div>
              </motion.div>

              {/* Job Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 perspective-1000">
                {filteredJobs.slice(0, 12).map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <JobCard3D job={job} />
                  </motion.div>
                ))}
              </div>

              {filteredJobs.length > 12 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-center mt-12"
                >
                  <p className="text-sm md:text-base text-gray-400 mb-4 px-4">
                    Showing 12 of {filteredJobs.length} jobs. Use the map above to explore all positions.
                  </p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section aria-label="Statistics" className="py-12 md:py-24 px-4 md:px-6 bg-slate-800">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="text-center">
                  <div
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} mb-4`}
                  >
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Resorts Section */}
      <section id="resorts" aria-label="Resort partners and destinations" className="py-12 md:py-20 px-4 md:px-6 bg-slate-800 border-t border-white/10">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Resorts</h2>
            <p className="text-gray-400">Live job sources across Vail, Alterra, Boyne, Powdr and partner resort pages.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard>
              <h3 className="text-white font-semibold mb-3">Major Operators</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>Vail Resorts (Epic Pass)</li>
                <li>Alterra Mountain Company (Ikon Pass)</li>
                <li>Boyne Resorts</li>
                <li>Powdr</li>
              </ul>
            </GlassCard>
            <GlassCard>
              <h3 className="text-white font-semibold mb-3">Included Destinations</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Examples include Vail, Breckenridge, Mammoth Mountain, Deer Valley Resort, Big Bear Mountain Resort,
                Jackson Hole Mountain Resort, Sun Valley Resort, Big Sky, and more.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" aria-label="About SkiJobs" className="py-12 md:py-24 px-4 md:px-6 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              About{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                SkiJobs
              </span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mb-8"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6 md:p-8">
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p className="text-base md:text-lg">
                  <span className="text-cyan-400 font-bold">SkiJobs</span> is your gateway to finding dream careers at world-class ski resorts. 
                  We aggregate job opportunities from the largest resort operators in North America, including <span className="text-white font-semibold">Vail Resorts</span> (Epic Pass), 
                  <span className="text-white font-semibold"> Alterra Mountain Company</span> (Ikon Pass), and <span className="text-white font-semibold">Boyne Resorts</span>.
                </p>
                
                <p className="text-base md:text-lg">
                  Whether you're a certified ski instructor, aspiring ski patrol, lift operator, chef, or hospitality professional, 
                  we connect you with hundreds of positions across <span className="text-cyan-400 font-semibold">47 resorts</span> spanning Colorado, Utah, California, Vermont, and beyond.
                </p>

                <p className="text-base md:text-lg">
                  Our platform makes it easy to explore opportunities by location, search for specific roles, filter by housing availability, 
                  and discover competitive salaries. Live your best life on the mountain while building a rewarding career in the ski industry.
                </p>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-gray-400 italic">
                    🎿 Jobs updated daily from Vail Resorts, Alterra Mountain Company, Boyne Resorts, and Powdr career pages.
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" aria-label="Contact SkiJobs" className="py-12 md:py-20 px-4 md:px-6 bg-slate-900 border-t border-white/10">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Contact
            </h2>
            <p className="text-gray-400 mb-6">
              Questions, partnerships, or listing corrections? Reach us directly.
            </p>
            <a
              href="mailto:customsites21@gmail.com"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold transition-colors"
            >
              customsites21@gmail.com
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
      </main>
    </div>
  );
}
