"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Search, MapPin, Briefcase, Building2, Home, X } from "lucide-react";

interface SearchFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  totalJobs: number;
  filteredCount: number;
}

export interface FilterState {
  searchQuery: string;
  company: string;
  location: string;
  jobType: string;
  housing: string;
}

export function SearchFilters({ onFilterChange, totalJobs, filteredCount }: SearchFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    company: "all",
    location: "all",
    jobType: "all",
    housing: "all",
  });

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      searchQuery: "",
      company: "all",
      location: "all",
      jobType: "all",
      housing: "all",
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = filters.searchQuery || 
    filters.company !== "all" || 
    filters.location !== "all" || 
    filters.jobType !== "all" || 
    filters.housing !== "all";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg">
            <Search className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Search & Filter Jobs</h3>
            <p className="text-gray-400">
              Showing {filteredCount} of {totalJobs} jobs
            </p>
          </div>
        </div>
        
        {hasActiveFilters && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearFilters}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search Query */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Search by Title or Keyword
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => updateFilter("searchQuery", e.target.value)}
              placeholder="e.g., Ski Instructor, Lift Operator..."
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
            />
          </div>
        </div>

        {/* Company Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Company
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filters.company}
              onChange={(e) => updateFilter("company", e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all appearance-none cursor-pointer"
            >
              <option value="all" className="bg-slate-800">All Companies</option>
              <option value="vail" className="bg-slate-800">Vail Resorts (Epic)</option>
              <option value="alterra" className="bg-slate-800">Alterra (Ikon)</option>
            </select>
          </div>
        </div>

        {/* Job Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Position Type
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filters.jobType}
              onChange={(e) => updateFilter("jobType", e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all appearance-none cursor-pointer"
            >
              <option value="all" className="bg-slate-800">All Types</option>
              <option value="Full-time" className="bg-slate-800">Full-time</option>
              <option value="Part-time" className="bg-slate-800">Part-time</option>
              <option value="Seasonal" className="bg-slate-800">Seasonal</option>
              <option value="Contract" className="bg-slate-800">Contract</option>
            </select>
          </div>
        </div>

        {/* Housing Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Housing Benefits
          </label>
          <div className="relative">
            <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filters.housing}
              onChange={(e) => updateFilter("housing", e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all appearance-none cursor-pointer"
            >
              <option value="all" className="bg-slate-800">All Options</option>
              <option value="yes" className="bg-slate-800">Housing Provided</option>
              <option value="no" className="bg-slate-800">No Housing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Location Filter - Full Width Row */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Location / Resort
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={filters.location}
            onChange={(e) => updateFilter("location", e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all appearance-none cursor-pointer"
          >
            <option value="all" className="bg-slate-800">All Locations</option>
            <optgroup label="Colorado" className="bg-slate-800">
              <option value="Vail" className="bg-slate-800">Vail</option>
              <option value="Breckenridge" className="bg-slate-800">Breckenridge</option>
              <option value="Beaver Creek" className="bg-slate-800">Beaver Creek</option>
              <option value="Keystone" className="bg-slate-800">Keystone</option>
              <option value="Crested Butte" className="bg-slate-800">Crested Butte</option>
              <option value="Steamboat" className="bg-slate-800">Steamboat</option>
              <option value="Winter Park" className="bg-slate-800">Winter Park</option>
            </optgroup>
            <optgroup label="California" className="bg-slate-800">
              <option value="Heavenly" className="bg-slate-800">Heavenly</option>
              <option value="Northstar" className="bg-slate-800">Northstar</option>
              <option value="Kirkwood" className="bg-slate-800">Kirkwood</option>
              <option value="Palisades" className="bg-slate-800">Palisades Tahoe</option>
              <option value="Mammoth" className="bg-slate-800">Mammoth</option>
            </optgroup>
            <optgroup label="Utah" className="bg-slate-800">
              <option value="Park City" className="bg-slate-800">Park City</option>
              <option value="Deer Valley" className="bg-slate-800">Deer Valley</option>
              <option value="Solitude" className="bg-slate-800">Solitude</option>
            </optgroup>
            <optgroup label="Vermont" className="bg-slate-800">
              <option value="Stowe" className="bg-slate-800">Stowe</option>
              <option value="Okemo" className="bg-slate-800">Okemo</option>
              <option value="Mount Snow" className="bg-slate-800">Mount Snow</option>
              <option value="Stratton" className="bg-slate-800">Stratton</option>
              <option value="Sugarbush" className="bg-slate-800">Sugarbush</option>
            </optgroup>
            <optgroup label="Washington" className="bg-slate-800">
              <option value="Stevens" className="bg-slate-800">Stevens Pass</option>
              <option value="Crystal" className="bg-slate-800">Crystal Mountain</option>
            </optgroup>
            <optgroup label="Other States" className="bg-slate-800">
              <option value="Hunter" className="bg-slate-800">Hunter Mountain (NY)</option>
              <option value="Seven Springs" className="bg-slate-800">Seven Springs (PA)</option>
              <option value="Schweitzer" className="bg-slate-800">Schweitzer (ID)</option>
              <option value="Snowshoe" className="bg-slate-800">Snowshoe (WV)</option>
            </optgroup>
            <optgroup label="Canada" className="bg-slate-800">
              <option value="Whistler" className="bg-slate-800">Whistler Blackcomb</option>
              <option value="Tremblant" className="bg-slate-800">Tremblant</option>
              <option value="Blue" className="bg-slate-800">Blue Mountain</option>
            </optgroup>
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 pt-4 border-t border-white/10"
        >
          <div className="flex flex-wrap gap-2">
            {filters.searchQuery && (
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">
                "{filters.searchQuery}"
              </span>
            )}
            {filters.company !== "all" && (
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                {filters.company === "vail" ? "Vail Resorts" : "Alterra"}
              </span>
            )}
            {filters.location !== "all" && (
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                {filters.location}
              </span>
            )}
            {filters.jobType !== "all" && (
              <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                {filters.jobType}
              </span>
            )}
            {filters.housing !== "all" && (
              <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">
                {filters.housing === "yes" ? "Housing Provided" : "No Housing"}
              </span>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
