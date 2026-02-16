"use client";

import { motion } from "framer-motion";
import { Snowflake } from "lucide-react";
import { WeatherWidget } from "./WeatherWidget";
import { AdvancedSearch, FilterState } from "../Jobs/AdvancedSearch";

interface SnowHeroProps {
  onFilterChange: (filters: FilterState) => void;
  totalJobs: number;
  filteredCount: number;
}

export default function SnowHero({ onFilterChange, totalJobs, filteredCount }: SnowHeroProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Snow Layer */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        {[...Array(80)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `-10px`,
            }}
            animate={{
              y: [0, typeof window !== "undefined" ? window.innerHeight + 50 : 1000],
              x: [0, Math.random() * 100 - 50],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: Math.random() * 8 + 5,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Mountain Silhouette Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none" />

      {/* Weather Widget - Hidden on mobile for better UX */}
      <div className="hidden md:block absolute top-8 right-8 z-20">
        <WeatherWidget />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 py-20">
        {/* Animated Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="inline-block mb-4"
          >
            <Snowflake className="w-12 h-12 md:w-16 md:h-16 text-cyan-400" strokeWidth={1.5} />
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white tracking-tight">
            Find Your{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              Peak
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mt-4 font-light px-4">
            Dream jobs at world-class ski resorts
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-12 text-white"
        >
          {[
            { label: "Active Jobs", value: totalJobs > 0 ? `${totalJobs}` : "240+" },
            { label: "Resorts", value: "47" },
            { label: "Companies", value: "3" },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + idx * 0.1 }}
              className="text-center"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Advanced Search - Moved into Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-8 w-full max-w-5xl px-4"
        >
          <AdvancedSearch
            onFilterChange={onFilterChange}
            totalJobs={totalJobs}
            filteredCount={filteredCount}
          />
        </motion.div>
      </div>
    </div>
  );
}
