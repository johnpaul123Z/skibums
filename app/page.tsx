"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import SnowHero from "@/components/Hero/SnowHero";
import { Navigation } from "@/components/Layout/Navigation";
import { Footer } from "@/components/Layout/Footer";
import { JobCard3D, Job } from "@/components/Jobs/JobCard3D";
import { JobMap } from "@/components/Jobs/JobMap";
import { AdvancedSearch, FilterState } from "@/components/Jobs/AdvancedSearch";
import { GlassCard } from "@/components/UI/GlassCard";
import { Mountain, Briefcase, Map as MapIcon, Loader2, Map, Sparkles } from "lucide-react";

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    location: "",
    housing: null,
    minSalary: 0,
    maxSalary: 100000,
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // Fetch from BOTH Vail and Alterra (category=everything)
        const response = await fetch('/api/jobs/scrape?category=everything');
        const data = await response.json();
        
        if (data.success && data.jobs.length > 0) {
          setJobs(data.jobs);
        } else {
          setError('No jobs found at this time. Please check back later.');
        }
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
        setError('Unable to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on search criteria
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch = 
          job.title.toLowerCase().includes(query) ||
          job.resort.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query) ||
          job.description?.toLowerCase().includes(query);
        
        if (!matchesSearch) return false;
      }

      // Location filter
      if (filters.location) {
        const locationMatch = 
          job.resort.toLowerCase().includes(filters.location.toLowerCase()) ||
          job.location.toLowerCase().includes(filters.location.toLowerCase());
        
        if (!locationMatch) return false;
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
      value: "3",
      label: "Major Companies",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      <SnowHero 
        onFilterChange={setFilters}
        totalJobs={jobs.length}
        filteredCount={filteredJobs.length}
      />

      {/* Featured Jobs Section */}
      <section id="jobs" className="py-24 px-6 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Live{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Opportunities
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              {jobs.length > 0 
                ? `${jobs.length} positions from Vail + Alterra + Boyne` 
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
                Live from Vail, Alterra & Boyne Resorts
              </motion.div>
            )}
          </motion.div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
              <p className="text-gray-400">Loading live jobs from Vail + Alterra + Boyne...</p>
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
                <div className="glass rounded-2xl p-6 mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg">
                      <Map className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Explore Jobs by Location</h3>
                      <p className="text-gray-400">Click resort markers to see available positions</p>
                    </div>
                  </div>
                  <JobMap jobs={filteredJobs} />
                </div>
              </motion.div>

              {/* Job Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
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
                  <p className="text-gray-400 mb-4">
                    Showing 12 of {filteredJobs.length} jobs. Use the map above to explore all positions.
                  </p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 bg-slate-800">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

      <Footer />
    </div>
  );
}
